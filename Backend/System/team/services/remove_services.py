from typing import Tuple
from team.models import Project, Invite, ProjectMember, ActivityLog
from authentication.models import User
from django.core.exceptions import ValidationError, PermissionDenied

def is_admin(project: Project, user) -> bool:
    return ProjectMember.objects.filter(project=project, user=user, role='admin').exists()

def remove_member(project: Project, acting_user: User, target_user: User) -> None:

    # Check membership
    member = ProjectMember.objects.filter(project=project, user=target_user).first()
    if not member:
        raise ValidationError("User is not a member of this project.")

    # Solo project cannot be left/removed
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
