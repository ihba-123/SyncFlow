from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated  


class OnboardView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.has_completed_onboarding = True
        request.user.save()
        return Response({
            "detail": "Onboarding completed",
        }, status=status.HTTP_200_OK)
    