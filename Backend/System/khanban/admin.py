from django.contrib import admin

# Register your models here.
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id','title', 'status', 'assigned_to', 'created_at', 'updated_at')
    search_fields = ('title', 'assigned_to__email')
    list_filter = ('status', 'assigned_to')

