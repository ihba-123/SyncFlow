# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
import logging

from .services.task_services import create_task_service, update_or_reorder_task , delete_task
logger = logging.getLogger(__name__)


class TaskAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]  
    
    def post(self, request, project_id):
        task , data , status_code = create_task_service(user = request.user, project_id=project_id, request_data = request.data)
         # If permission failed
        if task is None:
            logger.info(f"Task creation failed for user {request.user.email}")
            return Response(data, status=status_code)

        return Response(data, status=status_code)


    
    def put(self, request, project_id, task_id):
        response_data, error, status_code = update_or_reorder_task(
            request, project_id, task_id
        )

        if error:
            return Response(error, status=status_code)

        return Response(response_data, status=status_code)
    
    
    
    def delete(self, request, project_id, task_id):
        response_data, error, status_code = delete_task(
            request, project_id, task_id
        )

        if error:
            return Response(error, status=status_code)

        return Response(response_data, status=status_code)






