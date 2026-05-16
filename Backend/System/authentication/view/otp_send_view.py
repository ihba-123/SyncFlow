from rest_framework.views import APIView, status
from rest_framework.response import Response
from authentication.serializers import RequestOTPSerializer
from authentication.models import User
from authentication.utils.email_sender import send_otp_email
from rest_framework.permissions import AllowAny
from rest_framework.throttling import UserRateThrottle
from django.utils import timezone
import random



class RequestOTPView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [UserRateThrottle] # Limit to 5 requests per hour per user

    def post(self, request):
        serializer = RequestOTPSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            user = User.objects.filter(email=email).first()
            otp = str(random.randint(100000, 999999))

            #save otp to user model
            if user:
                user.otp_secret = otp
                user.otp_created_at = timezone.now()
                user.save()
            
            else:
                user = User.objects.create_user(email=email, name=email.split('@')[0], password=None, otp_secret=otp , otp_created_at=timezone.now())
            #send otp to email
            send_otp_email(email, otp)
            return Response(
                {
                    "message": "OTP sent successfully",
                    "email": email,
                    "expires_in": 300,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
