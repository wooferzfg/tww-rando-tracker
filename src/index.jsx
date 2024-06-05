import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './ui/app';

const hasUpdatePromise = new Promise((resolve) => {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then((registration) => {
      registration.addEventListener('updatefound', () => resolve(true));
    }).catch(() => resolve(false));
  } else {
    resolve(false);
  }
});

createRoot(
  document.getElementById('base'),
).render(<App hasUpdatePromise={hasUpdatePromise} />);
