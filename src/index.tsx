import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AppContainer } from './AppContainer';
import './index.css';

if (process.env.NODE_ENV === 'production') {
  import('./initSentry').then(({ initSentry }) => {
    initSentry();
  });
}

function startApp() {
  const rootElement = document.getElementById('root');
  const root = createRoot(rootElement as HTMLElement);

  root.render(
    <StrictMode>
      <AppContainer>
        <App />
      </AppContainer>
    </StrictMode>,
  );
}

document.addEventListener('DOMContentLoaded', () => {
  startApp();
});
