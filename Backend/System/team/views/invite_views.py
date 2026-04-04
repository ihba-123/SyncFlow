from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, status as drf_status
from rest_framework.permissions import IsAuthenticated
from rest_framework.throttling import UserRateThrottle
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError, PermissionDenied
import logging
import cloudinary

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
            invite_url, token , expires_days = create_project_invite(
                project=project,
                created_by=request.user,
                role=serializer.validated_data["role"],
                expires_days=serializer.validated_data.get("expires_days", 3),
                invited_email=invited_email
            )
            return Response({
                "message": "Invite created",
                "invite_url":invite_url,
                "expires_days":expires_days,
                "token": token,
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

    def _profile_photo_url(self, profile):
        """Safe photo URL extraction with fallback"""
        if profile and profile.photo:
            try:
                url = profile.photo.url
                # Ensure absolute URL with protocol
                if url.startswith("http"):
                    return url
                # Handle Cloudinary relative URLs like /image/upload/... or /raw/upload/...
                if url.startswith("/"):
                    cloud_name = cloudinary.config().cloud_name
                    if cloud_name:
                        return f"https://res.cloudinary.com/{cloud_name}{url}"
                # Build absolute URL if relative
                return f"{self.request.build_absolute_uri('/')}{url.lstrip('/')}"
            except Exception:
                pass
        return None

    def _get_member_name(self, user, profile):
        """
        Multiple fallback chain for member display name
        Priority: user.get_display_name() → first_name+last_name → email prefix → "Unknown"
        """
        # Try User.get_display_name() method if available
        if hasattr(user, "get_display_name") and callable(user.get_display_name):
            name = user.get_display_name()
            if name and name.strip():
                return name

        # Try first_name + last_name
        if user.first_name and user.last_name:
            name = f"{user.first_name} {user.last_name}".strip()
            if name:
                return name

        if user.first_name:
            return user.first_name

        if user.last_name:
            return user.last_name

        # Use email prefix as fallback
        if user.email:
            return user.email.split("@")[0]

        # Last resort
        return "Unknown"

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
        
        user_ids = [m.user_id for m in members]
        profiles = Profile.objects.filter(user_id__in=user_ids).in_bulk(
            field_name="user_id"
        )

        joined_members = []
        for m in members:
            user = m.user
            profile = profiles.get(m.user_id)

            # Always ensure name is populated (never null/empty)
            member_name = self._get_member_name(user, profile)

            # Get safe photo URL
            photo_url = self._profile_photo_url(profile)

            joined_members.append({
                "id": user.id,
                "email": user.email,
                "username": user.username or "",
                "name": member_name,  # Always populated
                "photo": photo_url,
                "role": m.get_role_display(),
                "is_online": profile.is_online if profile else False,
                "joined_at": m.joined_at,
            })

        return Response({
            "invites": invite_data,
            "joined_members": joined_members,
            "user_role": current_membership.role 
        })