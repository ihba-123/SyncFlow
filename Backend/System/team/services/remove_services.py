from typing import Optional
from django.core.exceptions import PermissionDenied, ValidationError
from django.db import transaction
from django.shortcuts import get_object_or_404
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import logging

from ..models import Project, ProjectMember, Invite
from activitylog.activity.services import log_activity , ActivityAction
from authentication.models import User

logger = logging.getLogger(__name__)


def is_admin(project: Project, user: User) -> bool:
    return ProjectMember.objects.filter(project=project, user=user, role='admin').exists()

def remove_member(project: Project, acting_user: User, target_user: User) -> None:
    member = ProjectMember.objects.filter(project=project, user=target_user).first()
    if not member:
        raise ValidationError("User is not a member of this project.")

    if project.is_solo:
        raise ValidationError("Cannot leave or remove members from a solo project.")

    # --- THE "LAST ADMIN" PROTECTION ---
    if member.role == 'admin':
        admin_count = ProjectMember.objects.filter(project=project, role='admin').count()
        if admin_count <= 1:
            raise ValidationError(
                "You are the last admin. You must promote another member to admin before leaving or being removed."
            )
    # ------------------------------------

    # User leaving themselves
    if acting_user == target_user:
        member.delete()
        if target_user.last_active_project == project:
            target_user.last_active_project = None
            target_user.save(update_fields=["last_active_project"])

        log_activity(
            project=project,
            user=acting_user,
            action_type='member_left',
            details=f"{acting_user.email} left the project"
        )
        # Add WebSocket broadcast for leaving too! (Optional but recommended)
        return

    # Admin removing someone else
    if not is_admin(project, acting_user):
        raise PermissionDenied("Only admins can remove other members.")

    # If an admin is trying to remove another admin
    if member.role == 'admin':
        raise PermissionDenied("Admins cannot remove other admins. Demote them first.")

    member.delete()
    if target_user.last_active_project == project:
        target_user.last_active_project = None
        target_user.save(update_fields=["last_active_project"])

    # Broadcast removal via WebSocket
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"project_{project.id}",
        {
            "type": "project_update",
            "data": {
                "action": "member_removed",
                "target_user_id": target_user.id,
                "target_email": target_user.email,
                "acting_user": acting_user.email
            }
        }
    )

    log_activity(
        project=project,
        user=acting_user,
        action_type=ActivityAction.MEMBER_REMOVED,
        details=f"{acting_user.email} removed {target_user.email}"
    )




def project_delete(project_id: int, user: User):
    # 1. Fetch the project fresh
    project = get_object_or_404(Project, id=project_id)

    # 2. Check permissionsproje
    try:
        current_member = ProjectMember.objects.get(project=project, user=user)
    except ProjectMember.DoesNotExist:
        raise PermissionDenied("You are not a member of this project.")

    if current_member.role.lower() != "admin":
        raise PermissionDenied("Only an Admin can delete this project.")

    project_name = project.name  # Save name for logs and broadcasts

    with transaction.atomic():
        # 3. Log the deletion
        log_activity(
            project=project,
            user=user,
            action_type=ActivityAction.PROJECT_DELETED,
            details=f"Project '{project_name}' deleted by {user.email}"
        )

        # 4. Reset last_active_project for all members safely
        User.objects.filter(last_active_project=project).update(last_active_project=None)

        # 5. Delete related objects using filter (safe)
        ProjectMember.objects.filter(project_id=project_id).delete()
        Invite.objects.filter(project_id=project_id).delete()

        # 6. Delete chat room if exists
        if hasattr(project, 'chat_room') and project.chat_room:
            project.chat_room.delete()

        # 7. Finally, delete the project itself
        project.delete()
        logger.info(f"Project id={project_id} deleted successfully.")

    # 8. Broadcast deletion over WebSocket
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"project_{project_id}",
        {
            "type": "project_update",
            "data": {
                "action": ActivityAction.PROJECT_DELETED,
                "details": f"Project '{project_name}' has been deleted."
            }
        }
    )