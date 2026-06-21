'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Building2, 
  GraduationCap, 
  HardHat, 
  Home, 
  Users, 
  Vote, 
  Receipt, 
  Megaphone,
  Briefcase,
  AlertTriangle,
  Scale,
  Calendar,
  Lock,
  ArrowRight,
  ShieldCheck,
  ClipboardList,
  CheckSquare,
  Network,
  Headphones,
  BadgeAlert,
  FileText,
  Bell,
  Wallet,
  LineChart,
  Database,
  Ticket,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

// Map icon names as strings to Lucide React components
const iconMap: Record<string, React.ComponentType<any>> = {
  Building2, 
  GraduationCap, 
  HardHat, 
  Home, 
  Users, 
  Vote, 
  Receipt, 
  Megaphone,
  Briefcase,
  AlertTriangle,
  Scale,
  Calendar,
  Lock,
  ArrowRight,
  ShieldCheck,
  ClipboardList,
  CheckSquare,
  Network,
  Headphones,
  BadgeAlert,
  FileText,
  Bell,
  Wallet,
  LineChart,
  Database,
  Ticket
}

interface Feature {
  icon: string
  title: string
  desc: string
}

interface Org {
  id: string
  title: string
  icon: string
  color: string
  description: string
  features: Feature[]
}

interface InteractiveFeaturesProps {
  orgs: Org[]
  isHindi: boolean
  lang: string
}

// Static theme configuration mapped to compile-time Tailwind classes
const orgStyles: Record<string, {
  tabActive: string
  bgLight: string
  bgGlow: string
  text: string
  border: string
  hoverBorder: string
  button: string
  featureActive: string
  iconBg: string
}> = {
  ngo: {
    tabActive: 'border-indigo-600 text-indigo-600 bg-indigo-50/50',
    bgLight: 'bg-indigo-50',
    bgGlow: 'bg-indigo-500/10',
    text: 'text-indigo-600',
    border: 'border-indigo-200',
    hoverBorder: 'hover:border-indigo-400',
    button: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm',
    featureActive: 'bg-indigo-50/80 border-indigo-200 text-indigo-900',
    iconBg: 'bg-indigo-100/80 text-indigo-700'
  },
  'student-union': {
    tabActive: 'border-emerald-600 text-emerald-600 bg-emerald-50/50',
    bgLight: 'bg-emerald-50',
    bgGlow: 'bg-emerald-500/10',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    hoverBorder: 'hover:border-emerald-400',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',
    featureActive: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
    iconBg: 'bg-emerald-100/80 text-emerald-700'
  },
  'worker-union': {
    tabActive: 'border-orange-600 text-orange-600 bg-orange-50/50',
    bgLight: 'bg-orange-50',
    bgGlow: 'bg-orange-500/10',
    text: 'text-orange-600',
    border: 'border-orange-200',
    hoverBorder: 'hover:border-orange-400',
    button: 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm',
    featureActive: 'bg-orange-50/80 border-orange-200 text-orange-900',
    iconBg: 'bg-orange-100/80 text-orange-700'
  },
  rwa: {
    tabActive: 'border-cyan-600 text-cyan-600 bg-cyan-50/50',
    bgLight: 'bg-cyan-50',
    bgGlow: 'bg-cyan-500/10',
    text: 'text-cyan-600',
    border: 'border-cyan-200',
    hoverBorder: 'hover:border-cyan-400',
    button: 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm',
    featureActive: 'bg-cyan-50/80 border-cyan-200 text-cyan-900',
    iconBg: 'bg-cyan-100/80 text-cyan-700'
  }
}

// Helper to extract key benefits from description by splitting on commas/conjunctions
function getBulletPoints(desc: string): string[] {
  const cleaned = desc.replace(/\b(and)\b/gi, ',');
  return cleaned
    .split(/[,;.]/)
    .map(s => s.trim())
    .filter(s => s.length > 3)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1));
}

export function InteractiveFeatures({ orgs, isHindi, lang }: InteractiveFeaturesProps) {
  const [activeTab, setActiveTab] = useState('ngo')
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0)

  // Safe mount-time hash retrieval to prevent hydration mismatches
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash
      if (hash) {
        const tabId = hash.replace('#', '')
        if (orgs.some(org => org.id === tabId)) {
          setActiveTab(tabId)
          setActiveFeatureIndex(0)
        }
      }
    }
    return () => {} // Cleanup function as per rules
  }, [orgs])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setActiveFeatureIndex(0)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${tabId}`)
    }
  }

  const currentOrg = orgs.find(org => org.id === activeTab) || orgs[0]
  const styles = orgStyles[currentOrg.id] || orgStyles.ngo
  const activeFeature = currentOrg.features[activeFeatureIndex] || currentOrg.features[0]

  const OrgIconComponent = iconMap[currentOrg.icon] || Building2
  const ActiveFeatureIcon = iconMap[activeFeature.icon] || ClipboardList

  return (
    <div className="space-y-12 relative z-10">
      {/* Category Tab Navigation */}
      <div className="border-b border-slate-200">
        <div className="flex flex-wrap -mb-px justify-center gap-1 sm:gap-4">
          {orgs.map((org) => {
            const isActive = activeTab === org.id
            const orgTheme = orgStyles[org.id] || orgStyles.ngo
            const TabIcon = iconMap[org.icon] || Building2

            return (
              <button
                key={org.id}
                onClick={() => handleTabChange(org.id)}
                className={`flex items-center gap-2 px-4 py-3 sm:px-6 sm:py-4 border-b-2 font-bold text-xs sm:text-sm transition-all duration-200 rounded-t-xl ${
                  isActive
                    ? orgTheme.tabActive
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <TabIcon size={16} className={isActive ? orgTheme.text : 'text-slate-400'} />
                <span>{org.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Category Hero / Description */}
      <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${styles.bgGlow} rounded-full blur-3xl -z-10`} />
        
        <div className={`inline-flex items-center justify-center p-4 rounded-2xl ${styles.bgLight} ${styles.border} border shadow-sm shrink-0`}>
          <OrgIconComponent className={styles.text} size={36} />
        </div>
        
        <div className="space-y-3 flex-1 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {currentOrg.title}
          </h2>
          <p className="text-slate-600 max-w-2xl text-sm sm:text-base leading-relaxed">
            {currentOrg.description}
          </p>
        </div>

        <div className="shrink-0 pt-2 md:pt-0">
          <Link 
            href={`/${lang}/login?tab=signup`}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 group ${styles.button}`}
          >
            <span>{isHindi ? 'संगठन शुरू करें' : `Start your ${currentOrg.title.replace(/s$/, '')}`}</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Desktop Split-Pane Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Pane: Features List */}
        <div className="lg:col-span-4 space-y-2 max-h-[640px] overflow-y-auto pr-3 border-r border-slate-100">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
            {isHindi ? 'सभी १४ सुविधाएं' : 'All 14 Features'}
          </h3>
          {currentOrg.features.map((feature, index) => {
            const isActive = activeFeatureIndex === index
            const FeatureIcon = iconMap[feature.icon] || ClipboardList

            return (
              <button
                key={index}
                onClick={() => setActiveFeatureIndex(index)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? `${styles.featureActive} border-l-4`
                    : 'border-slate-50/50 hover:border-slate-200 hover:bg-slate-50/50 text-slate-700'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? styles.iconBg : 'bg-slate-100 text-slate-500'}`}>
                  <FeatureIcon size={16} />
                </div>
                <span className="flex-1 truncate">{feature.title}</span>
              </button>
            )
          })}
        </div>

        {/* Right Pane: Feature Details */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between min-h-[500px] relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-64 h-64 ${styles.bgGlow} rounded-full blur-3xl -z-10 pointer-events-none`} />

          <div className="space-y-6">
            <div className={`inline-flex p-3 rounded-xl ${styles.bgLight} ${styles.border} border shadow-sm`}>
              <ActiveFeatureIcon size={24} className={styles.text} />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
                {activeFeature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {activeFeature.desc}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                {isHindi ? 'मुख्य लाभ और क्षमताएं' : 'Key Capabilities & Benefits'}
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getBulletPoints(activeFeature.desc).map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2 text-slate-600">
                    <ShieldCheck size={16} className={`${styles.text} mt-0.5 shrink-0`} />
                    <span className="text-sm leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
            <div className="text-xs text-slate-400">
              {isHindi ? 'संगठन द्वारा सुरक्षित और संकलित' : 'Secured and integrated by Sangathan'}
            </div>
            <Link 
              href={`/${lang}/login?tab=signup`}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 group ${styles.button}`}
            >
              <span>{isHindi ? 'आरंभ करें' : `Start your ${currentOrg.title.replace(/s$/, '')}`}</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile / Accordion Fallback */}
      <div className="lg:hidden space-y-3">
        {currentOrg.features.map((feature, index) => {
          const isActive = activeFeatureIndex === index
          const FeatureIcon = iconMap[feature.icon] || ClipboardList

          return (
            <div 
              key={index}
              className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                isActive ? `border-slate-200 bg-white shadow-sm` : 'border-slate-100/70 bg-slate-50/20'
              }`}
            >
              <button
                onClick={() => setActiveFeatureIndex(isActive ? -1 : index)}
                className="w-full flex items-center justify-between p-4 font-bold text-slate-900 text-left text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? styles.iconBg : 'bg-slate-100 text-slate-500'}`}>
                    <FeatureIcon size={16} />
                  </div>
                  <span>{feature.title}</span>
                </div>
                {isActive ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
              </button>

              {isActive && (
                <div className="p-4 pt-0 border-t border-slate-100 space-y-4">
                  <p className="text-sm text-slate-600 leading-relaxed mt-3">
                    {feature.desc}
                  </p>

                  <div className="space-y-2 border-t border-slate-50 pt-3">
                    {getBulletPoints(feature.desc).map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-slate-600">
                        <ShieldCheck size={14} className={`${styles.text} mt-0.5 shrink-0`} />
                        <span className="text-xs">{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link 
                      href={`/${lang}/login?tab=signup`}
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 group ${styles.button}`}
                    >
                      <span>{isHindi ? 'आरंभ करें' : `Start your ${currentOrg.title.replace(/s$/, '')}`}</span>
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
