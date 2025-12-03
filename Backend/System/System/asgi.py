import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from chatapp.middleware.middleware import JWTAuthMiddleware

# Import websocket_urlpatterns from your apps
from chatapp.routing import websocket_urlpatterns as chat_ws_patterns
from khanban.routing import websocket_urlpatterns as kanban_ws_patterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'System.settings')

# Initialize Django
django_asgi_app = get_asgi_application()

# Combine all websocket URL patterns
all_ws_patterns = chat_ws_patterns + kanban_ws_patterns

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddleware(
        URLRouter(all_ws_patterns)
    ),
})
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from chatapp.middleware.middleware import JWTAuthMiddleware

# Import websocket_urlpatterns from your apps
from chatapp.routing import websocket_urlpatterns as chat_ws_patterns
from khanban.routing import websocket_urlpatterns as kanban_ws_patterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'System.settings')

# Initialize Django
django_asgi_app = get_asgi_application()

# Combine all websocket URL patterns
all_ws_patterns = chat_ws_patterns + kanban_ws_patterns

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddleware(
        URLRouter(all_ws_patterns)
    ),
})
