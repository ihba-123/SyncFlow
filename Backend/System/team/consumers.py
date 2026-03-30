import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ProjectCollaborationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # 1. Get Project ID from URL
        self.project_id = self.scope['url_route']['kwargs']['project_id']
        self.room_group_name = f"project_{self.project_id}"
        
        # 2. Check if user is authenticated (added for safety)
        if self.scope["user"].is_anonymous:
            await self.close()
        else:
            # 3. Join project group
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.accept()

    async def disconnect(self, close_code):
        # Leave project group
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Handles broadcasts from group_send
    async def project_update(self, event):
        # We wrap this in a try/except or use .get() for production safety
        payload = event.get("data", {})
        
        # Sends the actual JSON to the WebSocket
        await self.send(text_data=json.dumps(payload))