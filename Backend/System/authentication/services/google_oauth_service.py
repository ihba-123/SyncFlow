import logging
from dataclasses import dataclass

from django.conf import settings
from django.db import transaction

from authentication.models import User

logger = logging.getLogger(__name__)




@dataclass
class GoogleOAuthError(Exception):
    message: str
    status_code: int

    def __str__(self):
        return self.message


def _allowed_google_client_ids():
    configured = getattr(settings, "GOOGLE_CLIENT_ID", "")
    extra_configured = getattr(settings, "GOOGLE_CLIENT_IDS", [])

    client_ids = []
    if isinstance(configured, str) and configured.strip():
        client_ids.extend([cid.strip() for cid in configured.split(",") if cid.strip()])

    if isinstance(extra_configured, (list, tuple)):
        client_ids.extend([str(cid).strip() for cid in extra_configured if str(cid).strip()])

    # Preserve order while removing duplicates.
    unique_client_ids = []
    seen = set()
    for cid in client_ids:
        if cid not in seen:
            seen.add(cid)
            unique_client_ids.append(cid)
    return unique_client_ids


def _validate_google_claims(claims, allowed_client_ids):
    issuer = claims.get("iss", "")
    audience = claims.get("aud", "")
    email = claims.get("email")
    email_verified = claims.get("email_verified", False)

    if issuer not in {"accounts.google.com", "https://accounts.google.com"}:
        raise GoogleOAuthError("Invalid Google token issuer", 401)

    if audience not in allowed_client_ids:
        raise GoogleOAuthError("Google token audience is not allowed", 401)

    if not email:
        raise GoogleOAuthError("Google token does not include an email", 400)

    if not email_verified:
        raise GoogleOAuthError("Google account email is not verified", 403)


def _default_display_name(email, google_name):
    if google_name and isinstance(google_name, str) and google_name.strip():
        return google_name.strip()
    return email.split("@")[0]


@transaction.atomic
def authenticate_google_user(google_token):
    try:
        from google.auth.transport import requests as google_requests
        from google.oauth2 import id_token as google_id_token
    except ModuleNotFoundError:
        logger.error("google-auth is not installed")
        raise GoogleOAuthError("Google OAuth dependency is not installed", 500)

    allowed_client_ids = _allowed_google_client_ids()
    if not allowed_client_ids:
        logger.error("GOOGLE_CLIENT_ID is not configured")
        raise GoogleOAuthError("Google OAuth is not configured", 500)

    request_adapter = google_requests.Request()

    try:
        claims = google_id_token.verify_oauth2_token(
        google_token,
        request_adapter,
        audience=allowed_client_ids[0],  # pass primary client ID
        clock_skew_in_seconds=10,        # tolerates minor clock drift
)
    except Exception:
        raise GoogleOAuthError("Invalid Google ID token", 401)

    _validate_google_claims(claims, allowed_client_ids)

    email = claims["email"].strip().lower()
    display_name = _default_display_name(email, claims.get("name"))

    user = User.objects.filter(email=email).first()
    created = False

    if user is None:
        user = User.objects.create_user(
            email=email,
            name=display_name,
            password=None,
        )
        created = True
    elif not user.name and display_name:
        user.name = display_name
        user.save(update_fields=["name", "updated_at"])

    if not user.is_active:
        raise GoogleOAuthError("User account is disabled", 403)

    return user, created
