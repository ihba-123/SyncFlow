"""
URL Configuration for SyncFlow project.
"""
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Endpoints
    path('api/', include('apps.authentication.urls')),
    path('api/', include('apps.chatapp.urls')),
    path('api/', include('apps.team.urls')),
    path('api/', include('apps.khanban.urls')),
    path('api/', include('apps.search.urls')),
    path('api/', include('apps.activitylog.urls')),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
