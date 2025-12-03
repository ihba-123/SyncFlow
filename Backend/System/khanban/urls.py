# urls.py
from django.urls import path
from .views import TaskAPIView

urlpatterns = [
    
    path('projects/<int:project_id>/tasks/', TaskAPIView.as_view(), name='task-create'),
    path('projects/<int:project_id>/tasks/<int:task_id>/', TaskAPIView.as_view(), name='task-update')
    
]
