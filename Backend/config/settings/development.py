"""
Development settings for SyncFlow project.
Use for local development only.
"""
from .base import *  # noqa

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '*.localhost']

# Development-specific app additions
INSTALLED_APPS += [
    'django_extensions',
]

# Less strict security for development
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False
SECURE_SSL_REDIRECT = False

# Allow all CORS for development
CORS_ALLOW_ALL_ORIGINS = True

# Logging - more verbose in development
LOGGING['root']['level'] = 'DEBUG'
