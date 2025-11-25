import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Performance optimizations
import { registerServiceWorker, addResourceHints } from './utils/performance';

// Add resource hints for faster loading (only in production)
if (import.meta.env.PROD) {
  addResourceHints();
  // Register service worker for caching
  registerServiceWorker();
}

// Mark as loaded to prevent FOUC
document.documentElement.classList.add('loaded');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
