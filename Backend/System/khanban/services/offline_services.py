from khanban.models import OfflineTaskUpdate
def save_for_offline_users(project, payload, exclude_user=None):

    if project.is_solo:
        # Solo project: only owner
        members = [project.created_by] if project.created_by != exclude_user else []
    else:
        # Use the related_name 'members' instead of default _set
        members_qs = project.members.values_list('user', flat=True)
        if exclude_user:
            members_qs = members_qs.exclude(id=exclude_user.id)
        members = list(members_qs)

    # Bulk create for performance
    offline_updates = [
        OfflineTaskUpdate(user_id=user_id, project=project, payload=payload)
        for user_id in members
    ]
    if offline_updates:
        OfflineTaskUpdate.objects.bulk_create(offline_updates, ignore_conflicts=True)
