from rest_framework import serializers
from .models import Invite , Project  , ActivityLog
from django.utils import timezone

class CreateProjectSerializer(serializers.Serializer):
  name = serializers.CharField(max_length=100)
  description = serializers.CharField(max_length=1000,allow_blank=True, default='', required=False)
  is_solo = serializers.BooleanField(default=True)
  image = serializers.ImageField(required=False , allow_null=True)

  def get_image(self, obj):
    return obj.image.url if obj.image else None


class ProjectListSerializer(serializers.Serializer):
  id = serializers.IntegerField(read_only=True)
  name = serializers.CharField(read_only=True)
  description = serializers.CharField(read_only=True, allow_blank=True)
  created_at = serializers.DateTimeField(read_only=True)
  is_solo = serializers.BooleanField(read_only=True)
  chat_room = serializers.CharField(read_only=True, allow_null=True)
  updated_at = serializers.DateTimeField(read_only=True)
  image = serializers.SerializerMethodField()

  def get_image(self, obj):
    return obj.image.url if obj.image else None


class ProjectDetailSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'created_by', 
            'is_solo', 'chat_room', 'image', 'created_at', 'updated_at'
        ]


    def get_image(self, obj):
        if obj.image: 
            return obj.image.url 
        return None 



class UserInviteSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=[('admin', 'Admin'), ('member', 'Member'), ('viewer', 'Viewer')], required=True)
    expires_days = serializers.IntegerField(min_value=1, max_value=30, default=3)
    invited_email = serializers.EmailField(required=False, allow_blank=True)

class UseInviteSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=255, required=True)

class InviteDetailSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = Invite
        fields = [
            "id", "project", "token", "invited_email", 
            "expires_at", "role", "is_used", "status", "created_at"
        ]

    def get_status(self, obj):
        if obj.is_used:
            return "Used"
        if obj.expires_at < timezone.now():
            return "Expired"
        return "Active"

class ActivityLogSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_image = serializers.SerializerMethodField()  
    project_name = serializers.CharField(source='project.name', read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    is_solo = serializers.SerializerMethodField()
    class Meta:
        model = ActivityLog
        fields = [
            'id', 'user', 'user_name', 'user_image', 'project', 'project_name', 
            'action', 'action_display', 'details', 'timestamp' ,'is_solo'
        ]
    
    def get_is_solo(self, obj):
        return obj.project.is_solo

    def get_user_image(self, obj):
        if hasattr(obj.user, 'profile') and obj.user.profile.photo:
            return obj.user.profile.photo.url
        return None

         

