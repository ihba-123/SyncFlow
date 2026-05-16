from django.http import HttpResponseRedirect
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from ..models import Message


class MessageAttachmentProxyView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, message_id):
        message = get_object_or_404(Message.objects.select_related("chat_room"), id=message_id)

        if not message.chat_room.participants.filter(id=request.user.id).exists():
            return Response(
                {"detail": "You are not a participant of this chat room."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if not message.attachment or not getattr(message.attachment, "url", None):
            return Response({"detail": "Attachment not found."}, status=status.HTTP_404_NOT_FOUND)

        attachment = message.attachment
        try:
            signed_url = attachment.build_url(
                resource_type="raw",
                secure=True,
                sign_url=True,
            )
        except Exception:
            signed_url = attachment.url

        return HttpResponseRedirect(signed_url)