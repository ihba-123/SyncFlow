from django.db import transaction
from django.core.exceptions import ValidationError,PermissionDenied
from ..models import Project , ActivityLog , ProjectMember
from chatapp.models import ChatRoom
from rest_framework.exceptions import ValidationError , PermissionDenied
from django.shortcuts import get_object_or_404
from ..serializers import CreateProjectSerializer
def project_create(name:str, description:str ,created_by ,is_solo:bool=True , image=None )->Project:

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
    
    project = Project.objects.active().create(
      name=name,
      description=description,
      is_solo=is_solo,
      created_by=created_by,
      chat_room=chat_room,
      image=image,
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



def project_update(*,user, project_id:int , data:dict , file=None )->Project:

    project = get_object_or_404(Project.objects.active(),id=project_id)

    if project.is_solo == True:
      if project.created_by != user:
        raise PermissionDenied("You are not the creator of this project.")
    
    else:
      member = ProjectMember.objects.filter(
        project=project,
        user=user
        ).first()
      
      if not member:
        raise PermissionDenied("You are not a member of this project.")

      if member.role != 'admin':
        raise PermissionDenied("You are not an admin of this project.")
    
      serializer = CreateProjectSerializer(data=data)
      serializer.is_valid(raise_exception=True)

         
      # Manually assign validated fields
      project.name = serializer.validated_data['name']
      project.description = serializer.validated_data['description']

      if file and 'image' in file:
         project.image = file['image']
      project.save()


    ActivityLog.objects.create(
      project=project,
      user=user,
      action="project_updated",
      details=f"Project '{project.name}' updated and image updated {file}",
    )

    return project


#Restore
def project_soft_delete(*, user, project_id: int) -> Project:
    
    project = get_object_or_404(Project.objects.active(), id=project_id)

    if project.is_solo:
        if project.created_by != user:
            raise PermissionDenied("Only the creator can delete this solo project.")

    else:
        member = ProjectMember.objects.filter(user=user, project=project).first()
        if not member:
            raise PermissionDenied("You are not a member of this project.")
        if member.role != "admin":
            raise PermissionDenied("Only admin can delete this project.")

    # Soft delete
    with transaction.atomic():
        project.is_deleted = True
        project.save()

        # Activity log
        ActivityLog.objects.create(
            project=project,
            user=user,
            action="project_deleted",
            details=f"Project '{project.name}' soft deleted",
        )

    return project

def project_restore(*, user, project_id: int) -> Project:
    project = get_object_or_404(Project.objects.deleted(), id=project_id)

    if project.is_solo:
        if project.created_by != user:
            raise PermissionDenied("Only the creator can restore this solo project.")
    else:
        member = ProjectMember.objects.filter(user=user, project=project).first()
        if not member:
            raise PermissionDenied("You are not a member of this project.")
        if member.role != "admin":
            raise PermissionDenied("Only admin can restore this project.")

    with transaction.atomic():
        project.is_deleted = False
        project.save()

        ActivityLog.objects.create(
            project=project,
            user=user,
            action="project_restored",
            details=f"Project '{project.name}' restored",
        )

    return project




# User Project 
from django.db.models import Subquery

def get_user_project(user):
    project_ids = ProjectMember.objects.filter(
        user=user
    ).values("project_id")

    return (
        Project.objects.active()
        .filter(id__in=Subquery(project_ids))
        .select_related("chat_room")
        .order_by("-id")  
    )





# for detail of project 
def get_project_detail(project_id:int, user)->Project:
  
  try:
    project = Project.objects.active().select_related(
      "chat_room","created_by"
    ).get(id=project_id)
  
  except Project.DoesNotExist:
    raise ValidationError("Project doesnot found")
  
  if not ProjectMember.objects.filter(user=user , project=project).exists():
    raise PermissionDenied("You are not a member of this project.")
  
  return project