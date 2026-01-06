from rest_framework import serializers
from .models import Invite , Project 
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
  expires_days = serializers.IntegerField(min_value=1, max_value=30 , default=3)
  invited_email = serializers.EmailField(required=False , allow_blank=True)


class UseInviteSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=255, required=True)


class InviteDetailSerializer(serializers.ModelSerializer):
    project = serializers.CharField(source='project.name', read_only=True)
    invited_email = serializers.EmailField(read_only=True, allow_null=True)

    joined_user_email = serializers.SerializerMethodField()
    joined_user_name = serializers.SerializerMethodField()  # ← Fixed here

    created_by_email = serializers.SerializerMethodField()
    creator_is_online = serializers.SerializerMethodField()

    class Meta:
        model = Invite
        fields = [
            'id', 'project', 'invited_email', 'plain_token', 'expires_at',
            'joined_user_email', 'joined_user_name', 'creator_is_online',
            'is_used', 'created_by_email', 'created_at', 'role',
        ]

    def get_joined_user_email(self, obj):
        member = obj.members_joined.first()
        return member.user.email if member else None

    def get_joined_user_name(self, obj):
      member = obj.members_joined.first()
      if not member:
        return None

      user = member.user

    # Use actual name field
      if user.name:
        return user.name.strip()

    # Fallback to cleaned email
      local_part = user.email.split("@")[0]
      return local_part.replace(".", " ").replace("_", " ").title()

    def get_created_by_email(self, obj):
        return obj.created_by.email if obj.created_by else None

    def get_creator_is_online(self, obj):
        from chatapp.models import Profile
        try:
            return Profile.objects.get(user=obj.created_by).is_online
        except Profile.DoesNotExist:
            return False