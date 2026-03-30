from team.models import ActivityLog

def get_project_activity(project_id):
    """
    Fetches activity for a project, newest first.
    """
    return (
        ActivityLog.objects
        .filter(project_id=project_id)
        .select_related("user")
        .order_by("-created_at")
    )