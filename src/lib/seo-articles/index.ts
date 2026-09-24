import type { SeoArticle } from './types'
import { batch1Articles } from './articles/batch-1'
import { batch2Articles } from './articles/batch-2'
import { batch3Articles } from './articles/batch-3'
import { batch4Articles } from './articles/batch-4'
import { batch5Articles } from './articles/batch-5'
import { batch6Articles } from './articles/batch-6'

export type { SeoArticle } from './types'
export { ARTICLE_CATEGORIES } from './types'
export type { ArticleCategory } from './types'

export const ALL_GUIDE_ARTICLES: SeoArticle[] = [
  ...batch1Articles,
  ...batch2Articles,
  ...batch3Articles,
  ...batch4Articles,
  ...batch5Articles,
  ...batch6Articles,
]

const slugMap = new Map<string, SeoArticle>()
for (const article of ALL_GUIDE_ARTICLES) {
  slugMap.set(article.slug, article)
}

export function getGuideArticle(slug: string): SeoArticle | undefined {
  return slugMap.get(slug)
}

export function getGuideSlugs(): string[] {
  return ALL_GUIDE_ARTICLES.map((a) => a.slug)
}

/** Same-category articles first, then others. Excludes self. */
export function getRelatedGuides(article: SeoArticle, count = 3): SeoArticle[] {
  const others = ALL_GUIDE_ARTICLES.filter((a) => a.slug !== article.slug)
  const sameCategory = others.filter((a) => a.category === article.category)
  const rest = others.filter((a) => a.category !== article.category)
  return [...sameCategory, ...rest].slice(0, count)
}

export function countArticleWords(article: SeoArticle): number {
  const parts: string[] = [
    article.title,
    article.description,
    ...article.keyTakeaways,
    ...article.faqs.flatMap((f) => [f.q, f.a]),
    ...(article.productTieIn ? [article.productTieIn] : []),
  ]
  for (const block of article.blocks) {
    switch (block.type) {
      case 'p':
      case 'h2':
      case 'h3':
      case 'note':
        parts.push(block.text)
        break
      case 'list':
      case 'numbered':
        parts.push(...block.items)
        break
      case 'quote':
        parts.push(block.text, block.cite || '')
        break
      case 'table':
        parts.push(block.title || '', ...block.headers, ...block.rows.flat())
        break
      case 'figure': {
        const fig = block.figure
        if (fig.title) parts.push(fig.title)
        if (block.caption) parts.push(block.caption)
        if (fig.type === 'steps') parts.push(...fig.steps)
        else if (fig.type === 'checklist') parts.push(...fig.items)
        else if (fig.type === 'stats') parts.push(...fig.stats.flatMap((s) => [s.value, s.label]))
        else if (fig.type === 'dos-donts') parts.push(...fig.dos, ...fig.donts)
        else if (fig.type === 'timeline') parts.push(...fig.entries.flatMap((e) => [e.label, e.text]))
        break
      }
    }
  }
  return parts
    .join(' ')
    .trim()
    .split(/\s+/).length
}

export function guideReadingMinutes(article: SeoArticle): number {
  return Math.max(3, Math.ceil(countArticleWords(article) / 200))
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
}
