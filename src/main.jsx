import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import { SiteConfigProvider } from './SiteConfigContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SiteConfigProvider>
      <App />
    </SiteConfigProvider>
  </React.StrictMode>
);
