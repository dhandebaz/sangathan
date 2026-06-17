import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "Sangathan",
  description: "Infrastructure for grassroots organizations",
  applicationName: "Sangathan",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sangathan",
  },
  formatDetection: {
    telephone: false,
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
    <html lang="en" className="h-full">
      <body className="antialiased h-full bg-background">
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
