# authentication/models.py
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.contrib.postgres.indexes import GinIndex
from .utils.managers import UserQuerySet

# Custom manager with search methods
class UserManager(BaseUserManager.from_queryset(UserQuerySet)):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        user = self.model(email=self.normalize_email(email), name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        return self.create_user(email, name, password, **extra_fields)

# User model
class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    has_completed_onboarding = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

  
    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.email

    def get_display_name(self):
        if self.name:
            return self.name.strip()
        local_part = self.email.split("@")[0]
        return local_part.replace(".", " ").replace("_", " ").title()

    @property
    def is_staff(self):
        return self.is_admin

    def has_perm(self, perm, obj=None):
        return self.is_admin or self.is_superuser

    def has_module_perms(self, app_label):
        return True

    class Meta:
        indexes = [
            GinIndex(fields=['name'], opclasses=['gin_trgm_ops'], name='user_name_trgm_idx'),
            GinIndex(fields=['email'], opclasses=['gin_trgm_ops'], name='user_email_trgm_idx'),
        ]
