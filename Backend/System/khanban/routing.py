# routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # URL format: ws/kanban/<project_id>/
    re_path(r'^ws/kanban/(?P<project_id>\d+)/$', consumers.KanbanConsumer.as_asgi()),
]
