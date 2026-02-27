'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { ThemeToggle } from '@/components/site/theme-toggle'

export function Navbar({ lang }: { lang: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const supabase = createClient()
  const isHindi = lang === 'hi'

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
           console.warn('Auth check failed:', error.message)
           return
        }
        if (data?.user) {
          setUser(data.user)
        }
      } catch (err) {
        console.error('Navbar Auth Exception:', err)
      }
    }
    getUser()
  }, [supabase.auth])

  // Close mobile menu on route change
  useEffect(() => {
    // Use a microtask to avoid synchronous setState in effect
    Promise.resolve().then(() => {
      if (isOpen) {
        setIsOpen(false)
      }
    })
  }, [pathname, isOpen])

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
      className="fixed top-0 w-full z-50 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] transition-all duration-300"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
           <div className="flex-shrink-0 flex items-center">
            <Link 
              href={`/${lang}`} 
              className="flex items-center"
              aria-label="Sangathan Home"
            >
              <span className="sr-only">Sangathan</span>
              <Image
                src="/logo/whitesangathanlogo.png"
                alt=""
                width={128}
                height={32}
                className="h-8 w-auto logo-mark-light"
                aria-hidden="true"
                priority
              />
              <Image
                src="/logo/blacksangathanlogo.png"
                alt=""
                width={128}
                height={32}
                className="h-8 w-auto logo-mark-dark"
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
                      ? 'text-[var(--accent)]' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
           </div>

           {/* 3. Right: Auth & Theme (Desktop) */}
           <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 border-r border-[var(--border-subtle)] pr-4">
                 <Link href={getPathForLang('en')} className={`text-sm font-bold ${lang === 'en' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>EN</Link>
                 <span className="text-[var(--border-subtle)]">/</span>
                 <Link href={getPathForLang('hi')} className={`text-sm font-bold ${lang === 'hi' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>HI</Link>
              </div>

              <ThemeToggle />

              {user ? (
                 <Link 
                    href={`/${lang}/dashboard`}
                    className="bg-[var(--surface)] text-[var(--text-primary)] px-4 py-2 rounded-lg font-medium text-sm border border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] flex items-center gap-2 transition-all"
                 >
                    <LayoutDashboard size={16} />
                    {isHindi ? 'डैशबोर्ड' : 'Dashboard'}
                 </Link>
              ) : (
                 <div className="flex items-center gap-3">
                    <Link 
                       href="/login" 
                       className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                       {isHindi ? 'लॉग इन' : 'Login'}
                    </Link>
                    <Link 
                       href="/signup" 
                       className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90 transition-all shadow-sm"
                    >
                       {isHindi ? 'साइन अप' : 'Sign Up'}
                    </Link>
                 </div>
              )}
           </div>

           {/* Mobile menu button */}
           <div className="flex items-center gap-4 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-[var(--text-primary)] p-2 rounded-md hover:bg-[var(--bg-secondary)]"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
           </div>
          </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
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
             {user ? (
                <Link
                  href={`/${lang}/dashboard`}
                  className="block w-full text-center mt-4 bg-[var(--surface)] text-[var(--text-primary)] px-4 py-3 rounded-lg font-medium border border-[var(--border-subtle)]"
                >
                  {isHindi ? 'डैशबोर्ड पर जाएं' : 'Go to Dashboard'}
                </Link>
             ) : (
                <div className="grid grid-cols-2 gap-3 px-3 mt-4 pb-2">
                   <Link
                      href="/login"
                      className="text-center py-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium"
                   >
                      {isHindi ? 'लॉग इन' : 'Login'}
                   </Link>
                   <Link
                      href="/signup"
                      className="text-center py-2 rounded-lg bg-[var(--text-primary)] text-[var(--bg-primary)] font-medium"
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
