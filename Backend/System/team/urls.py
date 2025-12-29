# team/urls.py
from django.urls import path
from team.views.project_views import (
    ProjectCreateView,
    ListProjectsView,
    ProjectDetailView,
    ProjectSoftDeleteView,
    ProjectRestoreView,
    ProjectUpdateView,
)
from team.views.remove_view import LeaveProjectView , RemoveMemberView
from team.views.invite_views import InviteView , UseInviteView , ListInvitesView



urlpatterns = [
    path("projects/create/", ProjectCreateView.as_view(), name="project-create"),
    path("projects/<int:project_id>/update/", ProjectUpdateView.as_view(), name="project-update"),
    path("projects/<int:project_id>/delete/", ProjectSoftDeleteView.as_view(), name="project-soft-delete"),
    path("projects/<int:project_id>/restore/", ProjectRestoreView.as_view(), name="project-restore"),
    path("projects/list/", ListProjectsView.as_view(), name="project-list"),
    path("projects/<int:project_id>/", ProjectDetailView.as_view(), name="project-detail"),
    path("projects/<int:project_id>/invite/", InviteView.as_view(), name="project-invite"),
    path("join-invite/", UseInviteView.as_view(), name="project-use-invite"),
    path("projects/<int:project_id>/invites/list/", ListInvitesView.as_view(), name="project-invites"),
    path('projects/<int:project_id>/leave/', LeaveProjectView.as_view(), name='project-leave'),
    path('projects/<int:project_id>/remove/<int:user_id>/', RemoveMemberView.as_view(), name='project-remove-member'),
]