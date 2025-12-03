from ..serializers import UserInviteSerializer , UseInviteSerializer, InviteDetailSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.throttling import UserRateThrottle
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError ,  PermissionDenied
from ..services.invite_service import is_invite , use_invite
from ..models import Project
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

        try:
            invite_url, plain_token = is_invite(
                project=project,
                created_by=request.user,
                role=serializer.validated_data["role"],
                expires_days=serializer.validated_data["expires_days"],
                invited_email=serializer.validated_data.get("invited_email")  # FIXED
            )

        except ValidationError as exc:
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST
            )

        except PermissionError:
            return Response(
                {"detail": "You do not have permission to create invites"},
                status=status.HTTP_403_FORBIDDEN
            )

        except Exception:
            logger.error(
                "Unexpected error while creating invite",
                exc_info=True,
                stack_info=True
            )
            return Response(
                {"detail": "Unexpected error while creating invite"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {
                "message": "Invite created",
                "token": plain_token,
                "invite_url": invite_url,
                "expires_days": serializer.validated_data["expires_days"],
            },
            status=status.HTTP_201_CREATED,
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