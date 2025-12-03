# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser

from team.models import Project, ProjectMember
from .models import Task, OfflineTaskUpdate

class KanbanConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.project_id = str(self.scope["url_route"]["kwargs"]["project_id"])
        self.group_name = f"kanban_{self.project_id}"

        if not self.user or self.user.is_anonymous:
            await self.close(code=4001)
            return

        has_access = await self.has_project_access()
        if not has_access:
            await self.close(code=4003)
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Send all missed updates
        await self.send_missed_updates()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    #  MISS SYNC ON CONNECT
    async def send_missed_updates(self):
        missed_updates = await self.get_missed_updates()
        for update in missed_updates:
            await self.send(text_data=json.dumps(update.payload, ensure_ascii=False))

        # Mark as delivered
        if missed_updates:
            await self.mark_as_delivered(missed_updates)

    @database_sync_to_async
    def get_missed_updates(self):
        return list(
            OfflineTaskUpdate.objects.filter(
                user=self.user,
                project_id=self.project_id,
                delivered=False
            ).order_by('timestamp')[:500]  # limit to prevent overload
        )

    @database_sync_to_async
    def mark_as_delivered(self, updates):
        ids = [u.id for u in updates]
        OfflineTaskUpdate.objects.filter(id__in=ids).update(delivered=True)

    # Broadcast Receivers 
    async def task_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "task_update",
            "task": event["task"]
        }, ensure_ascii=False))

    async def activity_log(self, event):
        await self.send(text_data=json.dumps({
            "type": "activity_log",
            "log": event["log"]
        }, ensure_ascii=False))

    #Access Check
    @database_sync_to_async
    def has_project_access(self):
        try:
            project = Project.objects.only("is_solo", "created_by_id").get(id=self.project_id)
        except Project.DoesNotExist:
            return False

        if project.is_solo:
            return project.created_by_id == self.user.id
        else:
            return ProjectMember.objects.filter(
                project_id=self.project_id,
                user_id=self.user.id
            ).exists()