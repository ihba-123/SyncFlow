from rest_framework import serializers
from team.models import ActivityLog


class ActivityLogSerializer(serializers.ModelSerializer):

    user_email = serializers.CharField(source="user.email")

    class Meta:
        model = ActivityLog
        fields = [
            "id",
            "user_email",
            "action",
            "details",
            "created_at",
        ]