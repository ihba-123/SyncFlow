from django.contrib import admin
from .models import Project, ProjectMember, Invite

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
  list_display = ('name', 'created_by', 'is_solo', 'created_at')
  search_fields = ('name', 'created_by__email')

@admin.register(ProjectMember)
class ProjectMemberAdmin(admin.ModelAdmin):
  list_display = ('user', 'project', 'role', 'joined_at')
  search_fields = ('user__email', 'project__name')

@admin.register(Invite)
class InviteAdmin(admin.ModelAdmin):
  list_display = ('id','project', 'token', 'expires_at', 'is_used', 'created_at')
  search_fields = ('project__name', 'token')