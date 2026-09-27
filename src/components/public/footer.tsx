import Link from 'next/link'
import { FeaturedOn } from './featured-on'

export function Footer({ lang }: { lang: string }) {
  const isHindi = lang === 'hi'
  
  const footerLinks = {
    product: {
      title: isHindi ? 'नागरिक उत्पाद' : 'Civic Platform',
      links: [
        { label: isHindi ? 'विशेषताएं' : 'Features', href: `/${lang}/features` },
        { label: isHindi ? 'योगदान और पहुंच' : 'Pay & Price', href: `/${lang}/pricing` },
        { label: isHindi ? 'दस्तावेज़ीकरण' : 'Documentation', href: `/${lang}/docs` },
        { label: isHindi ? 'परिवर्तन लॉग' : 'Changelog', href: `/${lang}/changelog` },
        { label: isHindi ? 'रोडमैप' : 'Roadmap', href: `/${lang}/roadmap` },
        { label: isHindi ? 'स्थिति' : 'Status', href: `/${lang}/status` },
      ]
    },
    initiative: {
      title: isHindi ? 'पहल और विजन' : 'Initiative',
      links: [
        { label: isHindi ? 'हमारे बारे में' : 'About Us', href: `/${lang}/about` },
        { label: isHindi ? 'विजन' : 'Vision', href: `/${lang}/vision` },
        { label: isHindi ? 'प्रेस' : 'Press', href: `/${lang}/press` },
        { label: isHindi ? 'सामान्य प्रश्न' : 'FAQ', href: `/${lang}/faq` },
        { label: isHindi ? 'नेटवर्क' : 'Network', href: `/${lang}/network` },
        { label: isHindi ? 'सामुदायिक दिशानिर्देश' : 'Community Guidelines', href: `/${lang}/community-guidelines` },
      ]
    },
    trust: {
      title: isHindi ? 'विश्वास' : 'Trust & Openness',
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
        { label: isHindi ? 'डेटा प्रथाएं' : 'Data Practices', href: `/${lang}/data-practices` },
        { label: isHindi ? 'डेटा अधिकार' : 'Data Rights', href: `/${lang}/data-rights` },
        { label: isHindi ? 'कुकीज़' : 'Cookies', href: `/${lang}/cookies` },
        { label: isHindi ? 'स्वीकार्य उपयोग' : 'Acceptable Use', href: `/${lang}/acceptable-use-policy` },
        { label: isHindi ? 'रिफंड नीति' : 'Refund Policy', href: `/${lang}/refund-policy` },
      ]
    },
    contact: {
      title: isHindi ? 'संपर्क' : 'Connect',
      links: [
        { label: 'Twitter / X', href: 'https://twitter.com/areynetaji' },
        { label: 'Instagram', href: 'https://instagram.com/areynetaji' },
        { label: isHindi ? 'मदद चाहिए?' : 'Contact Support', href: `/${lang}/contact` },
      ]
    }
  }

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto relative overflow-hidden text-sm">
      <FeaturedOn lang={lang} />
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: 'radial-gradient(circle, #0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12 mb-16">
           {/* Brand Column (Span 2 on LG) */}
           <div className="col-span-2 lg:col-span-2 pr-8">
              <Link href={`/${lang}`} className="text-2xl font-black tracking-tighter text-slate-900 mb-4 block hover:opacity-90">
                Sangathan
              </Link>
              <p className="text-slate-500 leading-relaxed mb-6 max-w-sm font-medium text-xs sm:text-sm">
                 {isHindi 
                   ? 'नागरिक डिजिटल बुनियादी ढांचा, बहुजन क्वीर फाउंडेशन (सेक्शन 8 गैर-लाभकारी संगठन) की एक पहल।' 
                   : 'Digital civic infrastructure initiative of Bahujan Queer Foundation, a Section 8 non-profit organization.'}
              </p>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                {isHindi ? 'सभी प्रणालियां सामान्य हैं' : 'All systems operational'}
              </div>
           </div>
           
           {/* Links Columns */}
           {[footerLinks.product, footerLinks.initiative, footerLinks.trust, footerLinks.legal].map((section, idx) => (
             <div key={idx} className="col-span-1">
                 <h4 className="font-bold mb-5 text-slate-900 text-xs uppercase tracking-wider">{section.title}</h4>
                <ul className="space-y-3.5 text-xs sm:text-sm">
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
                       <a href={link.href} target={link.href.startsWith('http') ? "_blank" : undefined} rel="noopener noreferrer" className="text-slate-500 hover:text-indigo-600 transition-colors font-medium text-xs sm:text-sm">
                         {link.label}
                       </a>
                     ) : (
                       <Link href={link.href} className="text-slate-500 hover:text-indigo-600 transition-colors font-medium text-xs sm:text-sm">
                         {link.label}
                       </Link>
                     )}
                   </div>
                ))}
              </div>
           </div>
        </div>
        
        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
           <div className="flex items-center gap-1">
              {isHindi ? 'द्वारा संचालित' : 'Powered by'} 
              <a 
                href="https://ziddi.space" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-700 hover:text-indigo-600 transition-colors font-bold ml-1"
              >
                ziddi
              </a>
           </div>
           
           <div className="text-center md:text-right">
              {isHindi ? 'पहल:' : 'Civic Initiative:'} 
              <span className="text-slate-800 ml-1 font-bold">Bahujan Queer Foundation (Section 8 Non-Profit)</span>
           </div>
        </div>
      </div>
    </footer>
  )
}
