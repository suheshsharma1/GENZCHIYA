import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProvider } from './context/AppContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'
import App from './App.tsx'

if (typeof window !== 'undefined') {
  const showGlobalError = (message: string) => {
    const existing = document.getElementById('global-app-error');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.id = 'global-app-error';
    el.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:99999;background:#dc2626;color:#fff;padding:12px 18px;border-radius:12px;font:14px/1.4 system-ui;box-shadow:0 10px 30px rgba(0,0,0,0.25);max-width:min(420px,92vw);';
    el.textContent = message;
    document.body.appendChild(el);
  };

  window.addEventListener('error', (event) => {
    console.error('[GlobalError]', event.message, event.filename, event.lineno);
    showGlobalError(event.message || 'An unexpected error occurred.');
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason instanceof Error ? event.reason.message : String(event.reason);
    console.error('[UnhandledRejection]', reason);
    showGlobalError(reason || 'An unexpected error occurred.');
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </ErrorBoundary>
  </StrictMode>,
)
