import { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/service'
import { SOLUTIONS_DATA } from '@/lib/solutions-data'
import { COMPARISONS_DATA } from '@/lib/comparisons-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sangathan.space'
  const staticRoutes = [
    '',
    '/docs',
    '/features',
    '/pricing',
    '/about',
    '/transparency',
    '/changelog',
    '/press',
    '/vision',
    '/faq',
    '/network',
    '/solutions',
    '/compare',
    '/privacy',
    '/terms',
    '/data-rights',
    '/cookies',
    '/acceptable-use-policy',
    '/refund-policy',
    '/contact',
    '/brand',
    '/community-guidelines',
    '/data-practices',
    '/governance/platform-charter',
    '/admin-accountability',
    '/community-management',
    '/ngo-management',
    '/organization-management',
    '/grassroots-organizing',
    '/campaign-management',
    '/member-management',
    '/collective-decision-making',
    '/sangathan-vs-whatsapp',
    '/sangathan-vs-nationbuilder',
    '/sangathan-vs-action-network',
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  // 1. Static Pages for EN and HI
  for (const route of staticRoutes) {
    const isHome = route === ''
    const enUrl = isHome ? `${baseUrl}/en` : `${baseUrl}/en${route}`
    const hiUrl = isHome ? `${baseUrl}/hi` : `${baseUrl}/hi${route}`
    const priority = isHome ? 1.0 : route === '/pricing' || route === '/features' || route === '/solutions' || route === '/compare' ? 0.9 : 0.7
    const changeFreq = isHome ? 'daily' : route === '/pricing' || route === '/changelog' ? 'weekly' : 'monthly'

    sitemapEntries.push({
      url: enUrl,
      lastModified: new Date(),
      changeFrequency: changeFreq,
      priority: priority,
      alternates: {
        languages: {
          en: enUrl,
          hi: hiUrl,
        },
      },
    })

    sitemapEntries.push({
      url: hiUrl,
      lastModified: new Date(),
      changeFrequency: changeFreq,
      priority: priority,
      alternates: {
        languages: {
          en: enUrl,
          hi: hiUrl,
        },
      },
    })
  }

  // 2. Programmatic Solutions (5 Org Types + 20 Focus Blueprints)
  for (const [typeKey, orgType] of Object.entries(SOLUTIONS_DATA)) {
    // Org Type Solution Pages
    sitemapEntries.push({
      url: `${baseUrl}/en/solutions/${typeKey}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/en/solutions/${typeKey}`,
          hi: `${baseUrl}/hi/solutions/${typeKey}`,
        },
      },
    })
    sitemapEntries.push({
      url: `${baseUrl}/hi/solutions/${typeKey}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/en/solutions/${typeKey}`,
          hi: `${baseUrl}/hi/solutions/${typeKey}`,
        },
      },
    })

    // Subtypes / Focus Blueprints
    for (const subtype of orgType.subtypes) {
      sitemapEntries.push({
        url: `${baseUrl}/en/solutions/${typeKey}/${subtype.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: {
          languages: {
            en: `${baseUrl}/en/solutions/${typeKey}/${subtype.slug}`,
            hi: `${baseUrl}/hi/solutions/${typeKey}/${subtype.slug}`,
          },
        },
      })
      sitemapEntries.push({
        url: `${baseUrl}/hi/solutions/${typeKey}/${subtype.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
        alternates: {
          languages: {
            en: `${baseUrl}/en/solutions/${typeKey}/${subtype.slug}`,
            hi: `${baseUrl}/hi/solutions/${typeKey}/${subtype.slug}`,
          },
        },
      })
    }
  }

  // 3. Standalone Competitor Comparisons (7 Comparisons)
  for (const comp of Object.values(COMPARISONS_DATA)) {
    sitemapEntries.push({
      url: `${baseUrl}/en/compare/${comp.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: {
        languages: {
          en: `${baseUrl}/en/compare/${comp.slug}`,
          hi: `${baseUrl}/hi/compare/${comp.slug}`,
        },
      },
    })
    sitemapEntries.push({
      url: `${baseUrl}/hi/compare/${comp.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: {
        languages: {
          en: `${baseUrl}/en/compare/${comp.slug}`,
          hi: `${baseUrl}/hi/compare/${comp.slug}`,
        },
      },
    })
  }

  // 4. Dynamic Organisations Public Pages
  try {
    const supabase = createServiceClient()
    const { data: organisations } = await supabase
      .from('organisations')
      .select('slug, created_at')
      .not('slug', 'is', null)
      .limit(1000)

    if (organisations) {
      for (const org of organisations) {
        if (!org.slug) continue
        const lastMod = org.created_at ? new Date(org.created_at) : new Date()

        sitemapEntries.push({
          url: `${baseUrl}/en/org/${org.slug}`,
          lastModified: lastMod,
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: {
            languages: {
              en: `${baseUrl}/en/org/${org.slug}`,
              hi: `${baseUrl}/hi/org/${org.slug}`,
            },
          },
        })

        sitemapEntries.push({
          url: `${baseUrl}/hi/org/${org.slug}`,
          lastModified: lastMod,
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: {
            languages: {
              en: `${baseUrl}/en/org/${org.slug}`,
              hi: `${baseUrl}/hi/org/${org.slug}`,
            },
          },
        })
      }
    }

    // 5. Dynamic Public Events
    const { data: events } = await supabase
      .from('events')
      .select('id, start_time, created_at, organisation:organisations(slug)')
      .gte('start_time', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .limit(500)

    if (events) {
      for (const event of events) {
        const orgSlug = (event.organisation as unknown as { slug?: string } | null)?.slug
        if (!orgSlug) continue

        const lastMod = event.created_at ? new Date(event.created_at) : new Date()
        sitemapEntries.push({
          url: `${baseUrl}/en/org/${orgSlug}/events/${event.id}`,
          lastModified: lastMod,
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: {
            languages: {
              en: `${baseUrl}/en/org/${orgSlug}/events/${event.id}`,
              hi: `${baseUrl}/hi/org/${orgSlug}/events/${event.id}`,
            },
          },
        })

        sitemapEntries.push({
          url: `${baseUrl}/hi/org/${orgSlug}/events/${event.id}`,
          lastModified: lastMod,
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: {
            languages: {
              en: `${baseUrl}/en/org/${orgSlug}/events/${event.id}`,
              hi: `${baseUrl}/hi/org/${orgSlug}/events/${event.id}`,
            },
          },
        })
      }
    }

    // 6. Dynamic Public Networks / Federations
    const { data: networks } = await supabase
      .from('networks')
      .select('slug, created_at')
      .eq('visibility', 'public')
      .limit(200)

    if (networks) {
      for (const net of networks) {
        if (!net.slug) continue
        const lastMod = net.created_at ? new Date(net.created_at) : new Date()

        sitemapEntries.push({
          url: `${baseUrl}/en/network/${net.slug}`,
          lastModified: lastMod,
          changeFrequency: 'weekly',
          priority: 0.75,
          alternates: {
            languages: {
              en: `${baseUrl}/en/network/${net.slug}`,
              hi: `${baseUrl}/hi/network/${net.slug}`,
            },
          },
        })

        sitemapEntries.push({
          url: `${baseUrl}/hi/network/${net.slug}`,
          lastModified: lastMod,
          changeFrequency: 'weekly',
          priority: 0.75,
          alternates: {
            languages: {
              en: `${baseUrl}/en/network/${net.slug}`,
              hi: `${baseUrl}/hi/network/${net.slug}`,
            },
          },
        })
      }
    }
  } catch (err) {
    console.error('Error generating dynamic sitemap items:', err)
  }

  return sitemapEntries
}
