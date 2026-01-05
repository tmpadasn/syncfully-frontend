/* Entry point: mounts the React app with routing and global styles. */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/global.css';

// The container and render call bootstraps the SPA. We wrap `App` with
// `BrowserRouter` and enable future flags to keep the app forward-compatible
// with upcoming react-router behavior while still running on the current version.
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
