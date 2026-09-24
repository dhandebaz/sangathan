import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, FileText, Newspaper } from 'lucide-react'
import {
  ALL_GUIDE_ARTICLES,
  ARTICLE_CATEGORIES,
  countArticleWords,
  guideReadingMinutes,
} from '@/lib/seo-articles'
import { CopyLinkButton } from './copy-button'

export const metadata: Metadata = {
  title: 'SEO Posts | System Admin',
  robots: { index: false, follow: false },
}

/**
 * Internal registry of SEO guide articles.
 * These pages are crawlable + sitemap-listed but intentionally NOT linked
 * from any public navigation — this page is their only listing surface.
 * (/admin/* is disallowed in robots.txt, so these links stay out of crawlers.)
 */
export default function SeoPostsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sangathan.space'
  const totalWords = ALL_GUIDE_ARTICLES.reduce((sum, a) => sum + countArticleWords(a), 0)
  const totalFaqs = ALL_GUIDE_ARTICLES.reduce((sum, a) => sum + a.faqs.length, 0)
  const byCategory = new Map<string, number>()
  for (const article of ALL_GUIDE_ARTICLES) {
    byCategory.set(article.category, (byCategory.get(article.category) || 0) + 1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900">
          <Newspaper className="h-6 w-6 text-indigo-600" />
          SEO Posts
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          Internal registry of SEO guide articles (<code className="font-mono">/guides/[slug]</code>).
          These pages are crawlable and sitemap-listed, but deliberately not linked from public
          navigation — manage and share links from here.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-extrabold text-slate-900">{ALL_GUIDE_ARTICLES.length}</p>
          <p className="text-xs font-medium text-slate-500">Published guides</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-extrabold text-slate-900">{totalWords.toLocaleString('en-IN')}</p>
          <p className="text-xs font-medium text-slate-500">Total words</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-extrabold text-slate-900">{totalFaqs}</p>
          <p className="text-xs font-medium text-slate-500">FAQs (AI-search ammo)</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-extrabold text-slate-900">{byCategory.size}</p>
          <p className="text-xs font-medium text-slate-500">Categories</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <th scope="col" className="px-4 py-3 font-extrabold">#</th>
              <th scope="col" className="px-4 py-3 font-extrabold">Title</th>
              <th scope="col" className="px-4 py-3 font-extrabold">Category</th>
              <th scope="col" className="px-4 py-3 font-extrabold">Words</th>
              <th scope="col" className="px-4 py-3 font-extrabold">Read</th>
              <th scope="col" className="px-4 py-3 font-extrabold">FAQs</th>
              <th scope="col" className="px-4 py-3 font-extrabold">URL</th>
            </tr>
          </thead>
          <tbody>
            {ALL_GUIDE_ARTICLES.map((article, i) => {
              const url = `${baseUrl}/guides/${article.slug}`
              const words = countArticleWords(article)
              return (
                <tr key={article.slug} className="border-t border-slate-100 hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">{i + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{article.title}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-400">/guides/{article.slug}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-slate-600">
                    {ARTICLE_CATEGORIES[article.category].labelEn}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-slate-700">{words.toLocaleString('en-IN')}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {guideReadingMinutes(article)} min
                  </td>
                  <td className="px-4 py-3 text-slate-700">{article.faqs.length}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <Link
                        href={`/guides/${article.slug}`}
                        className="inline-flex min-h-9 items-center gap-1 rounded-lg bg-indigo-600 px-2.5 text-xs font-bold text-white hover:bg-indigo-700"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View
                      </Link>
                      <CopyLinkButton url={url} />
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
        <FileText className="mt-0.5 h-4 w-4 shrink-0" />
        Content source: <code className="font-mono">src/lib/seo-articles/articles/batch-*.ts</code>. To add a
        guide, append an entry following <code className="font-mono">types.ts</code> +{' '}
        <code className="font-mono">ARTICLE-GUIDE.md</code> — sitemap, llms.txt, llms-full.txt and this
        registry pick it up automatically.
      </p>
    </div>
  )
}
