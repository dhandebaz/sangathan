import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ListOrdered,
  Quote,
  X,
} from 'lucide-react'
import type { ArticleBlock, ArticleFigure, SeoArticle } from '@/lib/seo-articles/types'
import { ARTICLE_CATEGORIES, guideReadingMinutes, slugifyHeading } from '@/lib/seo-articles'

function FigureRenderer({ figure, caption }: { figure: ArticleFigure; caption?: string }) {
  let body: React.ReactNode = null

  if (figure.type === 'steps') {
    body = (
      <ol className="relative space-y-4 border-l-2 border-indigo-200 pl-0">
        {figure.steps.map((step, i) => (
          <li key={i} className="relative pl-10">
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-indigo-600 text-xs font-extrabold text-white"
            >
              {i + 1}
            </span>
            <p className="text-sm leading-relaxed text-slate-700 sm:text-[15px]">{step}</p>
          </li>
        ))}
      </ol>
    )
  } else if (figure.type === 'checklist') {
    body = (
      <ul className="space-y-2.5">
        {figure.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  } else if (figure.type === 'stats') {
    body = (
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {figure.stats.map((stat, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white px-4 py-5 text-center shadow-sm">
            <dt className="order-2 mt-1 block text-xs font-medium text-slate-500">{stat.label}</dt>
            <dd className="order-1 text-2xl font-extrabold tracking-tight text-indigo-900">{stat.value}</dd>
          </div>
        ))}
      </dl>
    )
  } else if (figure.type === 'dos-donts') {
    body = (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-emerald-700">Do</p>
          <ul className="space-y-2">
            {figure.dos.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-rose-700">Don&apos;t</p>
          <ul className="space-y-2">
            {figure.donts.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  } else if (figure.type === 'timeline') {
    body = (
      <ol className="relative space-y-5 border-l-2 border-slate-200 pl-0">
        {figure.entries.map((entry, i) => (
          <li key={i} className="relative pl-8">
            <span
              aria-hidden="true"
              className="absolute left-0 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-indigo-600 bg-white"
            />
            <p className="text-sm font-extrabold text-slate-900">{entry.label}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{entry.text}</p>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <figure className="my-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-7">
      {figure.title && (
        <figcaption className="mb-4 text-base font-extrabold tracking-tight text-slate-900">
          {figure.title}
        </figcaption>
      )}
      {body}
      {caption && <figcaption className="mt-4 text-xs leading-relaxed text-slate-500">{caption}</figcaption>}
    </figure>
  )
}

export function GuideBlockRenderer({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'p':
      return <p className="my-5 text-[17px] leading-[1.8] text-slate-700">{block.text}</p>
    case 'h2':
      return (
        <h2
          id={slugifyHeading(block.text)}
          className="mb-3 mt-10 scroll-mt-28 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]"
        >
          {block.text}
        </h2>
      )
    case 'h3':
      return (
        <h3 className="mb-2 mt-8 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{block.text}</h3>
      )
    case 'list':
      return (
        <ul className="my-5 space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[16px] leading-relaxed text-slate-700">
              <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'numbered':
      return (
        <ol className="my-5 space-y-2.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[16px] leading-relaxed text-slate-700">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-extrabold text-white"
              >
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )
    case 'quote':
      return (
        <blockquote className="my-7 rounded-r-xl border-l-4 border-indigo-600 bg-indigo-50/50 py-4 pl-5 pr-4">
          <Quote className="mb-2 h-5 w-5 text-indigo-400" aria-hidden="true" />
          <p className="text-[16px] font-medium leading-relaxed text-slate-800">{block.text}</p>
          {block.cite && <cite className="mt-2 block text-sm not-italic text-slate-500">— {block.cite}</cite>}
        </blockquote>
      )
    case 'table':
      return (
        <div className="my-7">
          {block.title && <p className="mb-2 text-base font-extrabold tracking-tight text-slate-900">{block.title}</p>}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[560px] border-collapse bg-white text-left text-sm">
              <thead>
                <tr className="bg-slate-100">
                  {block.headers.map((h, i) => (
                    <th key={i} scope="col" className="border-b border-slate-200 px-4 py-3 font-extrabold text-slate-900">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="border-b border-slate-100 px-4 py-3 leading-relaxed text-slate-700">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    case 'figure':
      return <FigureRenderer figure={block.figure} caption={block.caption} />
    case 'note':
      return (
        <aside className="my-7 rounded-xl border border-amber-300 bg-amber-50 p-5">
          <p className="mb-1.5 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-amber-800">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            {block.title || 'Watch out'}
          </p>
          <p className="text-[15px] leading-relaxed text-amber-900">{block.text}</p>
        </aside>
      )
  }
}

export function GuideTakeaways({ items }: { items: string[] }) {
  return (
    <section aria-label="Key takeaways" className="my-8 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5 sm:p-7">
      <h2 className="mb-3 text-base font-extrabold tracking-tight text-indigo-950">Key takeaways</h2>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[15px] font-medium leading-relaxed text-slate-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function GuideToc({ blocks }: { blocks: ArticleBlock[] }) {
  const headings = blocks.filter((b): b is { type: 'h2'; text: string } => b.type === 'h2')
  if (headings.length < 2) return null
  return (
    <nav aria-label="On this page" className="my-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <p className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-slate-500">
        <ListOrdered className="h-4 w-4" aria-hidden="true" />
        On this page
      </p>
      <ol className="space-y-2">
        {headings.map((h, i) => (
          <li key={i}>
            <a
              href={`#${slugifyHeading(h.text)}`}
              className="text-[15px] font-medium leading-snug text-indigo-700 hover:text-indigo-900 hover:underline"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function GuideFaq({ faqs }: { faqs: SeoArticle['faqs'] }) {
  if (faqs.length === 0) return null
  return (
    <section aria-label="Frequently asked questions" className="mt-12">
      <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-slate-900">Frequently asked questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details key={i} className="group rounded-xl border border-slate-200 bg-white px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-bold text-slate-900 [&::-webkit-details-marker]:hidden">
              <span>{faq.q}</span>
              <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function GuideRelated({ articles }: { articles: SeoArticle[] }) {
  if (articles.length === 0) return null
  return (
    <section aria-label="Related guides" className="mt-12">
      <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-slate-900">Keep reading</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/guides/${article.slug}`}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-md"
          >
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              {ARTICLE_CATEGORIES[article.category].labelEn}
            </p>
            <p className="text-[15px] font-bold leading-snug text-slate-900 group-hover:text-indigo-800">
              {article.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {article.description.length > 140 ? `${article.description.slice(0, 140)}…` : article.description}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-indigo-700">
              Read guide
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function GuideCta({ productTieIn }: { productTieIn?: string }) {
  return (
    <section aria-label="Run this with Sangathan" className="mt-12 rounded-2xl border-2 border-indigo-200 bg-white p-6 sm:p-8">
      <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Sangathan</p>
      <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
        Run this on rails, not spreadsheets
      </h2>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600">
        {productTieIn ||
          'Sangathan gives civic collectives and NGOs member rolls, donation records, secret ballots, complaint diaries with 30-day RTI reminders, and printable parchas — free for grassroots groups.'}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/en/features"
          className="inline-flex min-h-11 items-center rounded-lg bg-indigo-600 px-5 text-sm font-bold text-white hover:bg-indigo-700"
        >
          Explore features
        </Link>
        <Link
          href="/en/pricing"
          className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-5 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          See pricing
        </Link>
      </div>
    </section>
  )
}

export function GuideMeta({ article }: { article: SeoArticle }) {
  const minutes = guideReadingMinutes(article)
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
      <span>
        Published <time dateTime={article.datePublished}>{article.datePublished}</time>
      </span>
      <span aria-hidden="true">·</span>
      <span>{minutes} min read</span>
      <span aria-hidden="true">·</span>
      <span>{ARTICLE_CATEGORIES[article.category].labelEn}</span>
    </div>
  )
}
