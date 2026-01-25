from apscheduler.schedulers.background import BackgroundScheduler
from django.utils import timezone   
from team.models import Invite


def delete_expired_invites():
    Invite.objects.filter(expires_at__lt=timezone.now()).delete()

scheduler = BackgroundScheduler()
scheduler.add_job(delete_expired_invites, 'interval', minutes=60)
scheduler.start()