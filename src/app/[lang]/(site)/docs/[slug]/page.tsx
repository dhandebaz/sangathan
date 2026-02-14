import { getDocContent } from '@/lib/docs'
import ReactMarkdown, { Components } from 'react-markdown'
import Link from 'next/link'
import { ArrowLeft, Clock, AlertCircle, ChevronRight } from 'lucide-react'
import { Metadata } from 'next'
import { TableOfContents } from '@/components/docs/table-of-contents'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ lang: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params
  const isHindi = lang === 'hi'
  
  // Basic title mapping for metadata (can be moved to a shared config if needed)
  const titles: Record<string, string> = {
    'getting-started': 'Getting Started',
    'members': 'Members',
    'forms': 'Forms',
    'meetings': 'Meetings',
    'donations': 'Donations',
    'supporter-plan': 'Supporter Plan',
    'security-governance': 'Security & Governance',
    'admin-responsibilities': 'Admin Responsibilities',
    'system-admin': 'System Admin',
    'data-lifecycle': 'Data Lifecycle',
    'troubleshooting': 'Troubleshooting',
    'faq': 'FAQ',
  }

  const title = titles[slug] || 'Documentation'
  
  return {
    title: `${title} | Sangathan Docs`,
    description: isHindi
      ? 'संगठन प्लेटफॉर्म प्रलेखन'
      : 'Sangathan Platform Documentation',
  }
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export default async function DocPage({ params }: PageProps) {
  const { lang, slug } = await params
  const isHindi = lang === 'hi'
  
  const content = getDocContent(slug)

  if (!content) {
    return (
      <div className="py-12 px-6 text-center bg-[var(--surface)] rounded-2xl border border-[var(--border-subtle)]">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--bg-secondary)] mb-4">
          <AlertCircle className="text-[var(--text-secondary)]" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          {isHindi ? 'दस्तावेज़ नहीं मिला' : 'Document Not Found'}
        </h1>
        <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
          {isHindi
            ? 'क्षमा करें, आप जिस गाइड की तलाश कर रहे हैं वह मौजूद नहीं है।'
            : 'Sorry, the guide you are looking for does not exist.'}
        </p>
        <Link href={`/${lang}/docs`} className="inline-flex items-center gap-2 text-[var(--accent)] font-medium hover:underline">
          <ArrowLeft size={16} /> {isHindi ? 'वापस दस्तावेजों पर जाएं' : 'Back to Docs'}
        </Link>
      </div>
    )
  }

  // Custom components for ReactMarkdown to handle IDs and Styling
  const MarkdownComponents: Components = {
    h1: ({ children }) => {
      const id = typeof children === 'string' ? slugify(children) : ''
      return <h1 id={id} className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-6 mt-10 first:mt-0">{children}</h1>
    },
    h2: ({ children }) => {
      const id = typeof children === 'string' ? slugify(children) : ''
      return <h2 id={id} className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-4 mt-10 scroll-mt-24">{children}</h2>
    },
    h3: ({ children }) => {
      const id = typeof children === 'string' ? slugify(children) : ''
      return <h3 id={id} className="text-xl font-bold text-[var(--text-primary)] mb-3 mt-8 scroll-mt-24">{children}</h3>
    },
    p: ({ children }) => <p className="text-[var(--text-secondary)] leading-7 mb-5 text-[1.05rem]">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-5 space-y-2 text-[var(--text-secondary)]">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-[var(--text-secondary)]">{children}</ol>,
    li: ({ children }) => <li className="pl-1">{children}</li>,
    a: ({ href, children }) => <a href={href} className="text-[var(--accent)] hover:underline font-medium decoration-2 underline-offset-2">{children}</a>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[var(--accent)] pl-4 py-1 my-6 bg-[var(--surface)] italic text-[var(--text-secondary)] rounded-r-lg">
        {children}
      </blockquote>
    ),
    code: ({ className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '')
      const inline = !match;
      return !inline ? (
        <div className="relative my-6 rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface)]">
          <div className="px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
            </div>
            <span className="text-xs text-[var(--text-secondary)] font-mono ml-2 uppercase opacity-60">
              {match?.[1] || 'text'}
            </span>
          </div>
          <div className="overflow-x-auto p-4">
            <code className={`${className} text-sm font-mono text-[var(--text-primary)]`} {...props}>
              {children}
            </code>
          </div>
        </div>
      ) : (
        <code className="px-1.5 py-0.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[0.9em] font-mono text-[var(--text-primary)]" {...props}>
          {children}
        </code>
      )
    },
    hr: () => <hr className="my-10 border-[var(--border-subtle)]" />,
    table: ({ children }) => (
      <div className="overflow-x-auto my-8 border border-[var(--border-subtle)] rounded-lg">
        <table className="min-w-full divide-y divide-[var(--border-subtle)]">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-[var(--bg-secondary)]">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y divide-[var(--border-subtle)] bg-[var(--bg-primary)]">{children}</tbody>,
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">{children}</th>,
    td: ({ children }) => <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--text-secondary)]">{children}</td>,
  }

  return (
    <div className="flex flex-col xl:flex-row gap-12 w-full">
      {/* Content Column */}
      <article className="flex-1 min-w-0 max-w-3xl">
        <div className="mb-8 pb-8 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-4">
             <Link href={`/${lang}/docs`} className="hover:text-[var(--text-primary)] transition-colors">
               {isHindi ? 'दस्तावेज़' : 'Docs'}
             </Link>
             <ChevronRight size={14} />
             <span className="text-[var(--text-primary)] font-medium capitalize">
               {slug.replace(/-/g, ' ')}
             </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mt-4">
            <div className="flex items-center gap-1.5">
               <Clock size={14} />
               <span>5 min read</span>
            </div>
          </div>
        </div>

        <div className="docs-content">
           <ReactMarkdown components={MarkdownComponents}>
             {content}
           </ReactMarkdown>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--border-subtle)] flex justify-between items-center">
          <p className="text-sm text-[var(--text-secondary)]">
            {isHindi 
              ? 'क्या यह पृष्ठ मददगार था?'
              : 'Was this page helpful?'}
          </p>
          <a 
            href="https://github.com/bahujan-queer/sangathan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            {isHindi ? 'गिटहब पर संपादित करें' : 'Edit on GitHub'}
          </a>
        </div>
      </article>

      {/* Right Column: Table of Contents */}
      <TableOfContents lang={lang} />
    </div>
  )
}
