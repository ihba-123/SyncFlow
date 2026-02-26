from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from team.models import Project

class UserContextView(APIView):
    permission_classes = [IsAuthenticated]

    def get_project_data(self, project):
        """Return full project details as a dictionary."""
        return {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "created_at": project.created_at,
            "is_solo": project.is_solo,
            "image": project.image.url if project.image else None,
            # add any other fields you need
        }

    def get(self, request):
        user = request.user

        # If last active project exists and not deleted
        if user.last_active_project and not user.last_active_project.is_deleted:
            active_project_data = self.get_project_data(user.last_active_project)
            return Response({
                "has_projects": True,
                "show_create_project_popup": False,
                "active_project": active_project_data
            })

        # Get all active projects for the user
        projects = Project.objects.active().filter(
            members__user=user
        ).distinct()

        if not projects.exists():
            return Response({
                "has_projects": False,
                "show_create_project_popup": True,
                "active_project": None
            })

        # User has projects but no last active project
        default_project = projects.order_by("created_at").first()
        user.last_active_project = default_project
        user.save(update_fields=["last_active_project"])

        active_project_data = self.get_project_data(default_project)

        return Response({
            "has_projects": True,
            "show_create_project_popup": False,
            "active_project": active_project_data
        })