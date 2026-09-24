import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import {
  ALL_GUIDE_ARTICLES,
  ARTICLE_CATEGORIES,
  getGuideArticle,
  getRelatedGuides,
  guideReadingMinutes,
} from '@/lib/seo-articles'
import { ArticleJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/seo/json-ld'
import {
  GuideBlockRenderer,
  GuideCta,
  GuideFaq,
  GuideMeta,
  GuideRelated,
  GuideTakeaways,
  GuideToc,
} from '@/components/guides/guide-blocks'

export async function generateStaticParams() {
  return ALL_GUIDE_ARTICLES.map((article) => ({ slug: article.slug }))
}

function articleUrl(slug: string): string {
  return `https://sangathan.space/guides/${slug}`
}

function articleOgImage(title: string, description: string, categoryLabel: string): string {
  const params = new URLSearchParams({
    title: title.length > 90 ? `${title.slice(0, 90)}…` : title,
    desc: description.length > 140 ? `${description.slice(0, 140)}…` : description,
    type: 'guide',
    tag: categoryLabel,
  })
  return `https://sangathan.space/api/og?${params.toString()}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getGuideArticle(slug)
  if (!article) {
    return { title: 'Guide Not Found | Sangathan' }
  }

  const url = articleUrl(slug)
  const categoryLabel = ARTICLE_CATEGORIES[article.category].labelEn
  const ogImage = articleOgImage(article.title, article.description, categoryLabel)

  return {
    title: `${article.title} | Sangathan Guides`,
    description: article.description,
    keywords: article.keywords,
    authors: [{ name: 'Sangathan Editorial Team', url: 'https://sangathan.space' }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      siteName: 'Sangathan',
      locale: 'en_IN',
      type: 'article',
      publishedTime: article.datePublished,
      modifiedTime: article.datePublished,
      authors: ['Sangathan Editorial Team'],
      tags: article.keywords,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@areynetaji',
      creator: '@areynetaji',
      title: article.title,
      description: article.description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getGuideArticle(slug)
  if (!article) notFound()

  const url = articleUrl(slug)
  const categoryLabel = ARTICLE_CATEGORIES[article.category].labelEn
  const ogImage = articleOgImage(article.title, article.description, categoryLabel)
  const related = getRelatedGuides(article, 3)
  const minutes = guideReadingMinutes(article)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20 sm:px-6">
      <ArticleJsonLd
        headline={article.title}
        description={article.description}
        url={url}
        imageUrl={ogImage}
        datePublished={article.datePublished}
        dateModified={article.datePublished}
        keywords={article.keywords}
      />
      <FAQJsonLd questions={article.faqs.map((f) => ({ question: f.q, answer: f.a }))} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://sangathan.space/en' },
          { name: article.title, url },
        ]}
      />

      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/en" className="font-medium hover:text-indigo-700 hover:underline">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
        <span aria-current="page" className="truncate font-medium text-slate-700">
          {article.title}
        </span>
      </nav>

      <article>
        <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Guides / {categoryLabel}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl sm:leading-[1.15]">
          {article.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">{article.description}</p>
        <GuideMeta article={article} />

        <div className="mt-6 flex items-center gap-3 border-y border-slate-200 py-4">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-extrabold text-white"
          >
            S
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">Sangathan Editorial Team</p>
            <p className="text-xs text-slate-500">
              Practical guides for Indian collectives & NGOs · {minutes} min read
            </p>
          </div>
        </div>

        <GuideTakeaways items={article.keyTakeaways} />
        <GuideToc blocks={article.blocks} />

        <div>
          {article.blocks.map((block, i) => (
            <GuideBlockRenderer key={i} block={block} />
          ))}
        </div>

        <GuideFaq faqs={article.faqs} />
      </article>

      <GuideRelated articles={related} />
      <GuideCta productTieIn={article.productTieIn} />
    </div>
  )
}
