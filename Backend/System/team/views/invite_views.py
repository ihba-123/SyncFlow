from ..serializers import UserInviteSerializer , UseInviteSerializer, InviteDetailSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated 
from rest_framework import status
from rest_framework.throttling import UserRateThrottle
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError ,  PermissionDenied
from ..services.invite_service import is_invite , use_invite , project_write_permission
from ..models import Project , ProjectMember
from authentication.models import User
import logging

logger = logging.getLogger(__name__)

class ThrottleView(UserRateThrottle):
  rate='120/hour' # 120 requests per hour per user

class InviteView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ThrottleView]

    def post(self, request, project_id: int):
        project = get_object_or_404(Project, id=project_id)
        serializer = UserInviteSerializer(data=request.data)

        project_write_permission(project, request.user)

        if not serializer.is_valid():
            logger.warning(f"Invite creation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Extract invited info
        user_id = serializer.validated_data.get("user_id")
        invited_email = serializer.validated_data.get("invited_email")


        if user_id:
            try:
                invited_user = User.objects.get(id=user_id)
                invited_email = invited_user.email
            except User.DoesNotExist:
                return Response({"detail": "User does not exist."}, status=400)

        # Prevent inviting yourself
        if invited_email and invited_email.lower() == request.user.email.lower():
            return Response({"detail": "You cannot invite yourself"}, status=400)

        # Check current user is admin of project
        if not ProjectMember.objects.filter(project=project, user=request.user, role="admin").exists():
            return Response({"detail": "You do not have permission to create invites"}, status=403)
 
        # Prevent inviting to a solo project
        if project.is_solo:
            return Response({"detail": "You cannot invite to a solo project"}, status=400)

        try:
            invite_url, token = is_invite(
                project=project,
                created_by=request.user,
                role=serializer.validated_data["role"],
                expires_days=serializer.validated_data.get("expires_days", 3),
                invited_email=invited_email
            )
            print(token)
        except ValidationError as exc:
            if hasattr(exc, 'message_dict'):
                return Response(exc.message_dict, status=400)
            elif hasattr(exc, 'messages'):
                return Response({"detail": exc.messages[0]}, status=400)
            else:
                return Response({"detail": str(exc)}, status=400)
        except PermissionError:
            return Response({"detail": "You do not have permission to create invites"}, status=403)
        except Exception:
            logger.error("Unexpected error while creating invite", exc_info=True, stack_info=True)
            return Response({"detail": "Unexpected error while creating invite"}, status=500)

        return Response(
            {
                "message": "Invite created",
                "project_id": project.id,
                "project_name": project.name,
                "token": token,
                "invite_url": invite_url,
                "expires_days": serializer.validated_data.get("expires_days", 3),
            },
            status=201,
        )


class UseInviteView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ThrottleView]

    def post(self, request):
        serializer = UseInviteSerializer(data=request.data)

        if not serializer.is_valid():
            logger.warning(f"Invite usage failed validation: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            project = use_invite(
                plain_token=serializer.validated_data['token'],
                user=request.user,
            )

            return Response(
                {
                    "message": f"Joined project '{project.name}'",
                    "project_id": project.id,
                },
                status=status.HTTP_200_OK,
            )

        except ValidationError as exc:
            # These are expected user/input errors → 400
            error_detail = (
                exc.messages[0]
                if hasattr(exc, 'messages') and exc.messages
                else str(exc)
            )

            # Optional: add code for frontend to handle specially
            response_data = {"error": error_detail}
            if "already a member" in error_detail.lower():
                response_data["code"] = "already_member"
                # You could also include project.id here if you fetch it before raising

            logger.info(f"Invite usage rejected: {error_detail}")  # ← info, not error

            return Response(
                response_data,
                status=status.HTTP_400_BAD_REQUEST,   # or 409 Conflict if you prefer
            )

        except PermissionDenied as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_403_FORBIDDEN
            )

        except Exception as exc:
            logger.exception("Critical unexpected error while using invite")
            return Response(
                {"error": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ListInvitesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id: int):
        project = get_object_or_404(Project, id=project_id)


        current_membership = get_object_or_404(ProjectMember, project=project, user=request.user)


        if current_membership.role == "admin":
            invites = project.invites.all().order_by("-created_at")
            invite_serializer = InviteDetailSerializer(invites, many=True)
            invite_data = invite_serializer.data
        else:
            invite_data = [] 


        members = project.members.select_related("user").order_by("-joined_at")

        from chatapp.models import Profile
        user_ids = [m.user_id for m in members]
        profiles = Profile.objects.filter(user_id__in=user_ids).in_bulk(field_name="user_id")

        joined_members = []
        for project_member in members:
            user = project_member.user
            profile = profiles.get(user.id)

            if profile and getattr(profile, "display_name", None):
                display_name = profile.display_name
            elif getattr(user, "name", None) and user.name != user.email:
                display_name = user.name
            else:
                display_name = user.email.split("@")[0]

            joined_members.append({
                "id": user.id,
                "email": user.email,
                "name": display_name,
                "photo": profile.photo.url if profile and profile.photo else None,
                "role": project_member.get_role_display(),
                "is_online": profile.is_online if profile else False,
                "joined_at": project_member.joined_at,
            })

        return Response({
            "invites": invite_data,
            "joined_members": joined_members,
            "user_role": current_membership.role 
        })