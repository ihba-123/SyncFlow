import jwt
from urllib.parse import parse_qs

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from http.cookies import SimpleCookie
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware

from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

User = get_user_model()


@database_sync_to_async
def get_user_from_token(token: str):
    try:
        # UntypedToken validates the token (exp, signature, etc.)
        validated_token = UntypedToken(token)
        
        # Access the user_id directly from the validated token's payload
        user_id = validated_token.get("user_id")
        
        if not user_id:
            return AnonymousUser()
            
        return User.objects.get(id=user_id)
    except (InvalidToken, TokenError, User.DoesNotExist):
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):

    def __init__(self, inner):
        super().__init__(inner)

    async def __call__(self, scope, receive, send):

        query = parse_qs(scope.get("query_string", b"").decode())
        token = query.get("token", [None])[0]

        if not token:
            cookies = scope.get("headers", [])
            cookie_header = next((v for k, v in cookies if k == b'cookie'), b'').decode()
            if cookie_header:
                cookie = SimpleCookie()
                cookie.load(cookie_header)
                token = cookie["access_token"].value if "access_token" in cookie else None
        scope["user"] = await get_user_from_token(token) if token else AnonymousUser()

        return await super().__call__(scope, receive, send)
