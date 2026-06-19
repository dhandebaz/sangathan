'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, Heart } from 'lucide-react'
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
    { href: `/${lang}/support`, label: isHindi ? 'हमें समर्थन दें' : 'Support Us', highlight: true },
  ]

  return (
    <nav 
      className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
           <div className="flex-shrink-0 flex items-center">
            <Link 
              href={`/${lang}`} 
              className="flex items-center"
              aria-label="Sangathan Home"
            >
              <span className="sr-only">Sangathan</span>
              <Image
                src="/logo/logo.png"
                alt=""
                width={128}
                height={32}
                className="h-8 w-auto"
                aria-hidden="true"
                priority
              />
            </Link>
           </div>

           <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`text-sm font-medium transition-colors duration-200 ${
                    pathname === link.href 
                      ? 'text-brand-700 border-b border-brand-600 pb-0.5'
                      : link.highlight
                        ? 'text-brand-700 flex items-center gap-1.5 hover:text-brand-800'
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                  prefetch={true}
                >
                  {link.highlight && <Heart size={14} className="fill-brand-500 text-brand-500" />}
                  {link.label}
                </Link>
              ))}
           </div>

           <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                 <Link href={getPathForLang('en')} className={`text-sm font-semibold ${lang === 'en' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>EN</Link>
                 <span className="text-slate-300">/</span>
                 <Link href={getPathForLang('hi')} className={`text-sm font-semibold ${lang === 'hi' ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>HI</Link>
              </div>

              {isAuthenticated ? (
                 <Link 
                    href={`/${lang}/dashboard`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                  prefetch={true}
                 >
                    <LayoutDashboard size={16} />
                    {isHindi ? 'डैशबोर्ड' : 'Dashboard'}
                 </Link>
              ) : (
                  <div className="flex items-center gap-3">
                    <Link 
                       href={`/${lang}/login`}
                       className="inline-flex min-h-11 items-center text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
                       prefetch={true}
                    >
                       {isHindi ? 'लॉग इन' : 'Login'}
                    </Link>
                    <Link 
                       href={`/${lang}/signup`}
                       className="inline-flex min-h-11 items-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
                    >
                       {isHindi ? 'साइन अप' : 'Sign Up'}
                    </Link>
                  </div>
              )}
           </div>

           <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-900 hover:bg-slate-100"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-controls="mobile-navigation"
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
           </div>
          </div>
      </div>

      {isOpen && (
        <div id="mobile-navigation" className="border-t border-slate-200 bg-white shadow-2xl md:hidden">
          <div className="space-y-1 px-3 pb-4 pt-3">
             {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex min-h-11 items-center rounded-xl px-3 py-2 text-base font-semibold transition-colors ${
                    link.highlight
                      ? 'text-brand-700 bg-brand-50 hover:bg-brand-100'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  prefetch={true}
                >
                  {link.highlight && <Heart size={16} className="fill-brand-500 text-brand-500 mr-2" />}
                  {link.label}
                </Link>
             ))}
             <div className="border-t border-slate-200 my-2 pt-2">
                <div className="flex gap-4 px-3 py-2">
                   <Link href={getPathForLang('en')} className={`text-sm font-semibold ${lang === 'en' ? 'text-slate-900' : 'text-slate-500'}`}>English</Link>
                   <Link href={getPathForLang('hi')} className={`text-sm font-semibold ${lang === 'hi' ? 'text-slate-900' : 'text-slate-500'}`}>हिंदी</Link>
                </div>
             </div>
             {isAuthenticated ? (
                <Link
                  href={`/${lang}/dashboard`}
                  onClick={() => setIsOpen(false)}
                  className="mt-4 flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-center font-semibold text-slate-900"
                  prefetch={true}
                 >
                  {isHindi ? 'डैशबोर्ड पर जाएं' : 'Go to Dashboard'}
                </Link>
             ) : (
                <div className="flex flex-col gap-3 px-3 mt-4 pb-2">
                   <div className="grid grid-cols-2 gap-3">
                     <Link
                        href={`/${lang}/login`}
                        onClick={() => setIsOpen(false)}
                        className="flex min-h-12 items-center justify-center rounded-xl border border-slate-200 py-2 text-center font-semibold text-slate-900"
                        prefetch={true}
                     >
                        {isHindi ? 'लॉग इन' : 'Login'}
                     </Link>
                     <Link
                        href={`/${lang}/signup`}
                        onClick={() => setIsOpen(false)}
                        className="flex min-h-12 items-center justify-center rounded-xl bg-brand-600 py-2 text-center font-semibold text-white"
                        prefetch={true}
                     >
                        {isHindi ? 'साइन अप' : 'Sign Up'}
                     </Link>
                   </div>
                </div>
             )}
          </div>
        </div>
      )}
    </nav>
  )
}
