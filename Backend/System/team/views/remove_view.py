from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from authentication.models import User
from django.shortcuts import get_object_or_404
from ..services.remove_services import remove_member
from ..models import Project
import logging

logger = logging.getLogger(__name__)

class LeaveProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        try:
            project = get_object_or_404(Project, id=project_id)
            remove_member(project, acting_user=request.user, target_user=request.user)
            logger.info(f"User {request.user.email} has left project {project.name}")
            return Response({"detail": "You have left the project successfully."})
        except Exception as e:
            logger.error(f"Error leaving project: {str(e)}")
            return Response({"detail": "An error occurred while leaving the project."}, status=500)

class RemoveMemberView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id, user_id):
        try:
            project = get_object_or_404(Project, id=project_id)
            target_user = get_object_or_404(User, id=user_id)
            remove_member(project, acting_user=request.user, target_user=target_user)
            logger.info(f"User {request.user.email} has removed {target_user.email} from project {project.name}")
            return Response({"detail": f"{target_user.email} has been removed from the project."})
        
        except Exception as e:
            logger.error(f"Error removing member: {str(e)}")
            return Response({"detail": "An error occurred while removing the member."}, status=500)