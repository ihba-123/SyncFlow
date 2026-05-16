from .models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from chatapp.models import Profile

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    password2 = serializers.CharField(write_only=True, required=True, min_length=8)  # serializer-only

    class Meta:
        model = User
        fields = ("id", "email", "name", "password", "password2")
        read_only_fields = ("id",)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists")
        return value

    def validate_password(self, value):
        validate_password(value)
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')  # remove password2 before creating user
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id" ,"name","email")
        read_only_fields = ("id",)



#Login Serializer

class loginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self , attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(request=self.context.get('request'),email=email,password=password)

        if not user:
            raise serializers.ValidationError("Invalid Credentials")
        
        attrs['user'] = user
        return attrs
    

#User profile Serializer

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "name" ,"has_completed_onboarding")
        read_only_fields = ("id",)


class GoogleOAuthSerializer(serializers.Serializer):
    id_token = serializers.CharField(required=True, trim_whitespace=True)

    def validate_id_token(self, value):
        token = value.strip()
        if not token:
            raise serializers.ValidationError("Google id_token is required")
        return token


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True, min_length=8)
    new_password2 = serializers.CharField(write_only=True, required=True, min_length=8)

    def validate_old_password(self, value):
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if user is None or not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value

    def validate(self, attrs):
        if attrs.get('new_password') != attrs.get('new_password2'):
            raise serializers.ValidationError({"new_password": "New passwords do not match"})
        validate_password(attrs.get('new_password'))
        return attrs

    def save(self, **kwargs):
        request = self.context.get('request')
        user = request.user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
    



class RequestOTPSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        return value


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    otp = serializers.CharField(write_only=True, required=True, min_length=6, max_length=6)
    new_password = serializers.CharField(write_only=True, required=True, min_length=8)

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email does not exist")
        return value

    def validate_new_password(self, value):
        validate_password(value)
        return value
    


