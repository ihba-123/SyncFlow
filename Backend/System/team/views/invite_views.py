from ..serializers import UserInviteSerializer , UseInviteSerializer, InviteDetailSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.throttling import UserRateThrottle
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError ,  PermissionDenied
from ..services.invite_service import is_invite , use_invite
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

        if not serializer.is_valid():
            logger.warning(f"Invite creation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Extract invited info
        user_id = serializer.validated_data.get("user_id")
        invited_email = serializer.validated_data.get("invited_email")

        # Resolve user_id to email if provided
        if user_id:
            try:
                invited_user = User.objects.get(id=user_id)
                invited_email = invited_user.email
            except User.DoesNotExist:
                return Response({"detail": "User does not exist."}, status=400)

        # Prevent inviting yourself
        if invited_email and invited_email.lower() == request.user.email.lower():
            return Response({"detail": "You cannot invite yourself"}, status=400)

        # Prevent inviting as admin
        if serializer.validated_data["role"] == "admin":
            return Response({"detail": "You cannot invite an admin"}, status=400)

        # Check current user is admin of project
        if not ProjectMember.objects.filter(project=project, user=request.user, role="admin").exists():
            return Response({"detail": "You do not have permission to create invites"}, status=403)

        # Prevent inviting to a solo project
        if project.is_solo:
            return Response({"detail": "You cannot invite to a solo project"}, status=400)

        try:
            invite_url, plain_token = is_invite(
                project=project,
                created_by=request.user,
                role=serializer.validated_data["role"],
                expires_days=serializer.validated_data.get("expires_days", 3),
                invited_email=invited_email
            )
        except ValidationError as exc:
            # Handle DRF ValidationError
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
                "token": plain_token,
                "invite_url": invite_url,
                "expires_days": serializer.validated_data.get("expires_days", 3),
            },
            status=201,
        )


class UseInviteView(APIView):
  permission_classes = [IsAuthenticated]
  throttle_classes = [ThrottleView]

  def post(self , request):
    serializer = UseInviteSerializer(data=request.data)
    if not serializer.is_valid():
      logger.warning(f"Invite creation failed: {serializer.errors}")
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
  
    try:
        project = use_invite(
        plain_token=serializer.validated_data['token'],
        user=request.user,
        )
        
    except ValidationError as exc:
            logger.error(f"Error using invite: {str(exc)}")
            return Response(
                {"error": str(exc), "code": "validation_error"},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except Exception:
            logger.error("Unexpected error while using invite", exc_info=True, stack_info=True)
            return Response(
                {"error": "Unexpected error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    return Response(
      {
      "message": f"Joined project '{project.name}'",
       "project_id": project.id,
        },
        status=status.HTTP_200_OK,
          )


class ListInvitesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, project_id: int):
        project = get_object_or_404(Project, id=project_id)
        from ..models import ProjectMember
        if not ProjectMember.objects.filter(project=project, user=request.user, role='admin').exists():
            return Response(
                {"error": "Only admins can view invites"},
                status=status.HTTP_403_FORBIDDEN,
            )

        invites = project.invites.all().order_by('-created_at')
        serializer = InviteDetailSerializer(invites, many=True)
        return Response({"invites": serializer.data}, status=status.HTTP_200_OK)