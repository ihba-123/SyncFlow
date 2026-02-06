from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from team.models import Project

class UserContextView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Check last active project first
        if user.last_active_project and not user.last_active_project.is_deleted:
            return Response({
                "has_projects": True,
                "show_create_project_popup": False,
                "active_project": {
                    "id": user.last_active_project.id,
                    "name": user.last_active_project.name
                }
            })

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

        return Response({
            "has_projects": True,
            "show_create_project_popup": False,
            "active_project": {
                "id": default_project.id,
                "name": default_project.name
            }
        })
