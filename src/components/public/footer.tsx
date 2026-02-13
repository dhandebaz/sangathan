import Link from 'next/link'

export function Footer({ lang }: { lang: string }) {
  const isHindi = lang === 'hi'
  
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
           <div className="col-span-1 md:col-span-2">
              <Link href={`/${lang}`} className="text-2xl font-bold tracking-tight mb-4 block">
                {isHindi ? 'संगठन' : 'Sangathan'}
              </Link>
              <p className="text-gray-500 text-sm max-w-xs">
                 {isHindi 
                   ? 'जमीनी संगठनों के लिए डिजिटल बुनियादी ढांचा। न्यूनतम, शांत और गोपनीयता के लिए निर्मित।' 
                   : 'Infrastructure for grassroots organisations. Minimal, calm, and built for privacy.'}
              </p>
           </div>
           
           <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">{isHindi ? 'मंच' : 'Platform'}</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                 <li><Link href={`/${lang}/about`} className="hover:text-black">{isHindi ? 'हमारे बारे में' : 'About Us'}</Link></li>
                 <li><Link href={`/${lang}/docs`} className="hover:text-black">{isHindi ? 'दस्तावेज़' : 'Documentation'}</Link></li>
                 <li><Link href={`/${lang}/roadmap`} className="hover:text-black">{isHindi ? 'रोडमैप' : 'Roadmap'}</Link></li>
                 <li><Link href={`/${lang}/changelog`} className="hover:text-black">{isHindi ? 'परिवर्तन लॉग' : 'Changelog'}</Link></li>
                 <li><Link href={`/${lang}/status`} className="hover:text-black">{isHindi ? 'सिस्टम स्थिति' : 'System Status'}</Link></li>
              </ul>
           </div>

           <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">{isHindi ? 'कानूनी और संपर्क' : 'Legal & Contact'}</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                 <li><Link href={`/${lang}/governance`} className="hover:text-black">{isHindi ? 'शासन' : 'Governance'}</Link></li>
                 <li><Link href={`/${lang}/security`} className="hover:text-black">{isHindi ? 'सुरक्षा' : 'Security'}</Link></li>
                 <li><Link href={`/${lang}/transparency`} className="hover:text-black">{isHindi ? 'पारदर्शिता' : 'Transparency'}</Link></li>
                 <li><Link href={`/${lang}/contact`} className="hover:text-black">{isHindi ? 'संपर्क करें' : 'Contact'}</Link></li>
                 <li><Link href={`/${lang}/privacy`} className="hover:text-black">{isHindi ? 'गोपनीयता' : 'Privacy'}</Link></li>
                 <li><Link href={`/${lang}/terms`} className="hover:text-black">{isHindi ? 'शर्तें' : 'Terms'}</Link></li>
              </ul>
           </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium">
           <div>
              {isHindi ? 'एक पहल' : 'An Initiative by'} <span className="text-gray-900">Bahujan Queer Foundation</span>
           </div>
           <div>
              {isHindi ? 'द्वारा संचालित' : 'Powered by'} <a href="https://ziddi.space" target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:underline">ziddi</a>
           </div>
        </div>
      </div>
    </footer>
  )
}
