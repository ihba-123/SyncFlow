from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
import cloudinary.uploader

DEFAULT_PROFILE_PUBLIC_ID = "profile_hjkzpu"

class ProfileDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        profile = getattr(request.user, "profile", None)

        if not profile:
            return Response(
                {"detail": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if profile.user != request.user:
            return Response(
                {"detail": "You do not have permission to delete this profile"},
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

            profile.delete()

        return Response(
            {"detail": "Profile deleted successfully"},
            status=status.HTTP_200_OK
        )
