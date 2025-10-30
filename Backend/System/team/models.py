from django.db import models
from authentication.models import User
from chatapp.models import ChatRoom
import uuid
import hashlib
from django.utils import timezone
from django.core.exceptions import ValidationError
from cloudinary.models import CloudinaryField



# ===============================
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

    def save(self, *args, **kwargs):
        if not self.chat_room and not self.is_solo:
            chatroom = ChatRoom.objects.create(name=f"{self.name} Chat", is_group=True, admin=self.created_by)
            chatroom.add_participant(self.created_by)
            self.chat_room = chatroom
        super().save(*args, **kwargs)  

    class Meta:
        indexes = [ 
            models.Index(fields=['created_by'])
        ]

    def __str__(self):
        return self.name
    
# ===============================
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



# ===============================
# Project Member
# ===============================
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

# ===============================
# Task (Kanban)
# ===============================
class Task(models.Model):
    STATUS_CHOICES = (
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    )
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='low')
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    order = models.PositiveBigIntegerField(default=0)
    tags = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=['project','status']),
            models.Index(fields=['assigned_to']),
        ]

    def clean(self):
        if self.due_date and self.due_date < timezone.now():
            raise ValidationError("Due date cannot be in the past.")

    def __str__(self):
        return f"{self.title} ({self.status})"

# ===============================
# Task Comment
# ===============================
class TaskComment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='task_comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [   
            models.Index(fields=['task']),
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"Comment by {self.user.email} on {self.task.title}"

# ===============================
# Task Attachment
# ===============================
class TaskAttachment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='attachments')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    file = CloudinaryField('file', resource_type='auto') 
    file_name = models.CharField(max_length=255)  
    file_type = models.CharField(max_length=50, blank=True, null=True)  
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['task']),
        ]

    def save(self, *args, **kwargs):
        if self.file and not self.file_name:
            self.file_name = self.file.name.split('/')[-1]
            self.file_type = self.file_name.split('.')[-1].lower()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.file_name} for {self.task.title}"

# =============================== 
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

    class Meta:
        indexes = [
            models.Index(fields=['project', 'created_at']),
        ]

    def __str__(self):
        return f"{self.action} by {self.user.email} in {self.project.name}"
