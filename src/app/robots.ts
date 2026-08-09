import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sangathan.space'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/admin/',
          '/api/',
          '/auth/',
          '/bootstrap-org/',
          '/maintenance/',
          '/select-organisation/',
        ],
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Applebot',
          'DuckDuckBot',
          'YandexBot',
        ],
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/api/', '/auth/'],
      },
      {
        // Explicitly allow AI search & answer engines to cite public civic directory & records
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'PerplexityBot',
          'OAI-SearchBot',
          'cohere-ai',
          'Bytespider',
        ],
        allow: ['/', '/en/org/', '/hi/org/', '/en/network/', '/hi/network/', '/en/features', '/hi/features', '/en/pricing', '/hi/pricing', '/en/about', '/hi/about', '/en/transparency', '/hi/transparency', '/en/docs', '/hi/docs', '/llms.txt'],
        disallow: ['/dashboard/', '/admin/', '/api/', '/auth/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
