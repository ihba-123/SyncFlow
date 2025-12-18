from rest_framework.views import APIView  
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..serializers import UserProfileSerializer
from ..utils.authentication import CookieJWTAuthentication
class UserProfileView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)