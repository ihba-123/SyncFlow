import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider , QueryClient } from '@tanstack/react-query'
import 'react-toastify/dist/ReactToastify.css';
import { StrictMode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Global: No auto-retry on failures
    },
  },
});
createRoot(document.getElementById('root')).render(
    <StrictMode>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </QueryClientProvider>
    </StrictMode>

)
