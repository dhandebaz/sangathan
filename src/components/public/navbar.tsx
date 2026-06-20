'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, Heart, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Navbar({ lang, isAuthenticated }: { lang: string; isAuthenticated: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHindi = lang === 'hi'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:pt-6 w-full pointer-events-none">
      <nav 
        className={`pointer-events-auto w-full max-w-6xl transition-all duration-300 rounded-2xl sm:rounded-full border ${
          scrolled 
            ? 'bg-white/80  backdrop-blur-lg border-slate-200/50  shadow-[0_8px_30px_rgb(0,0,0,0.06)]' 
            : 'bg-white/50  backdrop-blur-md border-transparent shadow-none'
        }`}
        aria-label="Main navigation"
      >
        <div className="px-4 sm:px-6">
            <div className="flex items-center justify-between h-14 sm:h-16">
             {/* Logo */}
             <div className="flex-shrink-0 flex items-center">
              <Link 
                href={`/${lang}`} 
                className="flex items-center gap-2 group"
                aria-label="Sangathan Home"
              >
                <div className="bg-slate-900  rounded-lg p-1.5 transition-transform group-hover:scale-105">
                  <Heart className="w-4 h-4 text-white  fill-current" />
                </div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 ">
                  Sangathan
                </span>
              </Link>
             </div>

             {/* Desktop Navigation */}
             <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      className={`relative px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-full hover:bg-slate-100/50  ${
                        isActive 
                          ? 'text-slate-900 '
                          : 'text-slate-500  hover:text-slate-900 '
                      }`}
                      prefetch={true}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-900  rounded-full" />
                      )}
                    </Link>
                  )
                })}
             </div>

             {/* Right side actions */}
             <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center bg-slate-100/50  rounded-full p-1 border border-slate-200/50 ">
                   <Link 
                     href={getPathForLang('en')} 
                     className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${lang === 'en' ? 'bg-white  text-slate-900  shadow-sm' : 'text-slate-500 hover:text-slate-900 '}`}
                   >
                     EN
                   </Link>
                   <Link 
                     href={getPathForLang('hi')} 
                     className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${lang === 'hi' ? 'bg-white  text-slate-900  shadow-sm' : 'text-slate-500 hover:text-slate-900 '}`}
                   >
                     HI
                   </Link>
                </div>

                {isAuthenticated ? (
                   <Link 
                      href={`/${lang}/dashboard`}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200  bg-white  px-4 py-2 text-sm font-bold text-slate-900  transition-all hover:scale-105 hover:shadow-sm"
                    prefetch={true}
                   >
                      <LayoutDashboard size={16} />
                      {isHindi ? 'डैशबोर्ड' : 'Dashboard'}
                   </Link>
                ) : (
                    <div className="flex items-center gap-2">
                      <Link 
                         href={`/${lang}/login`}
                         className="inline-flex items-center px-4 py-2 text-sm font-bold text-slate-600  transition-colors hover:text-slate-900 "
                         prefetch={true}
                      >
                         {isHindi ? 'लॉग इन' : 'Login'}
                      </Link>
                      <Link 
                         href={`/${lang}/login?tab=signup`}
                         className="group inline-flex items-center gap-1 rounded-full bg-slate-900  px-5 py-2 text-sm font-bold text-white  transition-all hover:bg-slate-800  hover:scale-105 shadow-[0_0_20px_rgb(0,0,0,0.1)]"
                      >
                         {isHindi ? 'साइन अप' : 'Get Started'}
                         <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                )}
             </div>

             {/* Mobile Menu Button */}
             <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex p-2 items-center justify-center rounded-full text-slate-900  bg-slate-100/50  hover:bg-slate-200/50"
                  aria-expanded={isOpen}
                >
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
             </div>
            </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="border-t border-slate-200/50  md:hidden bg-white/95  backdrop-blur-xl rounded-b-2xl">
            <div className="flex flex-col p-4 space-y-2">
               {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                      pathname === link.href
                        ? 'bg-slate-100  text-slate-900 '
                        : 'text-slate-600  hover:bg-slate-50 '
                    }`}
                    prefetch={true}
                  >
                    {link.label}
                  </Link>
               ))}
               
               <div className="pt-4 mt-2 border-t border-slate-200/50 ">
                  <div className="flex gap-2 p-1 bg-slate-100/50  rounded-xl">
                     <Link href={getPathForLang('en')} className={`flex-1 text-center py-2 rounded-lg text-sm font-bold transition-colors ${lang === 'en' ? 'bg-white  text-slate-900  shadow-sm' : 'text-slate-500'}`}>English</Link>
                     <Link href={getPathForLang('hi')} className={`flex-1 text-center py-2 rounded-lg text-sm font-bold transition-colors ${lang === 'hi' ? 'bg-white  text-slate-900  shadow-sm' : 'text-slate-500'}`}>हिंदी</Link>
                  </div>
               </div>
               
               {isAuthenticated ? (
                  <Link
                    href={`/${lang}/dashboard`}
                    onClick={() => setIsOpen(false)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200  bg-white  px-4 py-3 font-bold text-slate-900  shadow-sm"
                    prefetch={true}
                   >
                    <LayoutDashboard size={18} />
                    {isHindi ? 'डैशबोर्ड पर जाएं' : 'Go to Dashboard'}
                  </Link>
               ) : (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                       <Link
                          href={`/${lang}/login`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center rounded-xl border border-slate-200  py-3 font-bold text-slate-900 "
                          prefetch={true}
                       >
                          {isHindi ? 'लॉग इन' : 'Login'}
                       </Link>
                       <Link
                          href={`/${lang}/login?tab=signup`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center rounded-xl bg-slate-900  py-3 font-bold text-white  shadow-md"
                          prefetch={true}
                       >
                          {isHindi ? 'साइन अप' : 'Get Started'}
                       </Link>
                  </div>
               )}
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}
