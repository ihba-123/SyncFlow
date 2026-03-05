from team.models import ActivityLog

def log_activity(*, project, user, action, details=None):

    ActivityLog.objects.create(
        project=project,
        user=user,
        action=action,
        details=details
    )