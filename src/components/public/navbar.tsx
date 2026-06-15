'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'

export function Navbar({ lang, isAuthenticated }: { lang: string; isAuthenticated: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isHindi = lang === 'hi'

  const getPathForLang = (targetLang: string) => {
    if (!pathname) return `/${targetLang}`
    const segments = pathname.split('/')
    if (segments.length < 2) return `/${targetLang}`
    segments[1] = targetLang
    return segments.join('/')
  }

  const navLinks = [
    { href: `/${lang}/docs`, label: isHindi ? 'दस्तावेज़' : 'Docs' },
    { href: `/${lang}/governance`, label: isHindi ? 'शासन' : 'Governance' },
    { href: `/${lang}/status`, label: isHindi ? 'स्थिति' : 'Status' },
    { href: `/${lang}/contact`, label: isHindi ? 'संपर्क' : 'Contact' },
  ]

  return (
    <nav 
      className="fixed top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-white"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
           <div className="flex-shrink-0 flex items-center">
            <Link 
              href={`/${lang}`} 
              className="flex items-center"
              aria-label="Sangathan Home"
            >
              <span className="sr-only">Sangathan</span>
              <Image
                src="/logo/blacksangathanlogo.png"
                alt=""
                width={128}
                height={32}
                className="h-8 w-auto"
                aria-hidden="true"
                priority
              />
            </Link>
           </div>

           {/* 2. Center: Nav Links (Desktop) */}
           <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`text-sm font-medium transition-colors duration-200 ${
                    pathname === link.href 
                      ? 'text-[var(--brand-accent)]' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
           </div>

           {/* 3. Right: Language and account actions */}
           <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 border-r border-[var(--border-subtle)] pr-4">
                 <Link href={getPathForLang('en')} className={`text-sm font-bold ${lang === 'en' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>EN</Link>
                 <span className="text-[var(--border-subtle)]">/</span>
                 <Link href={getPathForLang('hi')} className={`text-sm font-bold ${lang === 'hi' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>HI</Link>
              </div>

              {isAuthenticated ? (
                 <Link 
                    href={`/${lang}/dashboard`}
                    className="flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-secondary)]"
                 >
                    <LayoutDashboard size={16} />
                    {isHindi ? 'डैशबोर्ड' : 'Dashboard'}
                 </Link>
              ) : (
                 <div className="flex items-center gap-3">
                    <Link 
                       href={`/${lang}/login`}
                       className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                    >
                       {isHindi ? 'लॉग इन' : 'Login'}
                    </Link>
                    <Link 
                       href={`/${lang}/signup`}
                       className="inline-flex min-h-11 items-center rounded-lg bg-[var(--brand-accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--brand-accent-hover)]"
                    >
                       {isHindi ? 'साइन अप' : 'Sign Up'}
                    </Link>
                 </div>
              )}
           </div>

           {/* Mobile menu button */}
           <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-controls="mobile-navigation"
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
           </div>
          </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-navigation" className="border-b border-[var(--border-subtle)] bg-white shadow-lg md:hidden">
          <div className="space-y-1 px-3 pb-4 pt-3">
             {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-3 py-2 text-base font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                >
                  {link.label}
                </Link>
             ))}
             <div className="border-t border-[var(--border-subtle)] my-2 pt-2">
                <div className="flex gap-4 px-3 py-2">
                   <Link href={getPathForLang('en')} className={`text-sm font-bold ${lang === 'en' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>English</Link>
                   <Link href={getPathForLang('hi')} className={`text-sm font-bold ${lang === 'hi' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>हिंदी</Link>
                </div>
             </div>
             {isAuthenticated ? (
                <Link
                  href={`/${lang}/dashboard`}
                  onClick={() => setIsOpen(false)}
                  className="mt-4 flex min-h-12 w-full items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-white px-4 py-3 text-center font-semibold text-[var(--text-primary)]"
                >
                  {isHindi ? 'डैशबोर्ड पर जाएं' : 'Go to Dashboard'}
                </Link>
             ) : (
                <div className="grid grid-cols-2 gap-3 px-3 mt-4 pb-2">
                   <Link
                      href={`/${lang}/login`}
                      onClick={() => setIsOpen(false)}
                      className="flex min-h-12 items-center justify-center rounded-lg border border-[var(--border-subtle)] py-2 text-center font-semibold text-[var(--text-primary)]"
                   >
                      {isHindi ? 'लॉग इन' : 'Login'}
                   </Link>
                   <Link
                      href={`/${lang}/signup`}
                      onClick={() => setIsOpen(false)}
                      className="flex min-h-12 items-center justify-center rounded-lg bg-[var(--brand-accent)] py-2 text-center font-semibold text-white"
                   >
                      {isHindi ? 'साइन अप' : 'Sign Up'}
                   </Link>
                </div>
             )}
          </div>
        </div>
      )}
    </nav>
  )
}
