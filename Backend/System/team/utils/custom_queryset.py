from django.db import models

class ProjectQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_deleted=False)
    
    def deleted(self):
        return self.filter(is_deleted=True)

    def get_user_projects(self, user):
        return self.active().filter(members__user=user).distinct()
