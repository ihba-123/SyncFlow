from rest_framework import serializers
from .models import Task, TaskComment, TaskAttachment

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'order', 'project', 'assigned_to', 'due_date', 'created_at', 'updated_at']
        read_only_fields = ['project', 'created_at', 'updated_at']

    # Prevent order manipulation beyond intended use
    def validate_order(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Order cannot be negative.")
        return value
    

