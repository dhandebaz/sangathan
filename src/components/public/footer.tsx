import Link from 'next/link'

export function Footer({ lang }: { lang: string }) {
  const isHindi = lang === 'hi'
  
  const footerLinks = {
    product: {
      title: isHindi ? 'उत्पाद' : 'Product',
      links: [
        { label: isHindi ? 'विशेषताएं' : 'Features', href: `/${lang}/features` },
        { label: isHindi ? 'मूल्य निर्धारण' : 'Pricing', href: `/${lang}/pricing` },
        { label: isHindi ? 'दस्तावेज़ीकरण' : 'Documentation', href: `/${lang}/docs` },
        { label: isHindi ? 'परिवर्तन लॉग' : 'Changelog', href: `/${lang}/changelog` },
      ]
    },
    company: {
      title: isHindi ? 'कंपनी' : 'Company',
      links: [
        { label: isHindi ? 'हमारे बारे में' : 'About Us', href: `/${lang}/about` },
        { label: isHindi ? 'विजन' : 'Vision', href: `/${lang}/vision` },
        { label: isHindi ? 'प्रेस' : 'Press', href: `/${lang}/press` },
        { label: isHindi ? 'सामान्य प्रश्न' : 'FAQ', href: `/${lang}/faq` },
      ]
    },
    trust: {
      title: isHindi ? 'विश्वास' : 'Trust',
      links: [
        { label: isHindi ? 'पारदर्शिता' : 'Transparency', href: `/${lang}/transparency` },
        { label: isHindi ? 'सुरक्षा' : 'Security', href: `/${lang}/security` },
        { label: isHindi ? 'रिपोर्ट' : 'Reports', href: `/${lang}/reports` },
      ]
    },
    legal: {
      title: isHindi ? 'कानूनी' : 'Legal',
      links: [
        { label: isHindi ? 'गोपनीयता नीति' : 'Privacy Policy', href: `/${lang}/privacy` },
        { label: isHindi ? 'सेवा की शर्तें' : 'Terms of Service', href: `/${lang}/terms` },
        { label: isHindi ? 'डेटा अधिकार' : 'Data Rights', href: `/${lang}/data-rights` },
        { label: isHindi ? 'कुकीज़' : 'Cookies', href: `/${lang}/cookies` },
        { label: isHindi ? 'स्वीकार्य उपयोग' : 'Acceptable Use', href: `/${lang}/acceptable-use-policy` },
      ]
    },
    contact: {
      title: isHindi ? 'संपर्क' : 'Connect',
      links: [
        { label: 'hello@sangathan.space', href: 'mailto:hello@sangathan.space' },
        { label: 'Twitter / X', href: 'https://twitter.com/areynetaji' },
        { label: 'Instagram', href: 'https://instagram.com/areynetaji' },
        { label: isHindi ? 'मदद चाहिए?' : 'Contact Support', href: `/${lang}/contact` },
      ]
    }
  }

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto relative overflow-hidden text-sm">
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: 'radial-gradient(circle, #0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12 mb-16">
           {/* Brand Column (Span 2 on LG) */}
           <div className="col-span-2 lg:col-span-2 pr-8">
              <Link href={`/${lang}`} className="text-2xl font-black tracking-tighter text-slate-900 mb-6 block hover:opacity-90">
                Sangathan
              </Link>
              <p className="text-slate-500 leading-relaxed mb-8 max-w-sm font-medium">
                 {isHindi 
                   ? 'जमीनी संगठनों के लिए डिजिटल बुनियादी ढांचा। न्यूनतम, शांत और गोपनीयता के लिए निर्मित।' 
                   : 'Digital infrastructure for grassroots organisations. Built for privacy, autonomy, and absolute institutional integrity.'}
              </p>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-none animate-pulse" />
                {isHindi ? 'सभी प्रणालियां काम कर रही हैं' : 'All systems operational'}
              </div>
           </div>
           
           {/* Links Columns */}
           {[footerLinks.product, footerLinks.company, footerLinks.trust, footerLinks.legal].map((section, idx) => (
             <div key={idx} className="col-span-1">
                <h4 className="font-bold mb-6 text-slate-900 tracking-tight">{section.title}</h4>
                <ul className="space-y-4">
                   {section.links.map((link) => (
                     <li key={link.href}>
                       <Link href={link.href} className="text-slate-500 hover:text-indigo-600 transition-colors font-medium">
                         {link.label}
                       </Link>
                     </li>
                   ))}
                </ul>
             </div>
           ))}
        </div>

        {/* Contact Strip */}
        <div className="pt-8 border-t border-slate-200 mb-8">
           <div className="flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
              <div className="flex flex-wrap items-center gap-6">
                {footerLinks.contact.links.map((link) => (
                   <div key={link.href}>
                     {link.href.startsWith('http') || link.href.startsWith('mailto') ? (
                       <a href={link.href} target={link.href.startsWith('http') ? "_blank" : undefined} rel="noopener noreferrer" className="text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm">
                         {link.label}
                       </a>
                     ) : (
                       <Link href={link.href} className="text-slate-500 hover:text-indigo-600 transition-colors font-medium text-sm">
                         {link.label}
                       </Link>
                     )}
                   </div>
                ))}
              </div>
           </div>
        </div>
        
        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400 font-mono tracking-widest uppercase">
           <div className="flex items-center gap-1">
              {isHindi ? 'द्वारा संचालित' : 'Powered by'} 
              <a 
                href="https://ziddi.space" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-600 hover:text-indigo-600 transition-colors font-bold ml-1"
              >
                ziddi
              </a>
           </div>
           
           <div className="text-center md:text-right">
              {isHindi ? 'एक पहल' : 'An Initiative by'} 
              <span className="text-slate-600 ml-1 font-bold">Bahujan Queer Foundation</span>
           </div>
        </div>
      </div>
    </footer>
  )
}
