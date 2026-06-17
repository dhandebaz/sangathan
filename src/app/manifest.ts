import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sangathan - Civic Governance Platform',
    short_name: 'Sangathan',
    description: 'A neutral, public-good platform for organizational governance.',
    start_url: '/',
    display: 'standalone',
    display_override: ['standalone', 'fullscreen', 'minimal-ui'],
    background_color: '#f8fafc',
    theme_color: '#ffffff',
    orientation: 'portrait-primary',
    categories: ['productivity', 'business', 'social'],
    scope: '/',
    prefer_related_applications: false,
    icons: [
      {
        src: '/logo/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/logo/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [],
    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Home',
        description: 'Go to your dashboard',
        url: '/',
        icons: [{ src: '/logo/android-chrome-192x192.png', sizes: '192x192' }],
      },
    ],
  }
}
