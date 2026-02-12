'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Globe } from 'lucide-react'
import { useState } from 'react'

export function Navbar({ lang }: { lang: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const getPathForLang = (targetLang: string) => {
    if (!pathname) return `/${targetLang}`
    const segments = pathname.split('/')
    // Handle root / or empty segments properly
    if (segments.length < 2) return `/${targetLang}`
    
    // segments[0] is empty string (split on /)
    // segments[1] is 'en' or 'hi'
    segments[1] = targetLang
    return segments.join('/')
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
           {/* Logo */}
           <div className="flex-shrink-0">
             <Link href={`/${lang}`} className="text-2xl font-bold tracking-tight">
               Sangathan
             </Link>
           </div>

           {/* Desktop Links */}
           <div className="hidden md:flex items-center space-x-8">
              <Link href={`/${lang}/docs`} className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                {lang === 'hi' ? 'दस्तावेज़' : 'Docs'}
              </Link>
              <Link href={`/${lang}/contact`} className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                {lang === 'hi' ? 'संपर्क' : 'Contact'}
              </Link>
              <Link href={`/${lang}/status`} className="text-sm font-medium text-gray-700 hover:text-black transition-colors">
                {lang === 'hi' ? 'स्थिति' : 'Status'}
              </Link>
              
              <div className="flex items-center gap-2 text-sm font-medium border-l pl-4 ml-4">
                 <Link 
                   href={getPathForLang('en')} 
                   className={`hover:text-black transition-colors ${lang === 'en' ? 'text-black font-bold' : 'text-gray-400'}`}
                 >
                   EN
                 </Link>
                 <span className="text-gray-300">|</span>
                 <Link 
                   href={getPathForLang('hi')} 
                   className={`hover:text-black transition-colors ${lang === 'hi' ? 'text-black font-bold' : 'text-gray-400'}`}
                 >
                   हिंदी
                 </Link>
              </div>

              <div className="flex items-center gap-4 ml-4 pl-4 border-l">
                 <Link href="/login" className="text-sm font-medium text-gray-900">
                   {lang === 'hi' ? 'लॉग इन' : 'Login'}
                 </Link>
                 <Link href="/signup" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90">
                   {lang === 'hi' ? 'शुरू करें' : 'Start Free'}
                 </Link>
              </div>
           </div>

           {/* Mobile Menu Button */}
           <div className="flex items-center md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-black p-2">
                 {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
           </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
         <div className="md:hidden bg-white border-b border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
               <Link href={`/${lang}/docs`} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                 {lang === 'hi' ? 'दस्तावेज़' : 'Docs'}
               </Link>
               <Link href={`/${lang}/contact`} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                 {lang === 'hi' ? 'संपर्क' : 'Contact'}
               </Link>
               
               <div className="flex items-center gap-4 px-3 py-2">
                 <Link href={getPathForLang('en')} className={`text-base font-medium ${lang === 'en' ? 'text-black font-bold' : 'text-gray-500'}`}>English</Link>
                 <Link href={getPathForLang('hi')} className={`text-base font-medium ${lang === 'hi' ? 'text-black font-bold' : 'text-gray-500'}`}>हिंदी</Link>
               </div>

               <div className="mt-4 pt-4 border-t px-3 space-y-2">
                  <Link href="/login" className="block w-full text-center px-4 py-2 border border-gray-300 rounded-lg text-base font-medium text-gray-700">
                    {lang === 'hi' ? 'लॉग इन' : 'Login'}
                  </Link>
                  <Link href="/signup" className="block w-full text-center px-4 py-2 bg-black text-white rounded-lg text-base font-bold">
                    {lang === 'hi' ? 'शुरू करें' : 'Start Free'}
                  </Link>
               </div>
            </div>
         </div>
      )}
    </nav>
  )
}
