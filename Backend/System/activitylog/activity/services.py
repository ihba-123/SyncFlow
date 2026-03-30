from team.models import ActivityLog 

class ActivityAction:

    PROJECT_CREATED = "project_created"
    PROJECT_UPDATED = "project_updated"
    PROJECT_DELETED = "project_deleted"
    PROJECT_RESTORED = "project_restored"

    MEMBER_ADDED = "member_added"
    MEMBER_REMOVED = "member_removed"

    TASK_CREATED = "task_created"
    TASK_UPDATED = "task_updated"
    TASK_DELETED = "task_deleted"

    COMMENT_ADDED = "comment_added"

    ATTACHMENT_ADDED = "attachment_added"
    INVITE_CREATED = "invite_created"
    INVITE_USED = "invite_used"
    

    

def log_activity(project, user, action_type, details):
    return ActivityLog.objects.create(
        project=project,
        user=user,
        action_type=action_type,
        details=details
    )