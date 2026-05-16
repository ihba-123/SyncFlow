# SyncFlow - Production-Grade Project Organization

A full-stack team collaboration platform with real-time capabilities, built with Django REST Framework and React.

## 🎯 Project Structure Overview

### Backend - Django REST API with WebSocket Support
```
Backend/
├── config/              # Django configuration (replaces System/System)
├── apps/                # Django applications
├── core/                # Shared utilities & services
├── utils/               # Helper functions
├── tests/               # Test utilities
└── manage.py            # Django management
```

### Frontend - React + Vite SPA
```
Frontend/sync-flow/src/
├── components/          # Reusable UI components
├── features/            # Feature modules
├── services/            # API & WebSocket services
├── stores/              # Zustand state management
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── config/              # App configuration
└── styles/              # Global styles
```

## 🚀 Quick Start

### Backend Setup
```bash
cd Backend
python -m venv venv
source venv/Scripts/activate  # Windows
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd Frontend/sync-flow
npm install
cp .env.example .env
npm run dev
```

## 📁 Directory Organization

### Backend Organization

**config/** - Django Configuration
- `settings/` - Environment-specific settings (base, development, production)
- `urls.py` - Main URL routing
- `asgi.py` - WebSocket support via Channels
- `wsgi.py` - Production HTTP server
- `celery.py` - Async task configuration

**apps/** - Django Applications
- `authentication/` - User auth, JWT, OAuth
- `chatapp/` - Real-time messaging
- `team/` - Team management
- `khanban/` - Kanban boards & tasks
- `search/` - Global search
- `activitylog/` - Activity tracking

**core/** - Shared Services
- `decorators/` - Custom decorators
- `exceptions/` - Custom exceptions
- `middleware/` - Custom middleware
- `permissions/` - DRF permissions

**utils/** - Helpers
- `constants/` - App constants & enums
- `validators/` - Validation utilities

### Frontend Organization

**components/** - UI Components
- `common/` - Reusable UI elements (Button, Input, Card)
- `layout/` - Layout components (Sidebar, Header)
- `ui/` - Feature-specific UI components

**features/** - Feature Modules
- `auth/` - Authentication flows
- `dashboard/` - Dashboard & overview
- `kanban/` - Kanban board
- `chat/` - Messaging
- `team/` - Team management
- `search/` - Search functionality
- `projects/` - Project management

**services/** - External Services
- `api/` - Backend API clients
- `websocket/` - WebSocket connections

**stores/** - State Management (Zustand)
- `auth.store.js` - Auth state
- `app.store.js` - Global state
- `project.store.js` - Project state
- `ui.store.js` - UI state

**hooks/** - Custom React Hooks
- `useAuth.js` - Authentication
- `useProject.js` - Project operations
- `useWebSocket.js` - WebSocket

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
SECRET_KEY=your_key
DEBUG=True
DATABASE=postgresql
REDIS_URL=redis://localhost:6379/0
CLOUDINARY_CLOUD_NAME=...
GOOGLE_CLIENT_ID=...
```

**Frontend (.env)**
```
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_GOOGLE_CLIENT_ID=...
```

### Django Settings Module
```bash
# Development
export DJANGO_SETTINGS_MODULE=config.settings.development

# Production
export DJANGO_SETTINGS_MODULE=config.settings.production
```

## 📊 Key Technologies

### Backend
- **Django 5.0** - Web framework
- **DRF** - REST API
- **Channels** - WebSocket
- **Celery** - Task queue
- **PostgreSQL** - Database
- **Redis** - Cache & broker
- **Cloudinary** - File storage

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Query** - Server state
- **Axios** - HTTP client
- **Channels/WebSocket** - Real-time

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend**
```bash
cd Backend/System
python manage.py migrate
daphne -b 0.0.0.0 -p 8000 config.asgi:application
```

**Terminal 2 - Celery Worker** (optional)
```bash
cd Backend/System
celery -A config worker -l info
```

**Terminal 3 - Frontend**
```bash
cd Frontend/sync-flow
npm run dev
```

Access at: `http://localhost:5173`
API at: `http://localhost:8000`
Docs at: `http://localhost:8000/api/docs/`

### Production Mode
See [Backend/README_NEW.md](Backend/README_NEW.md) and [Frontend/sync-flow/README_NEW.md](Frontend/sync-flow/README_NEW.md)

## 📚 Documentation

- **[Backend README](Backend/README_NEW.md)** - Django setup & deployment
- **[Frontend README](Frontend/sync-flow/README_NEW.md)** - React setup & deployment
- **[Migration Guide](MIGRATION_GUIDE.md)** - How to migrate from old structure
- **[API Documentation](http://localhost:8000/api/docs/)** - Swagger UI (when running)

## 🔄 Project Architecture

### Request Flow (Backend)
```
Request → config/urls.py
        → apps/{app}/views.py
        → apps/{app}/serializers.py
        → apps/{app}/models.py
        → PostgreSQL/Redis
        → Response
```

### State Flow (Frontend)
```
User Action → Component
           → Hook (useAuth, useQuery)
           → Store (Zustand)
           → API Service
           → Backend
           → Response → Store → Component → UI
```

### WebSocket Flow
```
Client (React) ← → config/asgi.py
              ← → apps/{app}/consumers.py
              ← → Redis Channel Layer
```

## ✅ Naming Conventions

### Backend
- **Apps**: lowercase (`authentication`, `chatapp`)
- **Models**: PascalCase (`User`, `Project`)
- **Views**: PascalCase + `View`/`ViewSet` (`UserLoginView`)
- **Serializers**: PascalCase + `Serializer` (`UserSerializer`)
- **URLs**: lowercase with hyphens (`/api/auth/login/`)

### Frontend
- **Components**: PascalCase (`.jsx` files)
- **Hooks**: camelCase with `use` prefix (`.js` files)
- **Stores**: camelCase with `.store.js` suffix
- **Services**: camelCase with `.service.js` or `.api.js` suffix
- **Utils**: camelCase (`.js` files)
- **Routes**: kebab-case in URLs

## 🧪 Testing

### Backend
```bash
cd Backend/System
python manage.py test apps.authentication
python manage.py test --coverage
```

### Frontend
```bash
cd Frontend/sync-flow
npm run test
npm run test:coverage
```

## 🔐 Security

### Backend
- ✅ JWT tokens with refresh
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ SQL injection prevention (ORM)
- ✅ CSRF protection
- ✅ Google OAuth support

### Frontend
- ✅ XSS prevention (React escaping)
- ✅ CSRF token handling
- ✅ Secure token storage (localStorage)
- ✅ API request interceptors
- ✅ Protected routes

## 📈 Performance

- **Caching**: Redis for API responses
- **Pagination**: 20 items per page
- **Lazy Loading**: React.lazy for code splitting
- **Database**: Query optimization with select_related
- **WebSocket**: Efficient message broadcasting

## 🤝 Contributing

1. **Follow structure conventions** - Place files in correct directories
2. **Use consistent naming** - Follow naming conventions above
3. **Write tests** - For new features
4. **Update docs** - Keep README files current
5. **Code review** - Submit pull requests for review

## 🐛 Troubleshooting

**Backend Issues?** → Check [Backend/README_NEW.md](Backend/README_NEW.md#troubleshooting)
**Frontend Issues?** → Check [Frontend/sync-flow/README_NEW.md](Frontend/sync-flow/README_NEW.md#troubleshooting)
**Migration Issues?** → Check [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md#common-issues--solutions)

## 📝 License

Proprietary - SyncFlow Project

## 👥 Team

Project developed for team collaboration and productivity enhancement.

---

**Last Updated**: May 2026
**Version**: 1.0.0 (Production-Grade Structure)
