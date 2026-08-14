import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  enabled: !!SENTRY_DSN && process.env.NODE_ENV !== 'test',
  environment: process.env.NODE_ENV || 'development',
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || process.env.npm_package_version || '1.40.0',

  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,

  debug: false,
});
