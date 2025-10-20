import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

const routes = ['/', '/map', '/rooms/search', '/buildings/:id'];
if (typeof window !== 'undefined') {
  try {
    if (typeof window.handleRoutes !== 'function') {
      window.handleRoutes = function(pages) {
        console.log('Routes registered:', pages);
      };
    }
    window.handleRoutes(routes);
  } catch (e) {
    console.error('Failed to call window.handleRoutes', e);
  }
}

reportWebVitals();
