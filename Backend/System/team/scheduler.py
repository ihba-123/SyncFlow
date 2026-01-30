# team/scheduler.py
from apscheduler.schedulers.background import BackgroundScheduler
from django.utils.timezone import now
from .models import Invite

def delete_expired_invites():
    Invite.objects.filter(expires_at__lt=now()).delete()

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(delete_expired_invites, 'interval', minutes=30)
    scheduler.start()
