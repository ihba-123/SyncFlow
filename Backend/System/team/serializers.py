from rest_framework import serializers
from .models import Invite
class CreateProjectSerializer(serializers.Serializer):
  name = serializers.CharField(max_length=100)
  description = serializers.CharField(max_length=1000,allow_blank=True, default='', required=False)
  is_solo = serializers.BooleanField(default=True)

class ProjectListSerializer(serializers.Serializer):
  id = serializers.IntegerField(read_only=True)
  name = serializers.CharField(read_only=True)
  description = serializers.CharField(read_only=True, allow_blank=True)
  created_at = serializers.DateTimeField(read_only=True)
  is_solo = serializers.BooleanField(read_only=True)
  chat_room = serializers.CharField(read_only=True, allow_null=True)


class ProjectDetailSerializer(serializers.Serializer):
  id = serializers.IntegerField(read_only=True)
  name = serializers.CharField(read_only=True)
  description = serializers.CharField(read_only=True, allow_blank=True)
  created_by = serializers.EmailField(read_only=True)         
  is_solo = serializers.BooleanField(read_only=True)
  chat_room = serializers.CharField(read_only=True, allow_null=True)
  created_at = serializers.DateTimeField(read_only=True)
  updated_at = serializers.DateTimeField(read_only=True)



class UserInviteSerializer(serializers.Serializer):
  role = serializers.ChoiceField(choices=[('admin', 'Admin'), ('member', 'Member'), ('viewer', 'Viewer')], required=True)
  expires_days = serializers.IntegerField(min_value=1, max_value=30 , default=3)
  invited_email = serializers.EmailField(required=False , allow_blank=True)


class UseInviteSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=255, required=True)



class InviteDetailSerializer(serializers.ModelSerializer):
    # These are already mapped to related fields
    project = serializers.CharField(source='project.name', read_only=True)
    created_by = serializers.EmailField(source='created_by.email', read_only=True)

    class Meta:
        model = Invite  
        fields = [
            'id', 'project', 'plain_token', 'expires_at',
            'is_used', 'created_by', 'created_at', 'role',
        ]
        read_only_fields = [
            'id', 'project', 'plain_token', 'expires_at', 'is_used',
            'created_by', 'created_at',
        ]