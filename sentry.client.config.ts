import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  enabled: !!SENTRY_DSN && process.env.NODE_ENV !== 'test',
  environment: process.env.NODE_ENV || 'development',
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || process.env.npm_package_version || '1.40.0',

  // Sample 20% in production, 100% in development for full diagnostics
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,

  // Replay settings for client error diagnostics
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.05 : 0,

  // Sanitize sensitive credentials and tokens before transmitting to Sentry
  beforeSend(event) {
    if (event.request?.headers) {
      delete event.request.headers['authorization'];
      delete event.request.headers['cookie'];
      delete event.request.headers['x-cron-secret'];
    }
    return event;
  },

  debug: false,
});
