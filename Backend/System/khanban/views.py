from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from .serializers import TaskSerializer, CommentSerializer, TaskAttachmentSerializer
from .services.task_services import (
    create_task_service,
    update_or_reorder_task,
    delete_task,
    get_filtered_tasks,
    get_dashboard_stats
)
from .models import TaskAttachment, Task

import logging
logger = logging.getLogger(__name__)


class TaskAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    # Create Task
    def post(self, request, project_id):
        task, data, status_code = create_task_service(
            user=request.user,
            project_id=project_id,
            request_data=request.data
        )

        if task is None:
            logger.info(f"Task creation failed for user {request.user.email}")
        return Response(data, status=status_code)

    # Update / Reorder Task
    def put(self, request, project_id, task_id):
        response_data, error, status_code = update_or_reorder_task(
            request, project_id, task_id
        )
        if error:
            return Response(error, status=status_code)
        return Response(response_data, status=status_code)

    # Delete Task
    def delete(self, request, project_id, task_id):
        response_data, error, status_code = delete_task(
            request, project_id, task_id
        )
        if error:
            return Response(error, status=status_code)
        return Response(response_data, status=status_code)

    # List Tasks (Search & Filter)
    def get(self, request, project_id):
        tasks = get_filtered_tasks(project_id, request.query_params)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)


# Separate APIView for Dashboard
class TaskDashboardAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, project_id):
        stats = get_dashboard_stats(project_id)
        return Response(stats)



# Separate APIView for Comments
class TaskCommentAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, project_id, task_id):
        task = get_object_or_404(Task, id=task_id, project_id=project_id)
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(task=task, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


# Separate APIView for Attachments
class TaskAttachmentAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, project_id, task_id):
        task = get_object_or_404(Task, id=task_id, project_id=project_id)
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        attachment = TaskAttachment.objects.create(
            task=task, uploaded_by=request.user, file=file
        )
        serializer = TaskAttachmentSerializer(attachment)
        return Response(serializer.data, status=201)