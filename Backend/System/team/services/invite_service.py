from typing import Tuple
from team.models import Project, Invite, ProjectMember, ActivityLog
from authentication.models import User
from django.core.exceptions import ValidationError, PermissionDenied
from django.db import transaction
from django.utils import timezone
from datetime import timedelta
import hashlib


def is_admin(project: Project, user: User) -> bool:
    return ProjectMember.objects.filter(project=project, user=user, role='admin').exists()


def is_invite(
    project: Project,
    created_by: User,
    role: str,
    expires_days: int = 3,
    invited_email: str = None
) -> Tuple[str, str]:

    if not is_admin(project, created_by):
        raise PermissionDenied("You are not an admin of this project.")

    valid_roles = {choice[0] for choice in Invite._meta.get_field('role').choices}
    if role not in valid_roles:
        raise ValidationError("Invalid role selected.")
    

    if invited_email and invited_email.lower() == created_by.email.lower():
        raise ValidationError("You cannot invite yourself.")

    if invited_email:
        try:
            target_user = User.objects.get(email__iexact=invited_email)
            if ProjectMember.objects.filter(project=project, user=target_user).exists():
                raise ValidationError("This user is already a member of the project.")
        except User.DoesNotExist:
            pass 

    with transaction.atomic():
        invite = Invite.objects.create(
            project=project,
            created_by=created_by,
            role=role,
            expires_at=timezone.now() + timedelta(days=expires_days),
            invited_email=invited_email,
        )

        ActivityLog.objects.create(
            project=project,
            user=created_by,
            action='invite_sent',
            details=f"Sent invite for role '{role}' (expires in {expires_days} days)"
        )

        invite_url = f"http://localhost:5173/join/{invite.plain_token}"
        return invite_url, invite.plain_token


def use_invite(plain_token: str, user: User) -> Project:
    hashed = hashlib.sha256(plain_token.encode()).hexdigest()

    try:
        invite = Invite.objects.select_related("project", "project__chat_room").get(token=hashed)
    except Invite.DoesNotExist:
        raise ValidationError("Invalid or expired invite token.")

    if invite.is_used:
        raise ValidationError("This invite has already been used.")

    if invite.expires_at < timezone.now():
        raise ValidationError("This invite has expired.")

    if invite.invited_email and invite.invited_email.lower() != user.email.lower():
        raise ValidationError("This invite is restricted to a different email address.")

    if invite.project.is_solo:
        raise ValidationError("Cannot join a solo project.")

    if ProjectMember.objects.filter(project=invite.project, user=user).exists():
        raise ValidationError("You are already a member of this project.")

    with transaction.atomic():
        ProjectMember.objects.create(
            project=invite.project,
            user=user,
            role=invite.role,
            invite_used=invite,
        )

        invite.is_used = True
        invite.save(update_fields=["is_used"])

        if invite.project.chat_room:
            invite.project.chat_room.add_participant(user)

        ActivityLog.objects.create(
            project=invite.project,
            user=user,
            action='member_added',
            details=f"{user.email} joined as {invite.role} via invite"
        )

    return invite.project




# Adding helper function to prevent project from viewer being modified
def project_write_permission(project: Project, user:User):
    member = ProjectMember.objects.filter(project=project, user=user).first()
    if not member or member.role == 'viewer':
        raise PermissionDenied("You do not have permission to modify this project.")