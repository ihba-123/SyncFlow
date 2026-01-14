from ..serializers import ActivityLogSerializer
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.viewsets import ReadOnlyModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from ..models import ActivityLog

class ActivityLogView(ReadOnlyModelViewSet):
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend , OrderingFilter]
    filterset_fields = ['user', 'action', 'timestamp']
    ordering_fields = ['timestamp', 'user__email']
    ordering = ['-timestamp']

    def get_queryset(self):
        user = self.request.user

        return (
            ActivityLog.objects
            .select_related('user', 'project')
            .filter(project__members__user=user)
        )