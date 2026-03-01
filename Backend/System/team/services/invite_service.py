import hashlib
import secrets
from datetime import timedelta
from typing import Tuple, Optional
from django.db import transaction, IntegrityError
from django.core.exceptions import ValidationError, PermissionDenied
from django.utils import timezone
from team.models import Project, Invite, ProjectMember, ActivityLog
from authentication.models import User

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
) -> Tuple[str, str]:
    # 1. Permission & Validation Checks
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

    # 2. Token Generation (Only once!)
    raw_token = secrets.token_urlsafe(32)
    hashed_token = hashlib.sha256(raw_token.encode()).hexdigest()

    # 3. Database Operations
    with transaction.atomic():
        Invite.objects.create(
            project=project,
            created_by=created_by,
            role=role,
            token=hashed_token,
            expires_at=timezone.now() + timedelta(days=expires_days),
            invited_email=invited_email,
        )
        
        ActivityLog.objects.create(
            project=project,
            user=created_by,
            action='invite_created',
            details=f"Invite created for {invited_email or 'anyone'} as {role}."
        )

    invite_url = f"http://localhost:5173/join/{raw_token}"
    return invite_url, raw_token

def use_invite(plain_token: str, user: User) -> Tuple[Project, Optional[any]]:
    clean_token = plain_token.strip()
    hashed = hashlib.sha256(clean_token.encode()).hexdigest()

    with transaction.atomic():
        try:
            print(f"Searching for hash: {hashed}")
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
            raise ValidationError("Error joining the project. Please try again.")

        invite.is_used = True
        invite.save(update_fields=["is_used"])

        chat_room = getattr(invite.project, 'chat_room', None)
        if chat_room:
            chat_room.add_participant(user)

        ActivityLog.objects.create(
            project=invite.project,
            user=user,
            action='member_joined',
            details=f"User {user.email} joined via invite."
        )

    return invite.project, chat_room