from rest_framework import serializers
from team.models import Project
from khanban.models import Task
from authentication.models import User

class ProjectSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'image', 'is_solo']

class TaskSearchSerializer(serializers.ModelSerializer):
    project_id = serializers.IntegerField(source='project.id', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'tags', 'status',  'priority', 'project_id', 'project_name' ]

class MemberSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email']