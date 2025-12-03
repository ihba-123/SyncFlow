from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import logging

from team.models import ActivityLog

logger = logging.getLogger(__name__)

# ====================== BROADCAST HELPERS ======================
def broadcast_task_update(project_id, task_data):
    """Send task updates to all websocket clients in the project group"""
    try:
        channel_layer = get_channel_layer()
        if channel_layer:
            async_to_sync(channel_layer.group_send)(
                f"kanban_{project_id}",
                {"type": "task_update", "task": task_data}
            )
    except Exception as e:
        logger.error(f"Failed to broadcast task update: {e}")

def create_activity_log(project, user, action, details=""):
    """Create activity log and broadcast if team project"""
    try:
        log = ActivityLog.objects.create(project=project, user=user, action=action, details=details)
        if not project.is_solo:
            broadcast_activity_log(project.id, log)
    except Exception as e:
        logger.error(f"Failed to create activity log: {e}")


def broadcast_activity_log(project_id, log):
    """Send activity log updates to all websocket clients"""
    try:
        channel_layer = get_channel_layer()
        if channel_layer:
            async_to_sync(channel_layer.group_send)(
                f"kanban_{project_id}",
                {
                    "type": "activity_log",
                    "log": {
                        "id": log.id,
                        "user": log.user.email if log.user else "System",
                        "action": log.action,
                        "details": log.details,
                        "created_at": log.created_at.isoformat()
                    }
                }
            )
    except Exception as e:
        logger.error(f"Failed to broadcast activity log: {e}")