# team/routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # Accept either a numeric project_id or the literal 'all' for global/listen subscriptions
    re_path(r'^/?ws/projects/(?P<project_id>\d+|all)/$', consumers.ProjectCollaborationConsumer.as_asgi()),
]