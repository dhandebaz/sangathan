import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://sangathan.space'),
  title: {
    template: "%s | Sangathan",
    default: "Sangathan — Civic Digital Infrastructure for Collectives & NGOs",
  },
  description: "Civic digital infrastructure built by Bahujan Queer Foundation (Section 8 Non-Profit) to help NGOs, student unions, workers unions, and civic collectives govern, communicate, and operate with transparency, privacy, and accountability.",
  applicationName: "Sangathan",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sangathan",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    url: 'https://sangathan.space',
    siteName: 'Sangathan',
    title: 'Sangathan — Civic Digital Infrastructure for Collectives & NGOs',
    description: 'The zero-tech, mobile-first operating system for civic collectives, citizen science networks, NGOs, student unions, workers unions, and RWAs.',
    images: [
      {
        url: 'https://sangathan.space/api/og',
        width: 1200,
        height: 630,
        alt: 'Sangathan - Civic Digital Infrastructure',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@areynetaji',
    creator: '@areynetaji',
    title: 'Sangathan — Civic Digital Infrastructure for Collectives & NGOs',
    description: 'The zero-tech, mobile-first operating system for civic collectives, citizen science networks, NGOs, student unions, workers unions, and RWAs.',
    images: ['https://sangathan.space/api/og'],
  },
  icons: {
    icon: [
      {
        url: "/logo/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/logo/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/logo/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`h-full ${outfit.variable}`}>
      <body className="antialiased h-full bg-background font-sans">
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[100] rounded-lg bg-white px-4 py-3 font-semibold text-slate-900 shadow-lg focus:not-sr-only"
        >
          Skip to main content
        </a>
        {children}
        <Toaster 
          position="top-right" 
          richColors 
          toastOptions={{
            style: {
              borderRadius: "0.875rem",
              boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
            },
          }}
        />
      </body>
    </html>
  )
}
