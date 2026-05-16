import logging

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.serializers import GoogleOAuthSerializer
from authentication.services.google_oauth_service import (
    GoogleOAuthError,
    authenticate_google_user,
)
from authentication.services.login_services import login_services
from authentication.throttles import GoogleOAuthRateThrottle
from authentication.utils.set_refiresh import set_access_cookie, set_refresh_cookie

logger = logging.getLogger(__name__)


class GoogleOAuthView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [GoogleOAuthRateThrottle]

    @method_decorator(ensure_csrf_cookie)
    def post(self, request):
        serializer = GoogleOAuthSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            user, created = authenticate_google_user(serializer.validated_data["id_token"])
            token_data = login_services(user)

            response = Response(
                {
                    "access": token_data["access"],
                    "refresh": token_data["refresh"],
                    "onboarding_completed": token_data["has_completed_onboarding"],
                    "user": token_data["user"],
                    "is_new_user": created,
                },
                status=status.HTTP_200_OK,
            )
            set_refresh_cookie(response, token_data["refresh"])
            set_access_cookie(response, token_data["access"])
            return response

        except GoogleOAuthError as exc:
            logger.warning("Google OAuth rejected: %s", exc)
            return Response({"detail": str(exc)}, status=exc.status_code)
        except Exception:
            logger.exception("Unhandled Google OAuth error")
            return Response(
                {"detail": "Unable to complete Google sign-in"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
