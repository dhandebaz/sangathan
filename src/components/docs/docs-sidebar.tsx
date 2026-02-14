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

  // Close mobile drawer on route change
  useEffect(() => {
    // Use a microtask to avoid synchronous setState in effect
    Promise.resolve().then(() => {
      if (isOpen) {
        setIsOpen(false)
      }
    })
  }, [pathname])

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
          className="flex items-center gap-2 w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] font-medium"
        >
          <Menu size={20} />
          {isHindi ? 'मेनू' : 'Menu'}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed inset-0 z-40 bg-[var(--bg-primary)] lg:static lg:block lg:w-64 lg:flex-shrink-0 lg:border-r lg:border-[var(--border-subtle)] lg:pr-8 lg:bg-transparent
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
              className="p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded-md"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="space-y-8">
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
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
