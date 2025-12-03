from django.db import models
from authentication.models import User
from team.models import Project
from django.utils import timezone
from django.core.exceptions import ValidationError
from cloudinary.models import CloudinaryField
from decimal import Decimal


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
    order = models.DecimalField(max_digits=20, decimal_places=10, default=0 , db_index=True)
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
    




class OfflineTaskUpdate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    payload = models.JSONField()  
    timestamp = models.DateTimeField(auto_now_add=True)
    delivered = models.BooleanField(default=False)

    class Meta:
        ordering = ['timestamp']
        unique_together = ['user', 'project', 'payload', 'timestamp']  # prevent duplicates
        indexes = [
            models.Index(fields=['user', 'delivered']),
            models.Index(fields=['project', 'delivered']),
            models.Index(fields=['user', 'project', 'delivered']),
        ]

    def __str__(self):
        return f"Offline update for {self.user.email} in project {self.project.id}"