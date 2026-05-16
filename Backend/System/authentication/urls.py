from django.urls import path, include 
from .view.registration_view import UserRegistrationView
from .view.login_views import UserLoginView
from .view.user_logout_views import UserLogoutView
from .view.user_profile_views import UserProfileView
from .view.token_views import RefreshTokenView
from .view.google_oauth_view import GoogleOAuthView
from .view.change_password_view import ChangePasswordView
from .view.otp_send_view import RequestOTPView
from .view.reset_password import ResetPasswordView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register' ),
    path('refresh-token/', RefreshTokenView.as_view(), name='refresh-token'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('google-oauth/', GoogleOAuthView.as_view(), name='google-oauth'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('logout/', UserLogoutView.as_view(), name='logout'),
    path('request-otp/', RequestOTPView.as_view(), name='request-otp'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    # path('onboard/', OnboardView.as_view(), name='onboard'),
]

