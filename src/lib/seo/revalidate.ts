import { revalidatePath } from 'next/cache'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://sangathan.space'
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'sangathan_seo_indexnow_2026'

/**
 * Notifies search engines (Bing, Yandex, Seznam, Naver & IndexNow participants)
 * that public URLs have changed so they re-crawl immediately.
 */
export async function notifySearchEngines(urls: string[]) {
  if (!urls || urls.length === 0) return

  const cleanUrls = urls.map((u) => (u.startsWith('http') ? u : `${BASE_URL}${u.startsWith('/') ? '' : '/'}${u}`))
  const host = new URL(BASE_URL).host

  try {
    const payload = {
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/indexnow-key.txt`,
      urlList: cleanUrls,
    }

    // Non-blocking fire-and-forget submission to IndexNow API
    fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.warn('IndexNow notification network error (non-fatal):', err)
    })
  } catch (error) {
    console.warn('Error constructing IndexNow notification:', error)
  }
}

/**
 * Instant On-Demand Revalidation for Organisation Profile & Public Records
 */
export async function revalidatePublicOrgPages(slug: string) {
  if (!slug) return

  try {
    // 1. Purge Next.js On-Demand ISR Cache
    revalidatePath(`/[lang]/(site)/org/[slug]`, 'page')
    revalidatePath(`/en/org/${slug}`)
    revalidatePath(`/hi/org/${slug}`)
    revalidatePath(`/api/og/org/${slug}`)
    revalidatePath(`/sitemap.xml`)

    // 2. Notify Search Engine Web Crawlers via IndexNow
    await notifySearchEngines([
      `/en/org/${slug}`,
      `/hi/org/${slug}`,
      `/sitemap.xml`,
    ])
  } catch (error) {
    console.warn(`Error during org page revalidation for ${slug}:`, error)
  }
}

/**
 * Instant On-Demand Revalidation for Organisation Events
 */
export async function revalidatePublicEventPages(orgSlug: string, eventId: string) {
  if (!orgSlug || !eventId) return

  try {
    revalidatePath(`/[lang]/(site)/org/[slug]/events/[eventId]`, 'page')
    revalidatePath(`/en/org/${orgSlug}/events/${eventId}`)
    revalidatePath(`/hi/org/${orgSlug}/events/${eventId}`)
    revalidatePath(`/en/org/${orgSlug}`)
    revalidatePath(`/hi/org/${orgSlug}`)
    revalidatePath(`/sitemap.xml`)

    await notifySearchEngines([
      `/en/org/${orgSlug}/events/${eventId}`,
      `/hi/org/${orgSlug}/events/${eventId}`,
      `/sitemap.xml`,
    ])
  } catch (error) {
    console.warn(`Error during event page revalidation for ${eventId}:`, error)
  }
}

/**
 * Instant On-Demand Revalidation for Coalitions & Joint Fronts
 */
export async function revalidatePublicNetworkPages(networkSlug: string) {
  if (!networkSlug) return

  try {
    revalidatePath(`/[lang]/(site)/network/[slug]`, 'page')
    revalidatePath(`/en/network/${networkSlug}`)
    revalidatePath(`/hi/network/${networkSlug}`)
    revalidatePath(`/en/network`)
    revalidatePath(`/hi/network`)
    revalidatePath(`/sitemap.xml`)

    await notifySearchEngines([
      `/en/network/${networkSlug}`,
      `/hi/network/${networkSlug}`,
      `/en/network`,
      `/hi/network`,
      `/sitemap.xml`,
    ])
  } catch (error) {
    console.warn(`Error during network page revalidation for ${networkSlug}:`, error)
  }
}

/**
 * Instant Revalidation for Global Site & Marketing Pages
 */
export async function revalidatePublicSitePages(path: string) {
  try {
    revalidatePath(path)
    revalidatePath(`/en${path}`)
    revalidatePath(`/hi${path}`)
    revalidatePath(`/sitemap.xml`)

    await notifySearchEngines([
      `/en${path}`,
      `/hi${path}`,
      `/sitemap.xml`,
    ])
  } catch (error) {
    console.warn(`Error during site page revalidation for ${path}:`, error)
  }
}
