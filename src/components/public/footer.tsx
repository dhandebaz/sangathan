import Link from 'next/link'

export function Footer({ lang }: { lang: string }) {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
           <div className="col-span-1 md:col-span-2">
              <Link href={`/${lang}`} className="text-2xl font-bold tracking-tight mb-4 block">Sangathan</Link>
              <p className="text-gray-500 text-sm max-w-xs">
                 Infrastructure for grassroots organisations. Minimal, calm, and built for privacy.
              </p>
           </div>
           
           <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                 <li><Link href={`/${lang}/docs`} className="hover:text-black">Documentation</Link></li>
                 <li><Link href={`/${lang}/status`} className="hover:text-black">System Status</Link></li>
                 <li><Link href={`/${lang}/contact`} className="hover:text-black">Contact Support</Link></li>
              </ul>
           </div>

           <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                 <li><Link href={`/${lang}/terms`} className="hover:text-black">Terms of Service</Link></li>
                 <li><Link href={`/${lang}/privacy`} className="hover:text-black">Privacy Policy</Link></li>
                 <li><Link href={`/${lang}/refund-policy`} className="hover:text-black">Refund Policy</Link></li>
                 <li><Link href={`/${lang}/acceptable-use-policy`} className="hover:text-black">Acceptable Use</Link></li>
              </ul>
           </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium">
           <div>
              An Initiative by <span className="text-gray-900">Bahujan Queer Foundation</span>
           </div>
           <div>
              Powered by <a href="https://ziddi.space" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">ziddi</a>
           </div>
        </div>
      </div>
    </footer>
  )
}
