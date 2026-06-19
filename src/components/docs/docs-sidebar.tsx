'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { docsConfig } from '@/lib/docs-config'
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export function DocsSidebar({ lang }: { lang: string }) {
  const pathname = usePathname()
  const isHindi = lang === 'hi'
  const [isOpen, setIsOpen] = useState(false)

  // Initialize all sections as expanded by default
  // Use useState initializer function to avoid effect
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {}
    docsConfig.forEach((section) => {
      initialState[section.title.en] = true
    })
    return initialState
  })

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  const isActive = (slug: string) => {
    // Handle exact match or sub-anchor match
    const cleanSlug = slug.split('#')[0]
    return pathname === `/${lang}/docs/${cleanSlug}` || pathname === `/${lang}/docs/${slug}`
  }

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(true)}
          className="flex min-h-12 w-full items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-white px-4 py-3 font-semibold text-[var(--text-primary)]"
          aria-expanded={isOpen}
          aria-controls="docs-navigation"
        >
          <Menu size={20} />
          {isHindi ? 'मेनू' : 'Menu'}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside 
        id="docs-navigation"
        aria-label="Documentation navigation"
        className={`
          fixed inset-y-0 left-0 z-40 w-[min(88vw,22rem)] bg-white shadow-xl lg:static lg:block lg:w-64 lg:flex-shrink-0 lg:border-r lg:border-[var(--border-subtle)] lg:bg-transparent lg:pr-8 lg:shadow-none
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full overflow-y-auto p-6 lg:p-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)]">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <span className="text-xl font-bold text-[var(--text-primary)]">
              {isHindi ? 'दस्तावेज़' : 'Documentation'}
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
              aria-label="Close documentation menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-8">
            {/* Back to Docs Home */}
            <Link
              href={`/${lang}/docs`}
              onClick={() => setIsOpen(false)}
              className={`block py-2 text-sm font-bold transition-colors border-l-2 pl-4 mb-6 ${
                pathname === `/${lang}/docs`
                  ? 'border-[var(--accent)] text-[var(--accent)]'
                  : 'border-transparent text-[var(--text-primary)] hover:border-[var(--text-secondary)] hover:text-[var(--accent)]'
              }`}
            >
              {isHindi ? 'दस्तावेज़ीकरण होम' : 'Documentation Home'}
            </Link>

            {docsConfig.map((section) => (
              <div key={section.title.en}>
                <button 
                  onClick={() => toggleSection(section.title.en)}
                  className="flex items-center justify-between w-full mb-3 text-sm font-bold tracking-wider text-[var(--text-primary)] uppercase hover:text-[var(--accent)] transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    {section.icon && <section.icon size={16} className="text-[var(--accent)]" />}
                    <span>{isHindi ? section.title.hi : section.title.en}</span>
                  </div>
                  {expandedSections[section.title.en] ? (
                    <ChevronDown size={14} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)]" />
                  ) : (
                    <ChevronRight size={14} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)]" />
                  )}
                </button>
                
                {expandedSections[section.title.en] && (
                  <ul className="space-y-1 border-l border-[var(--border-subtle)] ml-2 pl-4">
                    {section.items.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/${lang}/docs/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className={`
                            block py-1.5 text-sm transition-colors border-l-2 -ml-[17px] pl-4
                            ${isActive(item.slug) 
                              ? 'border-[var(--accent)] text-[var(--accent)] font-medium bg-[var(--bg-secondary)]/50 rounded-r-md' 
                              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)]'}
                          `}
                        >
                          {isHindi ? item.title.hi : item.title.en}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
