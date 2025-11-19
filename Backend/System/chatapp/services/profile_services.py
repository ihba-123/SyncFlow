from django.shortcuts import get_object_or_404
from ..models import Profile , User
from django.core.cache import cache

def profile_view(user_id):
  cache_key = f"user_id{user_id}"
  profile = cache.get(cache_key)

  if profile:
    return profile
  
  user = get_object_or_404(User, id=user_id)
  profile, created = Profile.objects.get_or_create(user=user)
  if profile:
    cache.set(cache_key,profile,300)
    return profile
  else:
    return{
      "success":False,
      "message":"Profile does not exist"
    }
                  