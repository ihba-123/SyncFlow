from typing import Tuple
from team.models import Project, Invite, ProjectMember, ActivityLog
from authentication.models import User
from django.core.exceptions import ValidationError, PermissionDenied
from django.db import transaction
from ..services.invite_service import project_write_permission
from ..models import ActivityLog
import logging

logger = logging.getLogger(__name__)

def is_admin(project: Project, user) -> bool:
    return ProjectMember.objects.filter(project=project, user=user, role='admin').exists()

def remove_member(project: Project, acting_user: User, target_user: User) -> None:

    # Check membership
    member = ProjectMember.objects.filter(project=project, user=target_user).first()
    if not member:
        raise ValidationError("User is not a member of this project.")

    if project.is_solo:
        raise ValidationError("Cannot leave or remove members from a solo project.")

    
    if acting_user == target_user:
        member.delete()
        ActivityLog.objects.create(
            project=project,
            user=acting_user,
            action='member_left',
            details=f"{acting_user.email} left the project"
        )
        return

    
    if not is_admin(project, acting_user):
        raise PermissionDenied("Only admins can remove other members.")

    
    if acting_user == target_user:
        raise PermissionDenied("Admins cannot remove themselves.")

    
    if member.role == 'admin':
        raise PermissionDenied("Admins cannot remove other admins.")

    
    member.delete()
    ActivityLog.objects.create(
        project=project,
        user=acting_user,
        action='member_removed',
        details=f"{acting_user.email} removed {target_user.email}"
    )

def project_delete(project, user):
   
    try:
        current_member = project.members.get(user=user)
    except ProjectMember.DoesNotExist:
        raise PermissionDenied("You are not a member of this project.")


    if current_member.role not in ["Admin", "admin"]:
        logger.warning(f"User {user.email} attempted to delete project {project.name} without Admin rights.")
        raise PermissionDenied("Only an Admin can delete this project.")

    activitylog = ActivityLog.objects.select_for_update().filter(project=project)

    with transaction.atomic():
        if project.is_solo:
        
            owner = project.members.first().user
            if owner != user:
                raise PermissionDenied("You do not own this solo project.")
            
            activitylog.delete()
            project.delete()
            logger.info(f"Solo project {project.name} deleted by owner {user.email}")
            return

        activitylog.delete()
        project.members.all().delete()
        project.invites.all().delete()
        
        if project.chat_room:
            project.chat_room.messages.all().delete()
            project.chat_room.delete()

        project.delete()
        logger.info(f"Team project {project.name} deleted by admin {user.email}")


