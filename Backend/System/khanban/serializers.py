from rest_framework import serializers
from .models import Task, TaskComment, TaskAttachment


class TaskAttachmentSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    name = serializers.CharField(source='file_name', read_only=True)

    class Meta:
        model = TaskAttachment
        fields = ['id', 'name', 'file_name', 'file_type', 'url', 'uploaded_at']
        read_only_fields = ['id', 'name', 'file_name', 'file_type', 'url', 'uploaded_at']

    def get_url(self, obj):
        file_obj = getattr(obj, 'file', None)
        if not file_obj:
            return None
        url = getattr(file_obj, 'url', None)
        if url:
            return url
        return str(file_obj)

class TaskSerializer(serializers.ModelSerializer):
    attachments = TaskAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = [
            'id',
            'title',
            'description',
            'status',
            'priority',
            'tags',
            'order',
            'project',
            'assigned_to',
            'due_date',
            'attachments',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['project', 'created_at', 'updated_at']

    # Prevent order manipulation beyond intended use
    def validate_order(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Order cannot be negative.")
        return value


    
class CommentSerializer(serializers.ModelSerializer): 
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = TaskComment
        fields = ['id', 'task', 'user', 'user_email', 'content', 'created_at']
        read_only_fields = ['id', 'task', 'user', 'created_at']
