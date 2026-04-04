from rest_framework import serializers
from .models import *
import logging
import cloudinary

logger = logging.getLogger(__name__)

class ProfileSerializer(serializers.ModelSerializer):
    friends = serializers.StringRelatedField(many=True)
    photo = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['user', 'friends', 'is_online', 'bio' , 'photo']
        extra_kwargs = {'photo': {'write_only': True}}

    def get_photo(self, obj):
        logger.info(f"Profile {obj.id} photo: {obj.photo}")
        if obj.photo:
            logger.info(f"Photo URL: {obj.photo.url}")
            print("Photo URL:", obj.photo.url)
            return obj.photo.url
        logger.info("No photo set, returning default URL")
        image = cloudinary.utils.cloudinary_url(
            "profile_hjkzpu"
        )[0]
        return image
        
        
    def get_is_online(self, obj):
        profile = getattr(obj, 'profile', None)
        if profile:
            return profile.is_online
        return False




class ProfileUpdateSerializer(serializers.ModelSerializer):
    photo = serializers.ImageField(required=False)
    name = serializers.CharField(required=False)
    class Meta:
        model = Profile
        fields = ['id','name','bio', 'photo']

    def get_photo(self, obj):
        
        import cloudinary
        if obj.photo:
            # Return the full Cloudinary URL
            return (
                obj.photo.url
                
                if hasattr(obj.photo, 'url')
                else cloudinary.utils.cloudinary_url(str(obj.photo))[0]
            )
        # Fallback default image (optional)
        default_public_id = "profile_hjkzpu"
        default_url = cloudinary.utils.cloudinary_url(
            default_public_id,
            resource_type="image",
            secure=True
        )[0]
        return default_url
    
    def update(self, instance, validated_data):
        # Update user name if present
        new_name = validated_data.pop('name', None)
        if new_name:
            instance.user.name = new_name
            instance.user.save()

        # Update Profile fields
        return super().update(instance, validated_data)

    

class PersonlDetailsSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    name = serializers.CharField(source='user.name', read_only=True)
    bio = serializers.CharField(read_only=True)
    photo = serializers.SerializerMethodField()
    is_online = serializers.BooleanField(read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'user_id', 'name', 'bio', 'photo', 'is_online']

    def get_photo(self, obj):
        if obj.photo:
            return obj.photo.build_url()  # user uploaded photo
    # default fallback
        default_public_id = "profile_hjkzpu" 
        default_url = cloudinary.utils.cloudinary_url(
        default_public_id,
        resource_type="image",
        secure=True     # always HTTPS
        )[0]
        return default_url
    
    
class ChatUserSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    attachment = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'sender', 'content', 'attachment', 'timestamp', 'images']
        read_only_fields = ['id', 'timestamp']

    def _build_cloudinary_url(self, field_value, resource_type="image"):
        if not field_value:
            return None

        raw_value = str(field_value)
        if raw_value.startswith("http://") or raw_value.startswith("https://"):
            return raw_value

        # Handle Cloudinary relative URLs like /image/upload/... or /raw/upload/...
        if raw_value.startswith("/"):
            cloud_name = cloudinary.config().cloud_name
            if cloud_name:
                return f"https://res.cloudinary.com/{cloud_name}{raw_value}"

        try:
            return cloudinary.utils.cloudinary_url(
                raw_value,
                resource_type=resource_type,
                secure=True,
            )[0]
        except Exception:
            return raw_value

    def get_sender(self, obj):
        # Always return sender’s Profile
        profile = getattr(obj.sender, 'profile', None)
        if profile:
            return PersonlDetailsSerializer(profile).data
        return None
    
    def get_content(self,obj):
        return obj.decrypted_content

    def get_attachment(self, obj):
        try:
            if obj.attachment:
                return self._build_cloudinary_url(obj.attachment, resource_type="raw")
            return None
        except Exception:
            return None

    def get_images(self, obj):
        try:
            if obj.images:
                return self._build_cloudinary_url(obj.images, resource_type="image")
            return None
        except Exception:
            return None



class MessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['content', 'attachment', 'images']

    

#Remove duplicate user in group chat

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'is_group', 'participants', 'admin', 'group_image', 'created_at']

    def validate_participants(self, value):
        unique_user = list(set(value))
        return unique_user

    