import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './ui/app';

if (process.env.NODE_ENV === 'production') {
  const { serviceWorker } = navigator;

  if (serviceWorker) {
    serviceWorker.register('service-worker.js');
  }
}

createRoot(
  document.getElementById('base'),
).render(<App />);
