# authentication/utils/managers.py

from django.db import models
from django.db.models import Q
from django.contrib.postgres.search import TrigramSimilarity


class UserQuerySet(models.QuerySet):
    def accessible_members(self, user):
        if not user.is_authenticated:
            return self.none()

        # ── LAZY IMPORTS ── break the circular import
        from team.models import Project, ProjectMember

        project_ids = Project.objects.for_user(user).values_list('id', flat=True)
        member_ids = ProjectMember.objects.filter(
            project_id__in=project_ids
        ).values_list('user_id', flat=True).distinct()

        return self.filter(id__in=member_ids)

    def search_members(self, query: str, user, threshold: float = 0.5, limit: int = 10):
        if not query or not user.is_authenticated:
            return self.none()

        query = query.strip()
        if not query:
            return self.none()

        qs = self.accessible_members(user)

        if len(query) < 3:
            return qs.filter(
                Q(name__icontains=query) | Q(email__icontains=query)
            )[:limit]

        similarity = (
            TrigramSimilarity('name', query) +
            TrigramSimilarity('email', query)
        )

        return qs.annotate(similarity=similarity).filter(
            Q(name__iexact=query) |
            Q(email__iexact=query) |
            Q(similarity__gt=threshold)
        ).order_by('-similarity')[:limit]