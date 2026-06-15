import { getDocContent } from '@/lib/docs'
import ReactMarkdown, { Components } from 'react-markdown'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, ChevronRight, Clock } from 'lucide-react'
import { Metadata } from 'next'
import { TableOfContents } from '@/components/docs/table-of-contents'
import { docsConfig } from '@/lib/docs-config'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ lang: string; slug: string }>
}

function getTitleForSlug(slug: string, lang: string): string {
  for (const section of docsConfig) {
    const item = section.items.find(i => i.slug.split('#')[0] === slug)
    if (item) return lang === 'hi' ? item.title.hi : item.title.en
  }
  return slug.replace(/-/g, ' ')
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params
  const title = getTitleForSlug(slug, lang)

  return {
    title: lang === 'hi' ? `${title} | संगठन डॉक्स` : `${title} | Sangathan Docs`,
    description: lang === 'hi' ? `${title} के लिए चरण-दर-चरण मार्गदर्शन।` : `Step-by-step Sangathan guidance for ${title.toLowerCase()}.`,
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default async function DocPage({ params }: PageProps) {
  const { lang, slug } = await params
  const content = getDocContent(slug, lang)

  const isHindi = lang === 'hi'

  if (!content) {
    return (
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-white px-6 py-12 text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-secondary)]">
          <AlertCircle className="text-[var(--text-secondary)]" size={24} />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-[var(--text-primary)]">
          {isHindi ? 'दस्तावेज़ नहीं मिला' : 'Document not found'}
        </h1>
        <p className="mx-auto mb-8 max-w-md text-[var(--text-secondary)]">
          {isHindi ? 'आप जो मार्गदर्शिका खोज रहे हैं वह मौजूद नहीं है या स्थानांतरित कर दी गई है।' : 'The guide you are looking for does not exist or has moved.'}
        </p>
        <Link href={`/${lang}/docs`} className="inline-flex min-h-11 items-center gap-2 font-semibold text-orange-700 hover:underline">
          <ArrowLeft size={16} /> {isHindi ? 'दस्तावेज़ीकरण पर वापस जाएं' : 'Back to documentation'}
        </Link>
      </div>
    )
  }

  const title = getTitleForSlug(slug, lang)
  const readingTime = Math.max(2, Math.ceil(content.trim().split(/\s+/).length / (isHindi ? 180 : 220)))
  
  const orderedDocs = Array.from(
    new Map(
      docsConfig.flatMap((section) =>
        section.items.map((item) => {
          const s = item.slug.split('#')[0]
          return [s, { slug: s, title: isHindi ? item.title.hi : item.title.en }] as const
        }),
      ),
    ).values(),
  )

  const currentIndex = orderedDocs.findIndex((item) => item.slug === slug)
  const previousDoc = currentIndex > 0 ? orderedDocs[currentIndex - 1] : null
  const nextDoc = currentIndex >= 0 && currentIndex < orderedDocs.length - 1 ? orderedDocs[currentIndex + 1] : null

  const MarkdownComponents: Components = {
    h1: ({ children }) => {
      const id = typeof children === 'string' ? slugify(children) : ''
      return <h1 id={id} className="mb-6 mt-10 scroll-mt-24 text-3xl font-bold tracking-tight text-[var(--text-primary)] first:mt-0 md:text-4xl">{children}</h1>
    },
    h2: ({ children }) => {
      const id = typeof children === 'string' ? slugify(children) : ''
      return <h2 id={id} className="mb-4 mt-10 scroll-mt-24 text-2xl font-bold tracking-tight text-[var(--text-primary)]">{children}</h2>
    },
    h3: ({ children }) => {
      const id = typeof children === 'string' ? slugify(children) : ''
      return <h3 id={id} className="mb-3 mt-8 scroll-mt-24 text-xl font-bold text-[var(--text-primary)]">{children}</h3>
    },
    p: ({ children }) => <p className="mb-5 text-[1.02rem] leading-8 text-[var(--text-secondary)]">{children}</p>,
    ul: ({ children }) => <ul className="mb-5 list-disc space-y-2 pl-6 leading-7 text-[var(--text-secondary)]">{children}</ul>,
    ol: ({ children }) => <ol className="mb-5 list-decimal space-y-2 pl-6 leading-7 text-[var(--text-secondary)]">{children}</ol>,
    li: ({ children }) => <li className="pl-1">{children}</li>,
    a: ({ href, children }) => <a href={href} className="font-semibold text-orange-700 underline-offset-2 hover:underline">{children}</a>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 rounded-r-lg border-l-4 border-orange-600 bg-orange-50 py-3 pl-4 pr-4 text-[var(--text-secondary)]">
        {children}
      </blockquote>
    ),
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '')
      const inline = !match
      return !inline ? (
        <div className="relative my-6 overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-white">
          <div className="flex items-center border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 py-2">
            <span className="font-mono text-xs font-semibold uppercase text-[var(--text-secondary)]">
              {match?.[1] || 'text'}
            </span>
          </div>
          <div className="overflow-x-auto p-4">
            <code className={`${className} font-mono text-sm text-[var(--text-primary)]`} {...props}>
              {children}
            </code>
          </div>
        </div>
      ) : (
        <code className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--text-primary)]" {...props}>
          {children}
        </code>
      )
    },
    hr: () => <hr className="my-10 border-[var(--border-subtle)]" />,
    table: ({ children }) => (
      <div className="my-8 overflow-x-auto rounded-lg border border-[var(--border-subtle)]">
        <table className="min-w-[640px] divide-y divide-[var(--border-subtle)]">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-[var(--bg-secondary)]">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y divide-[var(--border-subtle)] bg-white">{children}</tbody>,
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">{children}</th>,
    td: ({ children }) => <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{children}</td>,
  }

  return (
    <div className="flex w-full flex-col gap-10 xl:flex-row xl:gap-12">
      <article className="min-w-0 max-w-3xl flex-1">
        <header className="mb-8 border-b border-[var(--border-subtle)] pb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Link href={`/${lang}/docs`} className="transition-colors hover:text-[var(--text-primary)]">
              {isHindi ? 'डॉक्स' : 'Docs'}
            </Link>
            <ChevronRight size={14} aria-hidden="true" />
            <span className="font-medium text-[var(--text-primary)]">{title}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            {isHindi ? 'चरण-दर-चरण परिचालन मार्गदर्शन, अपेक्षित परिणाम और जाँच जो सामान्य गलतियों को रोकती हैं।' : 'Step-by-step operating guidance, expected outcomes, and checks that prevent common mistakes.'}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
            <Clock size={14} aria-hidden="true" />
            <span>{readingTime} {isHindi ? 'मिनट पढ़ने का समय' : 'min read'}</span>
          </div>
        </header>

        <div className="docs-content">
          <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
        </div>

        <nav className="mt-14 grid gap-3 border-t border-[var(--border-subtle)] pt-8 sm:grid-cols-2" aria-label="Documentation pagination">
          {previousDoc ? (
            <Link href={`/${lang}/docs/${previousDoc.slug}`} className="rounded-xl border border-slate-200 bg-white p-4 hover:border-orange-300 hover:bg-orange-50">
              <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">{isHindi ? 'पिछला' : 'Previous'}</span>
              <span className="mt-1 block font-bold text-slate-950">{previousDoc.title}</span>
            </Link>
          ) : <span />}
          {nextDoc && (
            <Link href={`/${lang}/docs/${nextDoc.slug}`} className="rounded-xl border border-slate-200 bg-white p-4 hover:border-orange-300 hover:bg-orange-50 sm:text-right">
              <span className="block text-xs font-bold uppercase tracking-wide text-slate-500">{isHindi ? 'अगला' : 'Next'}</span>
              <span className="mt-1 block font-bold text-slate-950">{nextDoc.title}</span>
            </Link>
          )}
        </nav>

        <div className="mt-8 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-950">{isHindi ? 'अभी भी अवरुद्ध हैं?' : 'Still blocked?'}</p>
            <p className="mt-1 text-sm text-slate-600">{isHindi ? 'आगे बढ़ने से पहले समस्या निवारण और FAQ देखें।' : 'Check troubleshooting and the operational FAQ before escalating.'}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            <Link href={`/${lang}/docs/troubleshooting`} className="text-orange-700 hover:underline">{isHindi ? 'समस्या निवारण' : 'Troubleshooting'}</Link>
            <Link href={`/${lang}/docs/faq`} className="text-orange-700 hover:underline">FAQ</Link>
          </div>
        </div>
      </article>

      <TableOfContents lang={lang} />
    </div>
  )
}
