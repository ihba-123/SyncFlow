from django.db import transaction
from django.core.exceptions import ValidationError, PermissionDenied
from ..models import Project, ActivityLog, ProjectMember
from chatapp.models import ChatRoom
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.shortcuts import get_object_or_404
from ..serializers import CreateProjectSerializer
from activitylog.activity.services import ActivityAction, log_activity

# Channels imports
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def broadcast_project_update(project_id, action, data=None):
    """Helper to send WebSocket messages to the project group."""
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"project_{project_id}",
        {
            "type": "project_update",
            "data": {
                "action": action,
                "project_id": project_id,
                **(data or {})
            }
        }
    )

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

        created_by.last_active_project = project
        created_by.save(update_fields=["last_active_project"])

        log_activity(
            project=project,
            user=created_by,
            action_type=ActivityAction.PROJECT_CREATED,
            details=f"Project '{name}' created as {'solo' if is_solo else 'team'}"
        )

    return project

def project_update(*,user, project_id:int , data:dict , file=None )->Project:
    project = get_object_or_404(Project.objects.active(),id=project_id)

    if project.is_solo == True:
        if project.created_by != user:
            raise PermissionDenied("You are not the creator of this project.")
    else:
        member = ProjectMember.objects.filter(project=project, user=user).first()
        if not member:
            raise PermissionDenied("You are not a member of this project.")
        if member.role != 'admin':
            raise PermissionDenied("You are not an admin of this project.")
    
    serializer = CreateProjectSerializer(data=data)
    serializer.is_valid(raise_exception=True)

    project.name = serializer.validated_data['name']
    project.description = serializer.validated_data['description']
    remove_image = serializer.validated_data.get('remove_image', False)

    if remove_image:
        project.image = None
    elif file and 'image' in file:
        project.image = file['image']
    
    project.save()

    log_activity(
        project=project,
        user=user,
        action_type=ActivityAction.PROJECT_UPDATED,
        details=f"Project '{project.name}' updated."
    )

    # --- WEBSOCKET BROADCAST ---
    broadcast_project_update(project.id, "project_updated", {
        "name": project.name,
        "description": project.description
    })

    return project

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

    with transaction.atomic():
        project.is_deleted = True
        project.save()

        log_activity(
            project=project,
            user=user,
            action_type=ActivityAction.PROJECT_DELETED,
            details=f"Project '{project.name}' soft deleted"
        )

    # --- WEBSOCKET BROADCAST ---
    broadcast_project_update(project.id, "project_archived", {  
        "message": "This project has been moved to trash.",
        "redirect": True
    })

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

        log_activity(
            project=project,
            user=user,
            action_type=ActivityAction.PROJECT_RESTORED,
            details=f"Project '{project.name}' restored"
        )

    # --- WEBSOCKET BROADCAST ---
    broadcast_project_update(project.id, "project_restored")

    return project



from django.db.models import Q

def get_archived_projects(*, user) -> list[Project]:

    projects = (
        Project.objects.deleted()
        .filter(
            Q(is_solo=True, created_by=user) |
            Q(is_solo=False, members__user=user, members__role='admin')
        )
        .distinct()
    )

    return projects






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