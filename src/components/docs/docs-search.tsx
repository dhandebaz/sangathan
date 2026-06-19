'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'

type SearchItem = {
  title: string
  altTitle?: string
  category: string
  altCategory?: string
  slug: string
}

export function DocsSearch({ lang, items }: { lang: string; items: SearchItem[] }) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!normalizedQuery) return []
    return items
      .filter((item) => {
        const primary = `${item.title} ${item.category}`.toLowerCase()
        const secondary = item.altTitle || item.altCategory ? `${item.altTitle} ${item.altCategory}`.toLowerCase() : ''
        return primary.includes(normalizedQuery) || secondary.includes(normalizedQuery)
      })
      .slice(0, 7)
  }, [items, normalizedQuery])

  return (
    <div className="relative" role="search">
      <label htmlFor="docs-search" className="sr-only">
        Search documentation
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden="true" />
      <input
        id="docs-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search setup, members, forms, security..."
        autoComplete="off"
        className="min-h-14 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-base text-slate-950 shadow-sm placeholder:text-slate-500 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100"
      />
      {normalizedQuery && (
        <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          {results.length > 0 ? (
            <ul aria-label="Documentation search results" className="divide-y divide-slate-100">
              {results.map((item) => (
                <li key={`${item.slug}-${item.title}`}>
                  <Link
                    href={`/${lang}/docs/${item.slug}`}
                    className="flex min-h-14 items-center justify-between gap-4 px-4 py-3 hover:bg-orange-50"
                    onClick={() => setQuery('')}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-slate-950">{item.title}</span>
                      <span className="block truncate text-xs text-slate-600">{item.category}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-orange-700" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 text-sm text-slate-600">
              No matching guide. Try “members”, “forms”, “security”, or “troubleshooting”.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
