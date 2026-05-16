// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 30000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
};

// WebSocket Configuration
export const SOCKET_CONFIG = {
  URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000',
  RECONNECT_INTERVAL: import.meta.env.VITE_WS_RECONNECT_INTERVAL || 3000,
  MAX_RECONNECT_ATTEMPTS: import.meta.env.VITE_WS_MAX_RECONNECT_ATTEMPTS || 10,
};

// OAuth Configuration
export const OAUTH_CONFIG = {
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
};

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'SyncFlow',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
};
