import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { HashRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </HelmetProvider>
  </React.StrictMode>
);