import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sangathan — Civic Infrastructure Platform',
    short_name: 'Sangathan',
    description: 'Civic digital infrastructure built by Bahujan Queer Foundation (Section 8 Non-Profit) to help NGOs and civic collectives govern and organize with transparency, privacy, and accountability.',
    start_url: '/',
    display: 'standalone',
    display_override: ['standalone', 'fullscreen', 'minimal-ui'],
    background_color: '#f8fafc',
    theme_color: '#ffffff',
    orientation: 'portrait-primary',
    categories: ['productivity', 'social', 'government'],
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
        name: 'Dashboard (डैशबोर्ड)',
        short_name: 'Home',
        description: 'Go to your civic workspace dashboard',
        url: '/',
        icons: [{ src: '/logo/android-chrome-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Members (सदस्य)',
        short_name: 'Members',
        description: 'View and manage members roster',
        url: '/en/dashboard/members',
        icons: [{ src: '/logo/android-chrome-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Events & Assemblies (सभाएं)',
        short_name: 'Events',
        description: 'View upcoming assemblies and meetings',
        url: '/en/dashboard/events',
        icons: [{ src: '/logo/android-chrome-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Donations & Chanda (चंदा)',
        short_name: 'Chanda',
        description: 'Log and track community chanda and contributions',
        url: '/en/dashboard/donations',
        icons: [{ src: '/logo/android-chrome-192x192.png', sizes: '192x192' }],
      },
    ],
  }
}
