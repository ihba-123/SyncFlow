# team/urls.py
from django.urls import path , include
from team.views.project_views import (
    ProjectCreateView,
    ListProjectsView,
    ProjectDetailView,
    ProjectSoftDeleteView,
    ProjectRestoreView,
    ProjectUpdateView,
    
)
from team.views.remove_view import LeaveProjectView , RemoveMemberView , ProjectPermanentDeleteView
from team.views.invite_views import InviteView , UseInviteView , ListInvitesView
from rest_framework.routers import DefaultRouter
from team.views.activity_log import ActivityLogView as ActivityLogViewSet
from team.views.context import UserContextView
from team.views.active_project import SetActiveProjectView


# Dynamic router to register viewsets
router = DefaultRouter()
router.register(r"activity-logs", ActivityLogViewSet, basename="activity-log")



urlpatterns = [
    path("", include(router.urls)),
    path("projects/create/", ProjectCreateView.as_view(), name="project-create"),
    path("projects/<int:project_id>/update/", ProjectUpdateView.as_view(), name="project-update"),
    path("projects/<int:project_id>/delete/", ProjectSoftDeleteView.as_view(), name="project-soft-delete"),
    path("projects/<int:project_id>/permanent-delete/", ProjectPermanentDeleteView.as_view(), name="project-permanent-delete"), 
    path("projects/<int:project_id>/restore/", ProjectRestoreView.as_view(), name="project-restore"),
    path("projects/list/", ListProjectsView.as_view(), name="project-list"),
    path("projects/<int:project_id>/", ProjectDetailView.as_view(), name="project-detail"),
    path("projects/<int:project_id>/invite/", InviteView.as_view(), name="project-invite"),
    path("join-invite/", UseInviteView.as_view(), name="project-use-invite"),
    path("projects/<int:project_id>/invites/list/", ListInvitesView.as_view(), name="project-invites-list"),
    path('projects/<int:project_id>/leave/', LeaveProjectView.as_view(), name='project-leave'),
    path('projects/<int:project_id>/remove/<int:user_id>/', RemoveMemberView.as_view(), name='project-remove-member'),

    #active_projects 
    path(
        "users/me/context/",
        UserContextView.as_view(),
        name="user-context"
    ),
    path(
        "projects/<int:project_id>/set-active/",
        SetActiveProjectView.as_view(),
        name="set-active-project"
    ),
]