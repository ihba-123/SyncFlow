from .models import *
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.db.models.signals import post_save , post_delete
from django.dispatch import receiver
from .models import ChatRoom
from team.models import ProjectMember

import logging

logger = logging.getLogger(__name__)


# Auto-create profile for new users
@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        logger.info(f"Profile created for user {instance.email}")


# Set user online/offline   
@receiver(user_logged_in)
def set_user_online(sender, request, user, **kwargs):
    profile, _ = Profile.objects.get_or_create(user=user)
    profile.is_online = True
    profile.save()
    logger.info(f"User {user.email} is online")

@receiver(user_logged_out)
def set_user_offline(sender, request, user, **kwargs):
    try:
        profile = Profile.objects.get(user=user)
        profile.is_online = False
        profile.save()
        logger.info(f"User {user.email} is offline")
    except Profile.DoesNotExist:
        logger.error(f"Profile does not exist for user {user.email}")


# Set default group image for ChatRoom
@receiver(post_save, sender=ChatRoom)
def set_default_group_image(sender, instance, created, **kwargs):
    if created and not instance.group_image:
        instance.group_image = "chatroom/profile_hjkzpu"
        instance.save()
        logger.info(f"Default group image set for ChatRoom {instance.id}")
    else:
        logger.info(f"Default group image already set for ChatRoom {instance.id}")



# Default Photo for Profile
@receiver(post_save , sender=Profile)  
def set_default_profile_photo(sender,instance, created , **kwargs):
    if created and not instance.photo:  
        instance.photo = "defaults/profile_hjkzpu"
        instance.save(update_fields=['photo'])
        logger.info(f"Default profile photo set for Profile {instance.id}")
    else:
        logger.info(f"Default profile photo already set for Profile {instance.id}")


    
# Signal to add a member to the project chat when they are added to the project
@receiver(post_save, sender=ProjectMember)
def add_member_to_project_chat(sender, instance, created, **kwargs):
    if created:
        project = instance.project
        user = instance.user
        
        # Check if the project has a chat room assigned
        if project.chat_room:
            # Use your model's helper method to add the participant
            project.chat_room.add_participant(user)


# Signal to remove a member from the project chat when they are removed from the project
@receiver(post_delete, sender=ProjectMember)
def remove_member_from_project_chat(sender, instance, **kwargs):
    project = instance.project
    user = instance.user
    
    if project.chat_room:
        project.chat_room.remove_participant(user)
