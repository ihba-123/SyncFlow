"""
ASGI config for SyncFlow project.
Supports both HTTP and WebSocket protocols.
"""
import os
import django
from django.core.asgi import get_asgi_application

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

# Initialize Django ASGI application
django_asgi_app = get_asgi_application()

# Import after Django initialization
from channels.routing import ProtocolTypeRouter, URLRouter
from apps.chatapp.middleware.middleware import JWTAuthMiddleware
from apps.chatapp.routing import websocket_urlpatterns as chat_ws_patterns
from apps.khanban.routing import websocket_urlpatterns as kanban_ws_patterns
from apps.team.routing import websocket_urlpatterns as team_ws_patterns

# Combine WebSocket patterns from all apps
all_ws_patterns = chat_ws_patterns + kanban_ws_patterns + team_ws_patterns

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddleware(
        URLRouter(all_ws_patterns)
    ),
})
