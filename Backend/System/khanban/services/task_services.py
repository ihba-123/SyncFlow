from django.shortcuts import get_object_or_404
from django.db import transaction

from team.models import ProjectMember, Project
from khanban.utils.fraction_ordering import order_between
from khanban.models import Task
from khanban.serializers import TaskSerializer
from khanban.utils.broadcast_helper import broadcast_task_update, create_activity_log
from khanban.services.offline_services import save_for_offline_users


@transaction.atomic
def create_task_service(user, project_id, request_data):
    project = get_object_or_404(Project, id=project_id)

    # Permission check
    if project.is_solo:
        if user != project.created_by:
            return None, {"error": "Solo project: only owner can create tasks"}, 403
    else:
        if not ProjectMember.objects.filter(project=project, user=user).exists():
            return None, {"error": "You are not a member of this project"}, 403

    column = request_data.get('status', 'todo')
    last_task = Task.objects.filter(project=project, status=column).order_by('-order').first()
    new_order = order_between(last_task.order if last_task else None, None)

    data = request_data.copy()
    data['order'] = new_order  # Decimal is fine here

    serializer = TaskSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    task = serializer.save(project=project)

    # Log + Broadcast + Offline sync
    create_activity_log(project, user, "task_created", f"Created task: {task.title}")
    broadcast_task_update(project.id, serializer.data)
    save_for_offline_users(project, serializer.data, exclude_user=user)  # Correct

    return task, serializer.data, 201


def check_task_permission(project, user):
    if project.is_solo:
        return user == project.created_by
    return ProjectMember.objects.filter(project=project, user=user).exists()


def reorder_task(task, project, new_status, prev_task_id, next_task_id, user):
    siblings = Task.objects.filter(project=project, status=new_status).exclude(id=task.id)
    prev_task = siblings.filter(id=prev_task_id).first() if prev_task_id else None
    next_task = siblings.filter(id=next_task_id).first() if next_task_id else None

    new_order = order_between(
        prev_task.order if prev_task else None,
        next_task.order if next_task else None
    )

    old_status = task.status
    task.status = new_status
    task.order = new_order
    task.save(update_fields=['status', 'order'])

    changes = []
    if old_status != new_status:
        changes.append(f"moved to {task.get_status_display()}")
    changes.append("reordered")

    create_activity_log(
        project, user, "task_moved",
        f"Task '{task.title}' {', '.join(changes)}"
    )
    return task


def update_task_fields(task, data, user, project):
    serializer = TaskSerializer(task, data=data, partial=True)
    serializer.is_valid(raise_exception=True)
    task = serializer.save()

    create_activity_log(project, user, "task_updated", f"Updated task: {task.title}")
    return task


@transaction.atomic
def update_or_reorder_task(request, project_id, task_id):
    project = get_object_or_404(Project, id=project_id)
    task = get_object_or_404(Task, id=task_id, project=project)

    if not check_task_permission(project, request.user):
        return None, {"error": "Permission denied"}, 403

    data = request.data
    new_status = data.get('status', task.status)
    prev_task_id = data.get('prev_task_id')
    next_task_id = data.get('next_task_id')

    is_reordering = (
        new_status != task.status or
        prev_task_id is not None or
        next_task_id is not None
    )

    if is_reordering:
        task = reorder_task(task, project, new_status, prev_task_id, next_task_id, request.user)
    else:
        task = update_task_fields(task, data, request.user, project)

    serializer = TaskSerializer(task)
    broadcast_task_update(project.id, serializer.data)
    save_for_offline_users(project, serializer.data, exclude_user=request.user)  # Fixed: was `user`

    return serializer.data, None, 200


#delete_task()
@transaction.atomic
def delete_task(request, project_id, task_id):
    project = get_object_or_404(Project, id=project_id)
    task = get_object_or_404(Task, id=task_id, project=project)

    if project.is_solo:
        if request.user != project.created_by:
            return None, {"error": "Solo project: only owner can delete tasks"}, 403
    else:
        if not ProjectMember.objects.filter(project=project, user=request.user).exists():
            return None, {"error": "Only project members can delete tasks"}, 403

    title = task.title
    task_id_for_payload = task.id  # Save ID before delete
    task.delete()

    create_activity_log(project, request.user, "task_deleted", f"Deleted task: {title}")

    delete_payload = {"id": task_id_for_payload, "deleted": True}
    broadcast_task_update(project.id, delete_payload)
    save_for_offline_users(project, delete_payload, exclude_user=request.user)  # Fixed

    return {"message": "Task deleted successfully"}, None, 200