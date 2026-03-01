from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, status as drf_status
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError, PermissionDenied
import logging

from ..serializers import UserInviteSerializer, UseInviteSerializer, InviteDetailSerializer
from ..models import Project, ProjectMember
from authentication.models import User
from ..services.invite_service import create_project_invite, use_invite, project_write_permission

logger = logging.getLogger(__name__)

class ThrottleView(UserRateThrottle):
    rate = '120/hour'

class InviteView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ThrottleView]

    def post(self, request, project_id: int):
        project = get_object_or_404(Project, id=project_id)
        serializer = UserInviteSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Check permissions
        try:
            project_write_permission(project, request.user)
        except PermissionDenied as e:
            return Response({"detail": str(e)}, status=status.HTTP_403_FORBIDDEN)

        # Logic for target user
        user_id = serializer.validated_data.get("user_id")
        invited_email = serializer.validated_data.get("invited_email")

        if user_id:
            invited_user = get_object_or_404(User, id=user_id)
            invited_email = invited_user.email

        try:
            invite_url, token = create_project_invite(
                project=project,
                created_by=request.user,
                role=serializer.validated_data["role"],
                expires_days=serializer.validated_data.get("expires_days", 3),
                invited_email=invited_email
            )
            return Response({
                "message": "Invite created",
                "token": token,
                "invite_url": invite_url
            }, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"detail": list(e.messages)[0] if hasattr(e, 'messages') else str(e)}, status=400)
        except Exception as e:
            logger.error(f"Invite creation error: {e}", exc_info=True)
            return Response({"detail": "Internal server error"}, status=500)

class UseInviteView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ThrottleView]

    def post(self, request):
        serializer = UseInviteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            project, chat_room = use_invite(
                plain_token=serializer.validated_data['token'],
                user=request.user,
            )
            return Response({
                "message": f"Joined project '{project.name}'",
                "project_id": project.id,
            }, status=status.HTTP_200_OK)

        except ValidationError as e:
            msg = e.messages[0] if hasattr(e, 'messages') else str(e)
            print(f"DEBUG JOIN ERROR: {msg}")  # <--- ADD THIS
            return Response({"error": msg}, status=status.HTTP_400_BAD_REQUEST)
        except PermissionDenied as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)
        except Exception:
            logger.exception("Critical error using invite")
            return Response({"error": "Internal error"}, status=500)

class ListInvitesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id: int):
        project = get_object_or_404(Project, id=project_id)
        current_membership = get_object_or_404(ProjectMember, project=project, user=request.user)

        invite_data = []
        if current_membership.role == "admin":
            invites = project.invites.all().order_by("-created_at")
            invite_data = InviteDetailSerializer(invites, many=True).data

        # Optimized Member Retrieval
        members = project.members.select_related("user").order_by("-joined_at")
        from chatapp.models import Profile
        profiles = Profile.objects.filter(user_id__in=[m.user_id for m in members]).in_bulk(field_name="user_id")

        joined_members = []
        for m in members:
            p = profiles.get(m.user_id)
            joined_members.append({
                "id": m.user.id,
                "email": m.user.email,
                "name": p.display_name if p and getattr(p, 'display_name', None) else m.user.email.split("@")[0],
                "photo": p.photo.url if p and p.photo else None,
                "role": m.get_role_display(),
                "is_online": p.is_online if p else False,
                "joined_at": m.joined_at,
            })

        return Response({
            "invites": invite_data,
            "joined_members": joined_members,
            "user_role": current_membership.role 
        })