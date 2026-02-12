import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sangathan.app'

  return [
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          hi: `${baseUrl}/hi`,
        },
      },
    },
    {
      url: `${baseUrl}/hi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          hi: `${baseUrl}/hi`,
        },
      },
    },
    {
        url: `${baseUrl}/en/docs`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en/docs`,
            hi: `${baseUrl}/hi/docs`,
          },
        },
    },
    {
        url: `${baseUrl}/hi/docs`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en/docs`,
            hi: `${baseUrl}/hi/docs`,
          },
        },
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]
}
