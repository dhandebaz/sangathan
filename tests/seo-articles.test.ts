import { describe, expect, it } from 'vitest'
import {
  ALL_GUIDE_ARTICLES,
  countArticleWords,
  getGuideArticle,
  getRelatedGuides,
  guideReadingMinutes,
} from '@/lib/seo-articles'

const BANNED_PHRASES = [
  '501c3',
  '501(c)(3)',
  'instant 80g',
  'automatic 80g',
  'guaranteed approval',
  'guaranteed registration',
  'guaranteed funding',
  '15-day rti',
  '15-day reply',
  'lyngdoh',
  'delve',
  'game-changer',
  'supercharge',
  'fast-paced world',
  'look no further',
  'tapestry',
]

const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/u

function collectText(article: (typeof ALL_GUIDE_ARTICLES)[number]): string[] {
  const parts: string[] = [
    article.title,
    article.description,
    ...article.keywords,
    ...article.keyTakeaways,
    ...article.faqs.flatMap((f) => [f.q, f.a]),
    ...(article.productTieIn ? [article.productTieIn] : []),
  ]
  for (const block of article.blocks) {
    if (block.type === 'table') {
      parts.push(block.title || '', ...block.headers, ...block.rows.flat())
    } else if (block.type === 'figure') {
      const fig = block.figure
      if (fig.title) parts.push(fig.title)
      if (block.caption) parts.push(block.caption)
      if (fig.type === 'steps') parts.push(...fig.steps)
      else if (fig.type === 'checklist') parts.push(...fig.items)
      else if (fig.type === 'stats') parts.push(...fig.stats.flatMap((s) => [s.value, s.label]))
      else if (fig.type === 'dos-donts') parts.push(...fig.dos, ...fig.donts)
      else parts.push(...fig.entries.flatMap((e) => [e.label, e.text]))
    } else if (block.type === 'list' || block.type === 'numbered') {
      parts.push(...block.items)
    } else if (block.type === 'quote') {
      parts.push(block.text, block.cite || '')
    } else {
      parts.push(block.text)
    }
  }
  return parts
}

describe('SEO guides library', () => {
  it('ships 50+ articles', () => {
    expect(ALL_GUIDE_ARTICLES.length).toBeGreaterThanOrEqual(52)
  })

  it('has unique kebab-case slugs', () => {
    const slugs = ALL_GUIDE_ARTICLES.map((a) => a.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      expect(slug.length).toBeGreaterThanOrEqual(10)
      expect(slug.length).toBeLessThanOrEqual(70)
    }
  })

  it('keeps titles and descriptions within SEO lengths', () => {
    for (const article of ALL_GUIDE_ARTICLES) {
      expect(article.title.length, article.slug).toBeGreaterThanOrEqual(30)
      expect(article.title.length, article.slug).toBeLessThanOrEqual(70)
      expect(article.description.length, article.slug).toBeGreaterThanOrEqual(120)
      expect(article.description.length, article.slug).toBeLessThanOrEqual(170)
      expect(article.keywords.length, article.slug).toBeGreaterThanOrEqual(4)
      expect(article.keywords.length, article.slug).toBeLessThanOrEqual(8)
    }
  })

  it('has substance: takeaways, blocks, figures, FAQs', () => {
    for (const article of ALL_GUIDE_ARTICLES) {
      expect(article.keyTakeaways.length, article.slug).toBeGreaterThanOrEqual(3)
      expect(article.keyTakeaways.length, article.slug).toBeLessThanOrEqual(5)
      expect(article.blocks.length, article.slug).toBeGreaterThanOrEqual(7)
      expect(article.blocks[0].type, article.slug).toBe('p')
      const h2Count = article.blocks.filter((b) => b.type === 'h2').length
      expect(h2Count, article.slug).toBeGreaterThanOrEqual(2)
      const figureCount = article.blocks.filter((b) => b.type === 'figure').length
      expect(figureCount, article.slug).toBeGreaterThanOrEqual(1)
      expect(article.faqs.length, article.slug).toBeGreaterThanOrEqual(4)
      expect(article.faqs.length, article.slug).toBeLessThanOrEqual(6)
      for (const faq of article.faqs) {
        const words = faq.a.trim().split(/\s+/).length
        expect(words, `${article.slug}: ${faq.q}`).toBeGreaterThanOrEqual(30)
        expect(words, `${article.slug}: ${faq.q}`).toBeLessThanOrEqual(130)
      }
      expect(countArticleWords(article), article.slug).toBeGreaterThanOrEqual(600)
    }
  })

  it('tables are well-formed', () => {
    for (const article of ALL_GUIDE_ARTICLES) {
      for (const block of article.blocks) {
        if (block.type === 'table') {
          expect(block.headers.length).toBeGreaterThanOrEqual(2)
          expect(block.rows.length).toBeGreaterThanOrEqual(2)
          for (const row of block.rows) {
            expect(row.length, `${article.slug} table`).toBe(block.headers.length)
          }
        }
      }
    }
  })

  it('contains no banned phrases, AI clichés or emojis', () => {
    for (const article of ALL_GUIDE_ARTICLES) {
      const texts = collectText(article)
      for (const text of texts) {
        const lower = text.toLowerCase()
        for (const banned of BANNED_PHRASES) {
          expect(lower.includes(banned), `${article.slug} contains "${banned}"`).toBe(false)
        }
        expect(EMOJI_RE.test(text), `${article.slug} contains emoji`).toBe(false)
      }
    }
  })

  it('resolves lookups, related guides and reading time', () => {
    const first = ALL_GUIDE_ARTICLES[0]
    expect(getGuideArticle(first.slug)?.title).toBe(first.title)
    expect(getGuideArticle('no-such-guide')).toBeUndefined()
    const related = getRelatedGuides(first, 3)
    expect(related.length).toBe(3)
    expect(related.some((r) => r.slug === first.slug)).toBe(false)
    expect(guideReadingMinutes(first)).toBeGreaterThanOrEqual(3)
  })
})
