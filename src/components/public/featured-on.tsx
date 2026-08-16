import React from 'react'
import { ArrowUpRight } from 'lucide-react'

interface FeaturedOnProps {
  lang: string
}

export function FeaturedOn({ lang }: FeaturedOnProps) {
  const isHindi = lang === 'hi'

  const platforms = [
    {
      name: 'Product Hunt',
      category: isHindi ? 'वैश्विक उत्पाद खोज' : 'Global Product Launch',
      url: 'https://www.producthunt.com', // To be updated with exact launch slug
      isLive: false,
      badgeText: isHindi ? 'जल्द आ रहा है' : 'Upcoming Launch',
      logo: (
        <svg viewBox="0 0 32 32" className="w-5 h-5 shrink-0" fill="none">
          <circle cx="16" cy="16" r="16" fill="#DA552F" />
          <path
            d="M13.5 9H19C21.4853 9 23.5 11.0147 23.5 13.5C23.5 15.9853 21.4853 18 19 18H16.5V23H13.5V9ZM16.5 15.5H19C20.1046 15.5 21 14.6046 21 13.5C21 12.3954 20.1046 11.5 19 11.5H16.5V15.5Z"
            fill="#FFFFFF"
          />
        </svg>
      ),
    },
    {
      name: 'SaaSHub',
      category: isHindi ? 'सॉफ्टवेयर विकल्प व तुलना' : 'Alternative & Comparisons',
      url: 'https://www.saashub.com/sangathan-alternatives',
      isLive: true,
      badgeText: isHindi ? 'सत्यापित विकल्प' : 'Verified Alternative',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none">
          <rect width="24" height="24" rx="6" fill="#2D7FF9" />
          <path
            d="M6.5 15.5L12 6.5L17.5 15.5H14L12 11.8L10 15.5H6.5Z"
            fill="#FFFFFF"
          />
          <circle cx="12" cy="16.5" r="1.5" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      name: 'Peerlist',
      category: isHindi ? 'टेक व बिल्डर समुदाय' : 'Tech & Builder Ecosystem',
      url: 'https://peerlist.io/areynetaji/project/sangathan',
      isLive: true,
      badgeText: isHindi ? 'प्रोजेक्ट स्पॉटलाइट' : 'Project Spotlight',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none">
          <rect width="24" height="24" rx="6" fill="#00AA45" />
          <path
            d="M7 6.5H14C16.4853 6.5 18.5 8.51472 18.5 11C18.5 13.4853 16.4853 15.5 14 15.5H10.5V18.5H7V6.5ZM10.5 12H14C14.5523 12 15 11.5523 15 11C15 10.4477 14.5523 10 14 10H10.5V12Z"
            fill="#FFFFFF"
          />
        </svg>
      ),
    },
    {
      name: 'Indie Hackers',
      category: isHindi ? 'स्वतंत्र उत्पाद मंच' : 'Independent Product Hub',
      url: 'https://www.indiehackers.com/product/sangathan',
      isLive: true,
      badgeText: isHindi ? 'बिल्डर प्रोफाइल' : 'Builder Profile',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none">
          <rect width="24" height="24" rx="6" fill="#0E2439" />
          <path
            d="M6.5 7H9V17H6.5V7ZM15 7H17.5V17H15V7ZM9.5 11H14.5V13H9.5V11Z"
            fill="#FFFFFF"
          />
        </svg>
      ),
    },
    {
      name: 'Uneed',
      category: isHindi ? 'सर्वश्रेष्ठ उपकरण संग्रह' : 'Curated Tool Directory',
      url: 'https://www.uneed.best/tool/sangathan',
      isLive: true,
      badgeText: isHindi ? 'सूचीबद्ध टूल' : 'Listed Tool',
      logo: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none">
          <rect width="24" height="24" rx="6" fill="#6366F1" />
          <path
            d="M7.5 7V13C7.5 15.4853 9.51472 17.5 12 17.5C14.4853 17.5 16.5 15.4853 16.5 13V7H13.5V13C13.5 13.8284 12.8284 14.5 12 14.5C11.1716 14.5 10.5 13.8284 10.5 13V7H7.5Z"
            fill="#FFFFFF"
          />
        </svg>
      ),
    },
  ]

  return (
    <section className="bg-slate-50/80 border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">
              {isHindi ? 'सार्वजनिक सत्यापन व निर्देशिका' : 'Public Discovery & Directory Verification'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isHindi ? 'संगठन इन प्रमुख तकनीकी व सॉफ्टवेयर प्लेटफॉर्म्स पर सूचीबद्ध है' : 'Featured & Indexed Across Premier Tech Catalogs'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md font-medium">
            {isHindi
              ? 'वैश्विक खोज इंजनों, ओपन-सोर्स नेटवर्क और सॉफ्टवेयर निर्देशिकाओं में स्वतंत्र रूप से सत्यापित नागरिक बुनियादी ढांचा।'
              : 'Independently indexed digital public infrastructure across global software directories, civic tech trackers, and open ecosystems.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {platforms.map((platform) => {
            const cardContent = (
              <div className="h-full bg-white border border-slate-200 hover:border-indigo-400 p-4 rounded-lg transition-all flex flex-col justify-between group shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      {platform.logo}
                      <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {platform.name}
                      </span>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    {platform.category}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-600 font-semibold">{platform.badgeText}</span>
                  <span className="text-indigo-600 font-bold group-hover:underline">
                    {platform.isLive ? (isHindi ? 'देखें →' : 'View →') : (isHindi ? 'आगामी' : 'Soon')}
                  </span>
                </div>
              </div>
            )

            return platform.isLive ? (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${platform.name} - ${platform.category}`}
                className="block focus:outline-hidden focus:ring-2 focus:ring-indigo-500 rounded-lg"
              >
                {cardContent}
              </a>
            ) : (
              <div
                key={platform.name}
                title={`${platform.name} - ${platform.badgeText}`}
                className="block cursor-default"
              >
                {cardContent}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
