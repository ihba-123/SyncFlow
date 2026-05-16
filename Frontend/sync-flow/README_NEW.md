# Frontend Project Structure

## Overview
SyncFlow Frontend is a React 19 application built with Vite, featuring real-time collaboration tools with WebSocket support, state management with Zustand, and a modern UI using Tailwind CSS and Radix UI.

## Directory Structure

```
Frontend/sync-flow/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── common/              # Generic UI components (Button, Input, etc.)
│   │   ├── layout/              # Layout components (Sidebar, Header, etc.)
│   │   └── ui/                  # Pre-existing UI components
│   │
│   ├── features/                # Feature modules (domain-based)
│   │   ├── auth/                # Authentication flows
│   │   ├── dashboard/           # Dashboard & overview
│   │   ├── kanban/              # Kanban board features
│   │   ├── chat/                # Chat/messaging features
│   │   ├── team/                # Team management features
│   │   ├── search/              # Search functionality
│   │   └── projects/            # Project management
│   │
│   ├── pages/                   # Page components (route containers)
│   ├── routes/                  # Route definitions & protected routes
│   ├── services/                # API & external services
│   │   ├── api/                 # API client & endpoints
│   │   ├── websocket/           # WebSocket connections
│   │   └── auth.service.js      # Authentication service
│   │
│   ├── stores/                  # Zustand state management
│   │   ├── auth.store.js        # Authentication state
│   │   ├── app.store.js         # Global app state
│   │   ├── project.store.js     # Project state
│   │   └── ui.store.js          # UI state (modals, etc.)
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.js           # Authentication hook
│   │   ├── useProject.js        # Project hook
│   │   ├── useWebSocket.js      # WebSocket hook
│   │   └── ...
│   │
│   ├── utils/                   # Utility functions
│   │   ├── constants/           # App constants & enums
│   │   ├── helpers/             # Helper functions
│   │   ├── validators.js        # Input validation
│   │   ├── formatters.js        # Data formatting
│   │   └── request.js           # HTTP request utilities
│   │
│   ├── styles/                  # Global styles
│   │   ├── globals.css          # Global CSS
│   │   ├── tailwind.css         # Tailwind directives
│   │   └── animations.css       # Custom animations
│   │
│   ├── config/                  # Application configuration
│   │   ├── api.config.js        # API configuration
│   │   ├── socket.config.js     # WebSocket configuration
│   │   └── constants.js         # App-wide constants
│   │
│   ├── assets/                  # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Root CSS
│
├── public/                      # Public static assets
├── .env.example                 # Environment variables template
├── .env                         # Environment variables (gitignored)
├── .env.production              # Production environment
├── .env.development             # Development environment
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── eslint.config.js             # ESLint configuration
├── README.md                    # This file
└── README_OLD.md                # Original README (backup)
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Development Server
```bash
npm run dev
```

Access at: http://localhost:5173

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

## Configuration

### Environment Variables
Create `.env` file with:
```
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Vite Configuration
- **Dev Server Port**: 5173
- **Build Output**: dist/
- **Base URL**: /

## Key Libraries

### UI & Styling
- **React**: ^19.2.0
- **Tailwind CSS**: ^4.1.17
- **Radix UI**: Components library
- **Framer Motion**: Animations
- **Lucide React**: Icons

### State Management
- **Zustand**: ^5.0.9
- **TanStack React Query**: ^5.90.12 (Server state)

### Utilities
- **Axios**: HTTP client
- **React Router DOM**: ^7.10.1
- **Day.js**: Date/time
- **JWT Decode**: JWT token parsing
- **Lodash**: Utility functions

### Real-time
- **WebSocket**: Native browser API
- **React Toastify**: Notifications

## Development Workflow

### Creating a New Feature

1. **Create feature folder** in `src/features/`
   ```
   src/features/my-feature/
   ├── components/
   ├── hooks/
   ├── services/
   ├── stores/
   ├── types/
   └── index.js
   ```

2. **API Service** (`src/services/api/my-feature.api.js`)
   ```javascript
   import apiClient from './client';
   
   export const fetchMyData = () =>
     apiClient.get('/api/my-endpoint/');
   ```

3. **Zustand Store** (`src/stores/my-feature.store.js`)
   ```javascript
   import create from 'zustand';
   
   export const useMyFeatureStore = create((set) => ({
     data: null,
     setData: (data) => set({ data }),
   }));
   ```

4. **Custom Hook** (`src/hooks/useMyFeature.js`)
   ```javascript
   import { useQuery } from '@tanstack/react-query';
   import { fetchMyData } from '@/services/api/my-feature.api';
   
   export const useMyFeature = () => {
     return useQuery({
       queryKey: ['my-feature'],
       queryFn: fetchMyData,
     });
   };
   ```

### Code Organization Rules

- **Components**: Always functional, use hooks
- **Services**: Pure functions, no state
- **Stores**: Zustand for client state only
- **Hooks**: Custom hooks for component logic
- **Utils**: Pure functions, no side effects
- **Types**: Use JSDoc or TypeScript interfaces

## Styling Guidelines

### Tailwind CSS
```jsx
// Good
<div className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg shadow">

// Avoid inline complex styles
```

### Custom CSS
```css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700;
  }
}
```

## API Integration

### API Client Setup
```javascript
// src/services/api/client.js
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
```

## WebSocket Integration

```javascript
// src/services/websocket/socket.js
export const connectSocket = (url) => {
  const socket = new WebSocket(url);
  
  socket.onopen = () => console.log('Connected');
  socket.onmessage = (event) => {
    // Handle message
  };
  
  return socket;
};
```

## Testing

```bash
# Run tests (when configured)
npm run test

# Run tests with coverage
npm run test:coverage
```

## Linting & Formatting

```bash
# Run ESLint
npm run lint

# Format with Prettier
npm run format
```

## Performance Optimization

- Use React.memo for expensive components
- Implement code splitting with React.lazy
- Use TanStack Query for server state caching
- Optimize images and assets
- Monitor bundle size

## Debugging

### React DevTools
Install React DevTools browser extension

### Vite Debug Mode
```bash
npm run dev -- --debug
```

### API Debugging
Check network tab in browser DevTools for API requests

## Deployment

### Build Optimization
```bash
npm run build
# Outputs to dist/

# Preview production build locally
npm run preview
```

### Environment for Production
Create `.env.production`:
```
VITE_API_BASE_URL=https://api.example.com
VITE_WS_URL=wss://api.example.com
```

### Deployment Options
- **Vercel**: `npm run build` then deploy dist/
- **Netlify**: Connect GitHub, auto-deploys on push
- **GitHub Pages**: Configure vite config for base path
- **Docker**: See Dockerfile

## Troubleshooting

### Hot Module Replacement (HMR) Not Working
```javascript
// vite.config.js
export default {
  server: {
    hmr: {
      host: 'localhost',
      port: 5173,
    },
  },
};
```

### CORS Errors
- Ensure backend has correct CORS_ALLOWED_ORIGINS
- Check API base URL in `.env`

### WebSocket Connection Failed
- Verify WebSocket URL in `.env`
- Check backend is running with Daphne
- Review browser console for connection errors

### State Not Updating
- Verify Zustand store is properly subscribed
- Check useShallow for nested object comparison
- Debug with React DevTools

## Project Structure Guidelines

### Import Paths
Use path aliases in `vite.config.js`:
```javascript
import react from '@vitejs/plugin-react';
import path from 'path';

export default {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};
```

Import like:
```javascript
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
```

### Naming Conventions
- **Components**: PascalCase (`Button.jsx`, `LoginForm.jsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.js`)
- **Utilities**: camelCase (`formatters.js`, `validators.js`)
- **Stores**: camelCase with `.store.js` suffix (`auth.store.js`)
- **Services**: camelCase with `.service.js` or `.api.js` suffix

## Contributing

1. Follow file structure conventions
2. Create feature branches
3. Write clean, commented code
4. Test before submitting PR
5. Update documentation

## License

Proprietary - SyncFlow Project
