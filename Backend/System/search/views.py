# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import ProjectSearchSerializer, TaskSearchSerializer, MemberSearchSerializer
from team.models import Project
from khanban.models import Task
from authentication.models import User
class SearchBaseView(APIView):
    permission_classes = [IsAuthenticated]

class ProjectSearchView(SearchBaseView):
    def get(self, request):
        q = request.query_params.get('q', '').strip()
        results = Project.objects.search(q, request.user)
        return Response(ProjectSearchSerializer(results, many=True).data)

class TaskSearchView(SearchBaseView):
    def get(self, request):
        q = request.query_params.get('q', '').strip()
        results = Task.objects.search(q, request.user)
        return Response(TaskSearchSerializer(results, many=True).data)

class MemberSearchView(SearchBaseView):
    def get(self, request):
        q = request.query_params.get('q', '').strip()
        results = User.objects.search_members(q, request.user)
        return Response(MemberSearchSerializer(results, many=True).data)

class GlobalSearchView(SearchBaseView):
    def get(self, request):
        q = request.query_params.get('q', '').strip()
        return Response({
            "projects": ProjectSearchSerializer(Project.objects.search(q, request.user, limit=8), many=True).data,
            "tasks": TaskSearchSerializer(Task.objects.search(q, request.user, limit=8), many=True).data,
            "members": MemberSearchSerializer(User.objects.search_members(q, request.user, limit=8), many=True).data,
        })