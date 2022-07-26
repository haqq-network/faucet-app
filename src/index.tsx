import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AppContainer } from './AppContainer';
import './index.css';
// import { reportWebVitals } from './reportWebVitals';

function startApp() {
  const rootElement = document.getElementById('root') as HTMLElement;
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <AppContainer>
        <App />
      </AppContainer>
    </StrictMode>,
  );
}

// TODO: integrate with sentry;
// initSentry()
startApp();
// reportWebVitals(console.log);
