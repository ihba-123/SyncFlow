from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
import cloudinary.uploader
from ..models import Profile
DEFAULT_PROFILE_PUBLIC_ID = "profile_hjkzpu"

class ProfilePhotoRemoveView(APIView): 
    permission_classes = [IsAuthenticated]

    def patch(self, request):  
        profile = request.user.profile  

        if profile.user != request.user:
            return Response(
                {"detail": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )

        with transaction.atomic():
            if profile.photo:
                public_id = getattr(profile.photo, "public_id", None)
                if public_id and public_id != DEFAULT_PROFILE_PUBLIC_ID:
                    try:
                        cloudinary.uploader.destroy(public_id)
                    except Exception:
                        pass  

            
            profile.photo = None
            profile.save()

        return Response(
            {"detail": "Profile picture removed successfully"},
            status=status.HTTP_200_OK
        )