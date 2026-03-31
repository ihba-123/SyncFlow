from django.shortcuts import get_object_or_404
from django.db import transaction, models
from django.db.models import Q, Count
from django.utils.timezone import now, timedelta
from khanban.models import Task, TaskComment, TaskAttachment
from team.models import ProjectMember, Project
from khanban.utils.fraction_ordering import order_between
from khanban.serializers import TaskSerializer
from khanban.utils.broadcast_helper import broadcast_task_update, create_activity_log
from khanban.services.offline_services import save_for_offline_users
from activitylog.activity.services import log_activity , ActivityAction

# -------------------- CREATE TASK --------------------
@transaction.atomic
def create_task_service(user, project_id, request_data):
    project = get_object_or_404(Project, id=project_id)

    # Permission check
    if project.is_solo and user != project.created_by:
        return None, {"error": "Solo project: only owner can create tasks"}, 403
    elif not project.is_solo and not ProjectMember.objects.filter(project=project, user=user).exists():
        return None, {"error": "You are not a member of this project"}, 403

    column = request_data.get('status', 'todo')
    last_task = Task.objects.filter(project=project, status=column).order_by('-order').first()
    new_order = order_between(last_task.order if last_task else None, None)

    data = request_data.copy()
    data['order'] = new_order

    serializer = TaskSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    task = serializer.save(project=project)

    log_activity(project, user, ActivityAction.TASK_CREATED, f"Created task '{task.title}'")
    broadcast_task_update(project.id, serializer.data)
    save_for_offline_users(project, serializer.data, exclude_user=user)

    return task, serializer.data, 201


# -------------------- CHECK PERMISSION --------------------
def check_task_permission(project, user):
    if project.is_solo:
        return user == project.created_by
    return ProjectMember.objects.filter(project=project, user=user).exists()



# -------------------- REORDER TASK --------------------
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

    changes = ["reordered"]
    if old_status != new_status:
        changes.insert(0, f"moved to {task.get_status_display()}")

    create_activity_log(
        project, user, "task_moved",
        f"Task '{task.title}' {', '.join(changes)}"
    )
    return task


# -------------------- UPDATE TASK --------------------
def update_task_fields(task, data, user, project):
    serializer = TaskSerializer(task, data=data, partial=True)
    serializer.is_valid(raise_exception=True)
    task = serializer.save()
    log_activity(project, user, ActivityAction.TASK_UPDATED, f"Updated task '{task.title}'")
    return task


# -------------------- UPDATE OR REORDER TASK --------------------
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

    if new_status != task.status or prev_task_id is not None or next_task_id is not None:
        task = reorder_task(task, project, new_status, prev_task_id, next_task_id, request.user)
    else:
        task = update_task_fields(task, data, request.user, project)

    serializer = TaskSerializer(task)
    broadcast_task_update(project.id, serializer.data)
    save_for_offline_users(project, serializer.data, exclude_user=request.user)
    return serializer.data, None, 200


# -------------------- DELETE TASK --------------------
@transaction.atomic
def delete_task(request, project_id, task_id):
    project = get_object_or_404(Project, id=project_id)
    task = get_object_or_404(Task, id=task_id, project=project)

    if project.is_solo and request.user != project.created_by:
        return None, {"error": "Solo project: only owner can delete tasks"}, 403
    elif not project.is_solo and not ProjectMember.objects.filter(project=project, user=request.user).exists():
        return None, {"error": "Only project members can delete tasks"}, 403

    task_id_for_payload = task.id
    title = task.title
    task.delete()

    create_activity_log(project, request.user, "task_deleted", f"Deleted task: {title}")
    log_activity(project, request.user, "task_deleted", f"Deleted task '{title}'")
    payload = {"id": task_id_for_payload, "deleted": True}
    broadcast_task_update(project.id, payload)
    save_for_offline_users(project, payload, exclude_user=request.user)

    return {"message": "Task deleted successfully"}, None, 200


# -------------------- FILTERED TASKS --------------------
def get_filtered_tasks(project_id, filters):
    queryset = Task.objects.filter(project_id=project_id)
    search = filters.get('search')
    status = filters.get('status')
    priority = filters.get('priority')
    member = filters.get('assigned_to')

    if search:
        queryset = queryset.filter(Q(title__icontains=search) | Q(tags__icontains=search))
    if status:
        queryset = queryset.filter(status=status)
    if priority:
        queryset = queryset.filter(priority=priority)
    if member:
        queryset = queryset.filter(assigned_to_id=member)
    return queryset

# -------------------- DASHBOARD STATS --------------------
def get_dashboard_stats(project_id):
    tasks = Task.objects.filter(project_id=project_id)
    total_count = tasks.count()
    done_count = tasks.filter(status='done').count()

    stats = {
        "status_distribution": tasks.values('status').annotate(count=Count('id')),
        "priority_distribution": tasks.values('priority').annotate(count=Count('id')),
        "total_progress": (done_count / total_count * 100) if total_count > 0 else 0,
        "velocity_last_7_days": tasks.filter(status='done', updated_at__gte=now()-timedelta(days=7)).count(),
        "workload_distribution": tasks.values('assigned_to__id', 'assigned_to__email').annotate(task_count=Count('id'))
    }
    return stats