import Link from 'next/link'

export function Footer({ lang }: { lang: string }) {
  const isHindi = lang === 'hi'
  
  const footerLinks = {
    product: {
      title: isHindi ? 'उत्पाद' : 'Product',
      links: [
        { label: isHindi ? 'विशेषताएं' : 'Features', href: `/${lang}/#features` },
        { label: isHindi ? 'रोडमैप' : 'Roadmap', href: `/${lang}/roadmap` },
        { label: isHindi ? 'परिवर्तन लॉग' : 'Changelog', href: `/${lang}/changelog` },
        { label: isHindi ? 'सिस्टम स्थिति' : 'System Status', href: `/${lang}/status` },
      ]
    },
    trust: {
      title: isHindi ? 'विश्वास' : 'Trust',
      links: [
        { label: isHindi ? 'शासन' : 'Governance', href: `/${lang}/governance` },
        { label: isHindi ? 'सुरक्षा' : 'Security', href: `/${lang}/security` },
        { label: isHindi ? 'पारदर्शिता' : 'Transparency', href: `/${lang}/transparency` },
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
      ]
    },
    contact: {
      title: isHindi ? 'संपर्क' : 'Contact',
      links: [
        { label: 'Email', href: 'mailto:hello@sangathan.space' },
        { label: 'Twitter / X', href: 'https://twitter.com/areynetaji' },
        { label: 'Instagram', href: 'https://instagram.com/areynetaji' },
        { label: isHindi ? 'मदद चाहिए?' : 'Need Help?', href: `/${lang}/contact` },
      ]
    }
  }

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border-subtle)] mt-auto pt-16 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
           {/* Brand Column (Span 2 on LG) */}
           <div className="col-span-2 md:col-span-2 lg:col-span-2 pr-8">
              <Link href={`/${lang}`} className="text-2xl font-bold tracking-tight text-[var(--text-primary)] mb-4 block hover:opacity-90">
                Sangathan
              </Link>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-6 max-w-sm">
                 {isHindi 
                   ? 'जमीनी संगठनों के लिए डिजिटल बुनियादी ढांचा। न्यूनतम, शांत और गोपनीयता के लिए निर्मित।' 
                   : 'Digital infrastructure for grassroots organisations. Built for privacy, autonomy, and institutional integrity.'}
              </p>
           </div>
           
           {/* Links Columns */}
           <div className="col-span-1">
              <h4 className="font-bold mb-4 text-[var(--text-primary)]">{footerLinks.product.title}</h4>
              <ul className="space-y-3">
                 {footerLinks.product.links.map((link) => (
                   <li key={link.href}>
                     <Link href={link.href} className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                       {link.label}
                     </Link>
                   </li>
                 ))}
              </ul>
           </div>

           <div className="col-span-1">
              <h4 className="font-bold mb-4 text-[var(--text-primary)]">{footerLinks.trust.title}</h4>
              <ul className="space-y-3">
                 {footerLinks.trust.links.map((link) => (
                   <li key={link.href}>
                     <Link href={link.href} className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                       {link.label}
                     </Link>
                   </li>
                 ))}
              </ul>
           </div>

           <div className="col-span-1">
              <h4 className="font-bold mb-4 text-[var(--text-primary)]">{footerLinks.legal.title}</h4>
              <ul className="space-y-3">
                 {footerLinks.legal.links.map((link) => (
                   <li key={link.href}>
                     <Link href={link.href} className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                       {link.label}
                     </Link>
                   </li>
                 ))}
              </ul>
           </div>

           <div className="col-span-1">
              <h4 className="font-bold mb-4 text-[var(--text-primary)]">{footerLinks.contact.title}</h4>
              <ul className="space-y-3">
                 {footerLinks.contact.links.map((link) => (
                   <li key={link.href}>
                     {link.href.startsWith('http') || link.href.startsWith('mailto') ? (
                       <a href={link.href} target={link.href.startsWith('http') ? "_blank" : undefined} rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                         {link.label}
                       </a>
                     ) : (
                       <Link href={link.href} className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                         {link.label}
                       </Link>
                     )}
                   </li>
                 ))}
              </ul>
           </div>
        </div>
        
        {/* Bottom Strip */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-[var(--text-secondary)]">
           <div className="flex items-center gap-1">
              {isHindi ? 'द्वारा संचालित' : 'Powered by'} 
              <a 
                href="https://ziddi.space" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors font-bold ml-1"
              >
                ziddi
              </a>
           </div>
           
           <div className="text-center md:text-right">
              {isHindi ? 'एक पहल' : 'An Initiative by'} 
              <span className="text-[var(--text-primary)] ml-1 font-semibold">Bahujan Queer Foundation</span>
           </div>
        </div>
      </div>
    </footer>
  )
}
