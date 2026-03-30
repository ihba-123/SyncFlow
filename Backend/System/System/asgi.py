import os
import django
from django.core.asgi import get_asgi_application

# 1. Set settings first
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'System.settings')

# 2. Initialize the Django ASGI application early.
django_asgi_app = get_asgi_application()

# 3. NOW import your routing/consumers
from channels.routing import ProtocolTypeRouter, URLRouter
from chatapp.middleware.middleware import JWTAuthMiddleware
from chatapp.routing import websocket_urlpatterns as chat_ws_patterns
from khanban.routing import websocket_urlpatterns as kanban_ws_patterns
from team.routing import websocket_urlpatterns as team_ws_patterns

# Combine patterns
all_ws_patterns = chat_ws_patterns + kanban_ws_patterns + team_ws_patterns


application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddleware(
        URLRouter(all_ws_patterns)
    ),
})