from django.db import models
from authentication.models import User
from chatapp.models import ChatRoom
import uuid
import hashlib
from django.utils import timezone
from .utils.custom_queryset import ProjectQuerySet
from cloudinary.models import CloudinaryField
from django.contrib.postgres.indexes import GinIndex


# Project Model
# ===============================
class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_projects")
    is_solo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.SET_NULL, null=True, blank=True)
    image = CloudinaryField('image', blank=True, null=True, resource_type='image')
    is_deleted = models.BooleanField(default=False)
    objects = ProjectQuerySet.as_manager()

    def save(self, *args, **kwargs):
        if not self.chat_room and not self.is_solo:
            chatroom = ChatRoom.objects.create(name=f"{self.name} Chat", is_group=True, admin=self.created_by)
            chatroom.add_participant(self.created_by)
            self.chat_room = chatroom
        super().save(*args, **kwargs)  

    class Meta:
        indexes = [ 
            models.Index(fields=['created_by']),
            GinIndex(fields=['name'], opclasses=['gin_trgm_ops'], name='project_name_trgm_idx'),
            GinIndex(fields=['description'], opclasses=['gin_trgm_ops'], name='project_desc_trgm_idx'),
        ]

    def __str__(self):
        return self.name
    

# Invite Model
# ===============================
class Invite(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="invites")
    token = models.CharField(max_length=255, unique=True) 
    invited_email = models.EmailField(blank=True, null=True)
    plain_token = models.CharField(max_length=255, unique=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_invites")
    created_at = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=255, choices=(
        ('admin', 'Admin'),
        ('member', 'Member'),
        ('viewer', 'Viewer'),
    ))

    class Meta:
        indexes = [
            models.Index(fields=['token']),
            models.Index(fields=['expires_at']),
        ]

    def save(self, *args, **kwargs):
        if not self.plain_token:  # Only generate if it doesn't exist
            self.plain_token = str(uuid.uuid4())
            self.token = hashlib.sha256(self.plain_token.encode()).hexdigest()
        super().save(*args, **kwargs)

    def is_valid(self):
        return not self.is_used and self.expires_at > timezone.now()

    def __str__(self):
        return f"Invite for {self.project.name} (Role: {self.role})"




# Project Member
class ProjectMember(models.Model):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('member', 'Member'),
        ('viewer', 'Viewer'),
    )

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='project_membership')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)
    invite_used = models.ForeignKey(Invite, on_delete=models.SET_NULL, null=True, blank=True, related_name='members_joined')

    class Meta:
        unique_together = ('project', 'user')
        indexes = [
            models.Index(fields=['project', 'user'])
        ]

    def __str__(self):
        return f"{self.user.email} in {self.project.name} ({self.role})"



# Activity Log
# ===============================
class ActivityLog(models.Model):
    ACTION_CHOICES = (
        ('member_added', 'Member Added'),
        ('task_created', 'Task Created'),
        ('task_updated', 'Task Updated'),
        ('comment_added', 'Comment Added'),
        ('attachment_added', 'Attachment Added'),
    )

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='activity_logs')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    details = models.TextField(blank=True, null=True)   
    created_at = models.DateTimeField(auto_now_add=True)
    timestamp = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['project', 'created_at']),
        ]

    def __str__(self):
        return f"{self.action} by {self.user.email} in {self.project.name}"


