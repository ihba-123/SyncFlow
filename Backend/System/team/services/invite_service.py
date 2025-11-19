from typing import Tuple,Dict
from team.models import Project , Invite , ProjectMember,ActivityLog
from django.core.exceptions import ValidationError, PermissionDenied
from django.db import transaction
from datetime import timedelta
from django.utils import timezone

def is_admin(project:Project , user)->bool:
  return ProjectMember.objects.filter(project=project , user=user , role='admin').exists()

  
def is_invite(project:Project,created_by , role:str , expires_days:int=3,invited_email:str=None)->Tuple[str , str]:
   #Check admin
   if not is_admin(project, created_by):
      raise(PermissionDenied("You are not admin of this project."))
   
   #validate role
   valid_role = dict(Invite._meta.get_field('role').choices).keys()
   if role not in valid_role:
      raise ValidationError("Invalid role", code='invalid_role')
   
   with transaction.atomic():
    invite = Invite.objects.create(project=project , 
    created_by=created_by , role=role , expires_at=timezone.now() + timedelta(days=expires_days))

    #Activity log 
    ActivityLog.objects.create(project=project, user=created_by , action='invite_sent' , details=f"Invite for role '{role}' (expires in {expires_days} days)",)

    invite_url = f"https://syncflow.com/join?token={invite.plain_token}"
    print(invite.plain_token , invite_url)
    return invite_url , invite.plain_token
   

def use_invite(plain_token:str , user)->Project:
  
  import hashlib
  hashed = hashlib.sha256(plain_token.encode()).hexdigest()
  try:
    invite = Invite.objects.select_related("project","project__chat_room").get(token=hashed)
   
  except Invite.DoesNotExist:
    raise ValidationError("Invalid invite token.")
  
  if invite.is_used:
    raise ValidationError("This invite has already been used.")
  if invite.expires_at < timezone.now():
    raise ValidationError("Token is already expire !")
  if invite.invited_email and invite.invited_email != user.email:
    raise ValidationError("This invite is restricted to a different email.")
  
  #Already memmber
  if ProjectMember.objects.filter(project=invite.project , user=user).exists():
    raise ValidationError("You are already a member of this project.")
  
  with transaction.atomic():
    ProjectMember.objects.create(
      project=invite.project,
      user=user,
      role=invite.role,
      invite_used=invite,
    )
    
    invite.is_used=True
    invite.save(update_fields=["is_used"])

    if invite.project.chat_room:
      invite.project.chat_room.add_participant(user)

    ActivityLog.objects.create(
      project=invite.project,
      user=user,
      action='member_added',
      details=f"{user.email} joined as {invite.role} via invite",
    )

    return invite.project  