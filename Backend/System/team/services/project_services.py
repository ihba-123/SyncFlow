from django.db import transaction
from django.core.exceptions import ValidationError,PermissionDenied
from ..models import Project , ActivityLog , ProjectMember
from chatapp.models import ChatRoom

def project_create(name:str, description:str ,created_by ,is_solo:bool=True )->Project:

  if not name:
    raise ValidationError("Name of the project must be define")
  
  with transaction.atomic():
    chat_room = None
    if not is_solo:
      chat_room = ChatRoom.objects.create(
      name=f"{name} Chat",
      is_group=True,      
      admin=created_by      
       )
      chat_room.participants.add(created_by)
    
    project = Project.objects.create(
      name=name,
      description=description,
      is_solo=is_solo,
      created_by=created_by,
      chat_room=chat_room,
    )

    ProjectMember.objects.create(
      project=project,
      user=created_by,
      role='admin',
    )

    if chat_room:
        chat_room.add_participant(created_by)

    ActivityLog.objects.create(
      project=project,
      user=created_by,
      action="project_created",
      details=f"Project '{name}' created as {'solo' if is_solo else 'team'}",
    )
  return project


# User Project 

from typing import List
def get_user_project(user)->List[Project]:
  return list(
    Project.objects.filter(members__user=user).select_related("chat_room").distinct() 
  )


# for detail of project 
def get_project_detail(project_id:int, user)->Project:
  
  try:
    project = Project.objects.select_related(
      "chat_room","created_by"
    ).get(id=project_id)
  
  except Project.DoesNotExist:
    raise ValidationError("Project doesnot found")
  
  if not ProjectMember.objects.filter(user=user , project=project).exists():
    raise PermissionDenied("You are not a member of this project.")
  
  return project