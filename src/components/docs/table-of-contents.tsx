'use client'

import { useState, useEffect } from 'react'
import { AlignLeft } from 'lucide-react'

type Heading = {
  id: string
  text: string
  level: number
}

export function TableOfContents({ lang }: { lang: string }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const isHindi = lang === 'hi'

  useEffect(() => {
    // Small delay to ensure ReactMarkdown has rendered
    const timer = setTimeout(() => {
      const elements = Array.from(document.querySelectorAll('h2, h3'))
      const headingData = elements.map((elem) => ({
        id: elem.id,
        text: (elem as HTMLElement).innerText,
        level: Number(elem.tagName.substring(1)),
      })).filter(h => h.id) // Only include if it has an ID

      setHeadings(headingData)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -35% 0px' }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <div className="hidden xl:block w-64 flex-shrink-0 pl-8 border-l border-[var(--border-subtle)]">
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <h4 className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4">
          <AlignLeft size={16} />
          {isHindi ? 'इस पृष्ठ पर' : 'On This Page'}
        </h4>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => (
            <li 
              key={heading.id}
              className={`transition-all duration-200 ${heading.level === 3 ? 'pl-4' : ''}`}
            >
              <a
                href={`#${heading.id}`}
                className={`
                  block py-1 hover:text-[var(--accent)] transition-colors
                  ${activeId === heading.id 
                    ? 'text-[var(--accent)] font-medium' 
                    : 'text-[var(--text-secondary)]'}
                `}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: 'smooth'
                  })
                  setActiveId(heading.id)
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
