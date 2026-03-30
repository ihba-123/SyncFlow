from django.urls import path
from .views import ActivityLogListAPIView

urlpatterns = [
    path(
        "projects/<int:project_id>/activity/",
        ActivityLogListAPIView.as_view(),
        name="project-activity",
    ),
]