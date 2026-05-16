# Backend Project Structure

## Overview
SyncFlow Backend is a Django REST API with WebSocket support using Channels, Redis caching, and Celery task queuing.

## Directory Structure

```
Backend/
├── config/                      # Django configuration
│   ├── settings/
│   │   ├── base.py             # Base settings (shared)
│   │   ├── development.py       # Development overrides
│   │   └── production.py        # Production overrides
│   ├── asgi.py                 # ASGI app (WebSocket support)
│   ├── wsgi.py                 # WSGI app (production)
│   ├── celery.py               # Celery configuration
│   └── urls.py                 # Main URL routing
│
├── apps/                        # Django applications
│   ├── authentication/          # User auth & JWT tokens
│   ├── chatapp/                # Real-time chat with WebSocket
│   ├── team/                   # Team management
│   ├── khanban/                # Kanban boards & tasks
│   ├── search/                 # Global search functionality
│   └── activitylog/            # Activity logging
│
├── core/                        # Shared utilities & services
│   ├── decorators/             # Custom decorators
│   ├── exceptions/             # Custom exceptions
│   ├── middleware/             # Custom middleware
│   └── permissions/            # DRF permission classes
│
├── utils/                       # Helper functions
│   ├── constants/              # Constants & enums
│   └── validators/             # Validation utilities
│
├── tests/                       # Shared test utilities
├── venv/                        # Virtual environment (gitignored)
├── manage.py                    # Django management commands
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## Setup Instructions

### 1. Create Virtual Environment
```bash
python -m venv venv
source venv/Scripts/activate  # Windows
source venv/bin/activate      # Mac/Linux
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Database Setup
```bash
python manage.py migrate
python manage.py createsuperuser
```

### 5. Run Development Server
```bash
python manage.py runserver
```

For WebSocket support (Channels):
```bash
daphne -b 0.0.0.0 -p 8000 config.asgi:application
```

## Configuration

### Environment Settings
Settings are managed through environment profiles:
- **Development**: `config.settings.development`
- **Production**: `config.settings.production`

Set `DJANGO_SETTINGS_MODULE` environment variable to choose:
```bash
export DJANGO_SETTINGS_MODULE=config.settings.development
```

### Key Configuration Files
- **Base Settings**: `config/settings/base.py`
- **URLs**: `config/urls.py`
- **ASGI**: `config/asgi.py` (WebSocket)
- **WSGI**: `config/wsgi.py` (production HTTP)
- **Celery**: `config/celery.py` (async tasks)

## Apps Overview

### authentication
- User registration & login
- JWT token management
- Google OAuth integration
- Permission classes

### chatapp
- Real-time messaging
- WebSocket connections
- Chat room management
- Message history

### team
- Team creation & management
- Member management
- Team permissions
- Workspace management

### khanban
- Kanban boards
- Task management
- Status transitions
- Task assignments

### search
- Global search across projects
- Full-text search (if using PostgreSQL)
- Search indexing

### activitylog
- Activity tracking
- Event logging
- Audit trail

## Key Technologies

- **Django 5.0**: Web framework
- **Django REST Framework**: API layer
- **Channels**: WebSocket support
- **Celery**: Async task queue
- **Redis**: Caching & message broker
- **PostgreSQL**: Primary database
- **Cloudinary**: File storage

## Running Tests

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test apps.authentication

# With coverage
coverage run --source='.' manage.py test
coverage report
```

## Celery Tasks

Start worker:
```bash
celery -A config worker -l info
```

Monitor tasks:
```bash
celery -A config events
```

## API Documentation

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

## Deployment

### Production Checklist
- [ ] Set `DEBUG = False` in production settings
- [ ] Update `ALLOWED_HOSTS`
- [ ] Configure HTTPS/SSL
- [ ] Set secure cookie flags
- [ ] Configure proper CORS origins
- [ ] Use environment variables for secrets
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure email backend
- [ ] Set up scheduled backups

### Using Gunicorn
```bash
pip install gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### Docker Deployment
See `Dockerfile` for containerization.

## Troubleshooting

### WebSocket Connection Issues
- Ensure Daphne is running (not Django dev server)
- Check Redis is running: `redis-cli ping`
- Verify CORS_ALLOWED_ORIGINS includes frontend URL

### Database Connection Error
- Verify PostgreSQL is running
- Check `.env` database credentials
- Run migrations: `python manage.py migrate`

### Celery Tasks Not Running
- Start Celery worker: `celery -A config worker -l info`
- Check Redis connection
- Verify task is properly defined with `@shared_task` or `@app.task`

## Development Workflow

1. Create feature branch
2. Make changes
3. Run tests: `python manage.py test`
4. Check migrations: `python manage.py makemigrations --dry-run`
5. Run linter: `flake8 apps/`
6. Submit PR

## Contributing

Follow Django best practices:
- Use consistent naming conventions
- Write docstrings for modules, classes, and functions
- Keep functions focused (single responsibility)
- Use type hints where applicable
- Write tests for new features
- Update API documentation

## License

Proprietary - SyncFlow Project
