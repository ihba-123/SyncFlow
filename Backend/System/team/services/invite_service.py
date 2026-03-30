import hashlib
import secrets
from datetime import timedelta
from typing import Tuple, Optional
from django.db import transaction, IntegrityError
from django.core.exceptions import ValidationError, PermissionDenied
from django.utils import timezone

# Channels imports
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from team.models import Project, Invite, ProjectMember
from authentication.models import User
from activitylog.activity.services import ActivityAction, log_activity

def is_admin(project: Project, user: User) -> bool:
    return ProjectMember.objects.filter(project=project, user=user, role='admin').exists()


def project_write_permission(project: Project, user: User):
    member = ProjectMember.objects.filter(project=project, user=user).first()
    if not member or member.role == 'viewer':
        raise PermissionDenied("You do not have permission to modify this project.")
    
    

def create_project_invite(
    project: Project,
    created_by: User,
    role: str,
    expires_days: int = 3,
    invited_email: str = None
) -> Tuple[str, str, int]:
    if not is_admin(project, created_by):
        raise PermissionDenied("You do not have permission to invite members.")

    valid_roles = {choice[0] for choice in Invite._meta.get_field('role').choices}
    if role not in valid_roles:
        raise ValidationError(f"Invalid role selected: {role}")

    if invited_email:
        invited_email = invited_email.lower()
        if invited_email == created_by.email.lower():
            raise ValidationError("You cannot invite yourself.")
        if ProjectMember.objects.filter(project=project, user__email__iexact=invited_email).exists():
            raise ValidationError("This user is already a member of this project.")

    raw_token = secrets.token_urlsafe(32)
    hashed_token = hashlib.sha256(raw_token.encode()).hexdigest()

    with transaction.atomic():
        Invite.objects.create(
            project=project,
            created_by=created_by,
            role=role,
            token=hashed_token,
            expires_at=timezone.now() + timedelta(days=expires_days),
            invited_email=invited_email,
        )
        
        log_activity(
            project=project,
            user=created_by,
            action_type=ActivityAction.INVITE_CREATED,
            details=f"Invite created for {invited_email or 'anyone'} as {role}"
        )

    # --- BROADCAST NEW INVITE ---
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"project_{project.id}",
        {
            "type": "project_update",
            "data": {
                "action": "invite_created",
                "invited_email": invited_email,
                "role": role,
                "created_by": created_by.email
            }
        }
    )

    invite_url = f"http://localhost:5173/join/{raw_token}"
    return invite_url, raw_token, expires_days



def use_invite(plain_token: str, user: User) -> Tuple[Project, Optional[any]]:
    clean_token = plain_token.strip()
    hashed = hashlib.sha256(clean_token.encode()).hexdigest()

    with transaction.atomic():
        try:
            invite = Invite.objects.select_for_update().select_related("project").get(token=hashed)
        except Invite.DoesNotExist:
            raise ValidationError("The invite link is invalid or has been revoked.")

        if invite.is_used:
            raise ValidationError("This invite has already been used.")
        if invite.expires_at < timezone.now():
            raise ValidationError("This invite link has expired.")
        if invite.invited_email and invite.invited_email != user.email.lower():
            raise ValidationError("This invite was intended for a different email address.")
        if invite.project.is_solo:
            raise ValidationError("This is a private solo project.")

        # If already a member, just return
        if ProjectMember.objects.filter(project=invite.project, user=user).exists():
            return invite.project, getattr(invite.project, 'chat_room', None)

        try:
            ProjectMember.objects.create(
                project=invite.project,
                user=user,
                role=invite.role,
                invite_used=invite
            )
        except IntegrityError:
            raise ValidationError("Error joining the project.")

        invite.is_used = True
        invite.save(update_fields=["is_used"])

        chat_room = getattr(invite.project, 'chat_room', None)
        if chat_room:
            chat_room.add_participant(user)

        log_activity(
            project=invite.project,
            user=user,
            action_type=ActivityAction.MEMBER_ADDED,
            details=f"{user.email} joined via invite"
        )

    # --- BROADCAST NEW MEMBER JOINED ---
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"project_{invite.project.id}",
        {
            "type": "project_update",
            "data": {
                "action": "member_joined",
                "user_id": user.id,
                "email": user.email,
                "role": invite.role
            }
        }
    )

    return invite.project, chat_room