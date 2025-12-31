from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from ..serializer import ProfileUpdateSerializer
from ..models import Profile
import logging

logger = logging.getLogger(__name__)

class ProfileUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfileUpdateSerializer

    def get_object(self):
        """
        Returns the profile for the logged-in user.
        Auto-creates the profile if it does not exist.
        """
        try:
            profile = self.request.user.profile
        except ObjectDoesNotExist:
            # Optional: Auto-create profile
            profile = Profile.objects.create(user=self.request.user)
            logger.info(f"Profile auto-created for user {self.request.user.id}")
        return profile

    def patch(self, request, *args, **kwargs):
        profile = self.get_object()
        serializer = self.get_serializer(profile, data=request.data, partial=True)

        serializer.is_valid(raise_exception=True)

        try:
            with transaction.atomic():
                serializer.save()
        except Exception as e:
            logger.error(f"Profile update failed for user {request.user.id}: {str(e)}")
            return Response(
                {"success": False, "message": "Failed to update profile. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {"success": True, "message": "Profile updated successfully.", "data": serializer.data},
            status=status.HTTP_200_OK
        )
