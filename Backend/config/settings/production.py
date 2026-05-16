"""
Production settings for SyncFlow project.
Use only in production deployments.
"""
from .base import *  # noqa
import os

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost').split(',')

# Production security settings
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Restricted CORS for production
CORS_ALLOWED_ORIGINS = [
    os.getenv('FRONTEND_URL', 'https://example.com'),
]

# Logging - less verbose in production
LOGGING['root']['level'] = 'WARNING'
