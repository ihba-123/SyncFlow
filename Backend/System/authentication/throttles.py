from rest_framework.throttling import SimpleRateThrottle


class LoginRateThrottle(SimpleRateThrottle):
    scope = "login"

    def get_cache_key(self, request, view):
        return self.get_ident(request)


class RefreshRateThrottle(SimpleRateThrottle):
    scope = "refresh"

    def get_cache_key(self, request, view):
        return self.get_ident(request)


class GoogleOAuthRateThrottle(SimpleRateThrottle):
    scope = "google_oauth"
    rate = "20/min"

    def get_cache_key(self, request, view):
        return self.get_ident(request)


class PasswordResetRequestThrottle(SimpleRateThrottle):
    scope = "password_reset_request"

    def get_cache_key(self, request, view):
        return self.get_ident(request)


class PasswordResetVerifyThrottle(SimpleRateThrottle):
    scope = "password_reset_verify"

    def get_cache_key(self, request, view):
        return self.get_ident(request)


class PasswordResetConfirmThrottle(SimpleRateThrottle):
    scope = "password_reset_confirm"

    def get_cache_key(self, request, view):
        return self.get_ident(request)