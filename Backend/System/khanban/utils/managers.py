# task/managers.py
from django.db import models
from django.db.models import Q
from django.contrib.postgres.search import TrigramSimilarity
from team.models import Project


class TaskQuerySet(models.QuerySet):
    def for_user(self, user):
        accessible_projects = Project.objects.for_user(user).values_list('id', flat=True)
        return self.filter(project__id__in=accessible_projects)

    def search(self, query: str, user, threshold: float = 0.35, limit: int = 10):
        if not query or not user.is_authenticated:
            return self.none()

        query = query.strip()
        if not query:
            return self.none()

        qs = self.for_user(user)

        if len(query) < 3:
            return qs.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(tags__icontains=query)
            )[:limit]

        similarity = (
            TrigramSimilarity('title', query) +
            TrigramSimilarity('description', query) +
            TrigramSimilarity('tags', query)
        )

        return qs.annotate(similarity=similarity).filter(
            Q(title__iexact=query) |
            Q(description__iexact=query) |
            Q(tags__iexact=query) |
            Q(similarity__gt=threshold)
        ).order_by('-similarity')[:limit]