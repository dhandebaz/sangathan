import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sangathan.space'

  const privateDisallows = [
    '/dashboard/',
    '/admin/',
    '/api/',
    '/auth/',
    '/bootstrap-org/',
    '/maintenance/',
    '/select-organisation/',
    '/f/',
    '/invite/',
    '/members/',
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: privateDisallows,
      },
      {
        // Explicitly allow AI search & answer engines with access to llms.txt
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'PerplexityBot',
          'OAI-SearchBot',
          'cohere-ai',
          'Bytespider',
          'Google-Extended',
          'Diffbot',
          'FacebookBot',
        ],
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: privateDisallows,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
