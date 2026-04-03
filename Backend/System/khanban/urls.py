from django.urls import path
from .views import TaskAPIView , TaskDashboardAPIView , TaskCommentAPIView , TaskAttachmentAPIView

urlpatterns = [
    
    path('projects/<int:project_id>/tasks/', TaskAPIView.as_view(), name='task-create'),
    path('projects/<int:project_id>/tasks/<int:task_id>/', TaskAPIView.as_view(), name='task-update'),
    path('projects/<int:project_id>/dashboard/', TaskDashboardAPIView.as_view(), name='task-dashboard'),
    path('projects/<int:project_id>/tasks/<int:task_id>/comments/', TaskCommentAPIView.as_view(), name='task-comments'),
    path('projects/<int:project_id>/tasks/<int:task_id>/attachments/', TaskAttachmentAPIView.as_view(), name='task-attachments'),
]
    
    
