from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from team.models import Project

class SetActiveProjectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        project = Project.objects.filter(
            id=project_id,
            members__user=request.user,
            is_deleted=False
        ).first()

        if not project:
            return Response(
                {"detail": "Project not found"},
                status=404
            )

        request.user.last_active_project = project
        request.user.save(update_fields=["last_active_project"])

        return Response({"success": True , "active_project": project.id , "active_project_name": project.name})
