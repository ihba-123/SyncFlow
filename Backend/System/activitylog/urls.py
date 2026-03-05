from django.urls import path
from .views import ProjectActivityAPIView

urlpatterns = [
    path(
        "projects/<int:project_id>/activity/",
        ProjectActivityAPIView.as_view(),
        name="project-activity",
    ),
]