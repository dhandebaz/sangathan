import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ['@sentry/nextjs'],
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-select',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:lang/status',
        destination: '/:lang/transparency',
        permanent: true,
      },
      {
        source: '/:lang/governance',
        destination: '/:lang/transparency',
        permanent: true,
      },
      {
        source: '/:lang/roadmap',
        destination: '/:lang/features',
        permanent: true,
      },
    ];
  },
};

const hasSentryAuth = Boolean(process.env.SENTRY_AUTH_TOKEN || process.env.SENTRY_DSN);

export default withSentryConfig(withSerwist(nextConfig), {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: Boolean(process.env.SENTRY_WIDEN_UPLOAD === 'true'),
  tunnelRoute: "/monitoring",
  sourcemaps: {
    disable: !hasSentryAuth,
  },
  disableLogger: true,
});
