from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from ..serializer import ChatUserSerializer

def attachment_services(user , chat_room , serializer):
  
    message = serializer.save(sender=user, chat_room=chat_room)
    serialized_message = ChatUserSerializer(message).data
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
                f"chat_{chat_room.id}",
                {
                    "type": "chat_message_event",
                    "message": serialized_message,
                },
            )
    return message
  