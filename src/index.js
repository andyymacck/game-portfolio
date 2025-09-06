import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Make sure this isn't overriding your styles
import App from './App';
import { SettingsProvider } from './context/SettingsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </React.StrictMode>
);

// Register service worker for PWA + offline fallback
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
  const swUrl = `${process.env.PUBLIC_URL || ''}/service-worker.js`;
  navigator.serviceWorker.register(swUrl).catch((err) => {
      console.warn('SW registration failed', err);
    });
  });
}