from ..serializers import CreateProjectSerializer , ProjectDetailSerializer , ProjectListSerializer
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ..services.project_services import project_create , get_user_project , get_project_detail
from rest_framework import throttling
from rest_framework.exceptions import ValidationError,PermissionDenied
import logging



logger = logging.getLogger(__name__)

class ProjectThrottling(throttling.UserRateThrottle):
  rate = "200/hour"



class ProjectCreateView(APIView):
  permission_classes= [permissions.IsAuthenticated]
  throttle_classes = [ProjectThrottling]

  def post(self , request):
    serializer = CreateProjectSerializer(data=request.data)
    if not serializer.is_valid():
      logger.warning(f"Project creation failed: {serializer.errors}")
      return Response(serializer.errors , status=status.HTTP_400_BAD_REQUEST)
    
    try:
      if serializer.is_valid():
        print("Valid data:", serializer.validated_data) 
        project = project_create(
                name=serializer.validated_data["name"],
                description=serializer.validated_data["description"],
                created_by=request.user,
                is_solo=serializer.validated_data["is_solo"],
            )
    except ValidationError as exc:
            logger.warning(f"Project creation failed: {str(exc)}")
            return Response(
                {"error": str(exc)}, status=status.HTTP_400_BAD_REQUEST
            )
    except Exception:
            logger.error("Unexpected error while creating project")
            return Response(
                {"error": "Unexpected error while creating project"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    return Response(
            {
                "message": "Project created successfully",
                "project_id": project.id,
                "project_name": project.name,
                "is_solo": project.is_solo,
            },
            status=status.HTTP_201_CREATED,
        )

#Project List View
class ListProjectsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [ProjectThrottling]

    def get(self, request):
        projects = get_user_project(request.user)
        serializer = ProjectListSerializer(
            projects,
            many=True,
            context={"request": request},
        )
        return Response({"projects": serializer.data}, status=status.HTTP_200_OK)
    

#Project Detail View
class ProjectDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [ProjectThrottling]

    def get(self, request, project_id: int):
        try:
            project = get_project_detail(project_id, request.user)
        except ValidationError as exc:
            return Response(
                {"error": str(exc)}, status=status.HTTP_404_NOT_FOUND
            )
        except PermissionDenied as exc:
            return Response(
                {"error": str(exc)}, status=status.HTTP_403_FORBIDDEN
            )
        except Exception:
            return Response(
                {"error": "Unexpected error while fetching project"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        serializer = ProjectDetailSerializer(project)
        return Response(serializer.data, status=status.HTTP_200_OK)