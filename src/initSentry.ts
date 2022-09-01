import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { config } from './config';

export function initSentry() {
  if (config.sentryDsn && config.sentryDsn !== '') {
    Sentry.init({
      dsn: config.sentryDsn,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      debug: true,
    });
  } else {
    console.warn(
      'SENTRY_DSN is undefined. Sentry is not initialized. Check environments variables',
    );
  }
}
