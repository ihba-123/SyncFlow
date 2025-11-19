# team/urls.py
from django.urls import path
from team.views.project_views import (
    ProjectCreateView,
    ListProjectsView,
    ProjectDetailView,
)
from team.views.invite_views import InviteView , UseInviteView , ListInvitesView

urlpatterns = [
    path("projects/create/", ProjectCreateView.as_view(), name="project-create"),
    path("projects/list/", ListProjectsView.as_view(), name="project-list"),
    path("projects/<int:project_id>/", ProjectDetailView.as_view(), name="project-detail"),
    path("projects/<int:project_id>/invite/", InviteView.as_view(), name="project-invite"),
    path("join-invite/", UseInviteView.as_view(), name="project-use-invite"),
    path("projects/<int:project_id>/invites/list/", ListInvitesView.as_view(), name="project-invites"),
]