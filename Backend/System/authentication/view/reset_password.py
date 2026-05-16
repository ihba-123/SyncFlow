from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from authentication.serializers import ResetPasswordSerializer
from authentication.models import User


class ResetPasswordView(APIView):

    def post(self, request):

        serializer = ResetPasswordSerializer(data=request.data)

        if serializer.is_valid():

            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            new_password = serializer.validated_data['new_password']

            user = User.objects.filter(email=email).first()

            if not user:
                return Response(
                    {"error": "User not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            if not user.otp_secret or not user.otp_created_at:
                return Response(
                    {"error": "OTP has not been requested"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            # Check if OTP is expired (valid for 5 minutes)
            if timezone.now() > user.otp_created_at + timedelta(minutes=5):
                return Response(
                        {"error": "OTP expired"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Check OTP
            if user.otp_secret != otp:
                return Response(
                    {"error": "Invalid OTP"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Reset password
            user.set_password(new_password)

            # Clear OTP after successful reset
            user.otp_secret = None
            user.otp_created_at = None

            user.save()

            return Response(
                {
                    "message": "Password reset successful",
                    "email": email,
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )