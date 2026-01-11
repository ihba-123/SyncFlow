from django.db import models
from django.db.models import Q
from django.contrib.postgres.search import TrigramSimilarity
class   ProjectQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_deleted=False)
    
    def deleted(self):
        return self.filter(is_deleted=True)

    def get_user_projects(self, user):
        return self.active().filter(members__user=user).distinct()
    
    def for_user(self, user):
        """
        All projects user can access: created by them OR they are a member.
        Includes solo projects of the user.
        """
        return self.active().filter(
            Q(created_by=user) | Q(members__user=user)
        ).distinct()

    # === NEW: Full Fuzzy Search (Secure + Fast) ===
    def search(self, query: str, user, threshold: float = 0.4, limit: int = 10):
        if not query or not user.is_authenticated:
            return self.none()

        query = query.strip()
        if not query:
            return self.none()

        qs = self.for_user(user)  # Permissions FIRST

        if len(query) < 3:
            return qs.filter(
                Q(name__icontains=query) |
                Q(description__icontains=query)
            ).distinct()[:limit]

        similarity = TrigramSimilarity('name', query) + TrigramSimilarity('description', query)

        return qs.annotate(similarity=similarity).filter(
            Q(name__iexact=query) |
            Q(description__iexact=query) |
            Q(similarity__gt=threshold)
        ).order_by('-similarity')[:limit]
