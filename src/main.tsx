import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '~/components/App';
import '~/index.css';
import { AppProvider } from './components/context/AppProvider';
import { NotificationProvider } from './components/context/NotificationProvider';
import { AudioProvider } from './components/context/AudioProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <NotificationProvider>
        <AudioProvider>
          <App />
        </AudioProvider>
      </NotificationProvider>
    </AppProvider>
  </React.StrictMode>
);
