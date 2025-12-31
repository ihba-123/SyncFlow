from rest_framework import generics
from rest_framework import permissions
from ..serializer import PersonlDetailsSerializer
from ..models import Profile
class UserDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PersonlDetailsSerializer
    def get_object(self):
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile