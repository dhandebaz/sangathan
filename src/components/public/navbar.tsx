'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, ChevronRight } from 'lucide-react'
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
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    // Use a microtask to avoid synchronous setState in effect
    Promise.resolve().then(() => {
      if (isOpen) {
        setIsOpen(false)
      }
    })
  }, [pathname])

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
           {/* 1. Left: Logo */}
           <div className="flex-shrink-0 flex items-center">
             <Link 
               href={`/${lang}`} 
               className="text-2xl font-bold tracking-tight text-[var(--text-primary)] hover:opacity-90 transition-opacity"
               aria-label="Sangathan Home"
             >
               Sangathan
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

           {/* 3. Right: Utility Controls (Desktop) */}
           <div className="hidden md:flex items-center gap-6">
              {/* Language Switcher */}
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                 <Link 
                   href={getPathForLang('en')} 
                   className={`transition-colors hover:text-[var(--text-primary)] ${lang === 'en' ? 'text-[var(--text-primary)] font-bold' : ''}`}
                   aria-label="Switch to English"
                 >
                   EN
                 </Link>
                 <span className="opacity-30">/</span>
                 <Link 
                   href={getPathForLang('hi')} 
                   className={`transition-colors hover:text-[var(--text-primary)] ${lang === 'hi' ? 'text-[var(--text-primary)] font-bold' : ''}`}
                   aria-label="Switch to Hindi"
                 >
                   HI
                 </Link>
              </div>

              <div className="h-4 w-px bg-[var(--border-subtle)]"></div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Auth Action */}
              <div className="pl-2">
                 {user ? (
                   <Link 
                     href="/dashboard" 
                     className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--bg-secondary)] flex items-center gap-2 transition-all"
                   >
                     <LayoutDashboard size={16} className="text-[var(--accent)]" />
                     {isHindi ? 'डैशबोर्ड' : 'Dashboard'}
                   </Link>
                 ) : (
                   <div className="flex items-center gap-4">
                     <Link 
                       href="/login" 
                       className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                     >
                       {isHindi ? 'लॉग इन' : 'Login'}
                     </Link>
                     <Link 
                       href="/signup" 
                       className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
                     >
                       {isHindi ? 'शुरू करें' : 'Start Free'}
                     </Link>
                   </div>
                 )}
              </div>
           </div>

           {/* Mobile Menu Button */}
           <div className="flex items-center md:hidden gap-4">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-[var(--text-primary)] p-3 -mr-2 hover:bg-[var(--bg-secondary)] rounded-md transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center"
                aria-expanded={isOpen}
                aria-label="Toggle Navigation Menu"
              >
                 {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
           </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
         <div className="md:hidden bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] shadow-xl animate-fade-in absolute w-full left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 pt-4 pb-8 space-y-6">
               {/* Mobile Nav Links */}
               <div className="space-y-1">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                        pathname === link.href
                          ? 'bg-[var(--bg-secondary)] text-[var(--accent)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
               </div>

               <div className="h-px bg-[var(--border-subtle)] my-4"></div>

               {/* Mobile Utilities */}
               <div className="space-y-6 px-4">
                  {/* Theme & Language Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 bg-[var(--bg-secondary)] rounded-full p-1 border border-[var(--border-subtle)]">
                       <Link 
                         href={getPathForLang('en')} 
                         className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                           lang === 'en' ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)]'
                         }`}
                       >
                         English
                       </Link>
                       <Link 
                         href={getPathForLang('hi')} 
                         className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                           lang === 'hi' ? 'bg-[var(--surface)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)]'
                         }`}
                       >
                         हिंदी
                       </Link>
                    </div>
                    <ThemeToggle />
                  </div>

                  {/* Mobile Auth */}
                  {user ? (
                    <Link 
                      href="/dashboard" 
                      className="flex w-full items-center justify-center gap-2 bg-[var(--accent)] text-white px-4 py-3 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity"
                    >
                      <LayoutDashboard size={20} />
                      {isHindi ? 'डैशबोर्ड खोलें' : 'Open Dashboard'}
                    </Link>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <Link 
                        href="/login" 
                        className="flex items-center justify-center px-4 py-3 border border-[var(--border-subtle)] rounded-lg text-base font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
                      >
                        {isHindi ? 'लॉग इन' : 'Login'}
                      </Link>
                      <Link 
                        href="/signup" 
                        className="flex items-center justify-center px-4 py-3 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-lg text-base font-bold hover:opacity-90"
                      >
                        {isHindi ? 'शुरू करें' : 'Start Free'}
                      </Link>
                    </div>
                  )}
               </div>
            </div>
         </div>
      )}
    </nav>
  )
}
