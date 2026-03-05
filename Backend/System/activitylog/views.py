from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .activity.selectors import get_project_activity
from .serializers import ActivityLogSerializer


class ProjectActivityAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, project_id):

        activities = get_project_activity(project_id)

        serializer = ActivityLogSerializer(activities, many=True)

        return Response(serializer.data)