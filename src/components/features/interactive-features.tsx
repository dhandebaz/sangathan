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
  ChevronUp,
  Globe,
  Award,
  Smartphone,
  Sparkles,
  ShieldAlert,
  Printer,
  BadgeCheck,
  UserCheck,
  Zap,
  Shield,
  Activity,
  Clock,
  Newspaper
} from 'lucide-react'

// Map icon names as strings to Lucide React components
const iconMap: Record<string, React.ElementType> = {
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
  Globe,
  Award,
  Smartphone,
  Sparkles,
  ShieldAlert,
  Printer,
  BadgeCheck,
  UserCheck,
  Zap,
  Shield,
  Activity,
  Clock,
  Newspaper
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
  civic_collective: {
    tabActive: 'border-rose-600 text-rose-600 bg-rose-50/50',
    bgLight: 'bg-rose-50',
    bgGlow: 'bg-rose-500/10',
    text: 'text-rose-600',
    border: 'border-rose-200',
    hoverBorder: 'hover:border-rose-400',
    button: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs',
    featureActive: 'bg-rose-50/80 border-rose-200 text-rose-900',
    iconBg: 'bg-rose-100/80 text-rose-700'
  },
  ngo: {
    tabActive: 'border-emerald-600 text-emerald-600 bg-emerald-50/50',
    bgLight: 'bg-emerald-50',
    bgGlow: 'bg-emerald-500/10',
    text: 'text-emerald-600',
    border: 'border-emerald-200',
    hoverBorder: 'hover:border-emerald-400',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
    featureActive: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
    iconBg: 'bg-emerald-100/80 text-emerald-700'
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
  const defaultOrgId = orgs[0]?.id || 'civic_collective'
  const [activeTab, setActiveTab] = useState(defaultOrgId)
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
    return () => {}
  }, [orgs])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setActiveFeatureIndex(0)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${tabId}`)
    }
  }

  const currentOrg = orgs.find(org => org.id === activeTab) || orgs[0]
  const styles = orgStyles[currentOrg.id] || orgStyles.civic_collective
  const activeFeature = currentOrg.features[activeFeatureIndex] || currentOrg.features[0]

  const OrgIconComponent = iconMap[currentOrg.icon] || Building2
  const ActiveFeatureIcon = iconMap[activeFeature.icon] || ClipboardList

  return (
    <div className="space-y-10 relative z-10">
      {/* Category Tab Navigation */}
      <div className="border-b border-slate-200 overflow-x-auto scrollbar-none">
        <div className="flex -mb-px justify-start sm:justify-center gap-1 sm:gap-3 min-w-max pb-1">
          {orgs.map((org) => {
            const isActive = activeTab === org.id
            const orgTheme = orgStyles[org.id] || orgStyles.civic_collective
            const TabIcon = iconMap[org.icon] || Building2

            return (
              <button
                key={org.id}
                onClick={() => handleTabChange(org.id)}
                className={`flex items-center gap-2 px-3.5 py-3 sm:px-5 sm:py-3.5 border-b-2 font-bold text-xs sm:text-sm transition-all duration-200 rounded-t-lg shrink-0 ${
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
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-7 flex flex-col md:flex-row items-center gap-5 sm:gap-6 shadow-xs relative overflow-hidden">
        <div className={`inline-flex items-center justify-center p-3.5 rounded-lg ${styles.bgLight} ${styles.border} border shadow-xs shrink-0`}>
          <OrgIconComponent className={styles.text} size={32} />
        </div>
        
        <div className="space-y-2 flex-1 text-center md:text-left">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {currentOrg.title}
          </h2>
          <p className="text-slate-600 max-w-2xl text-xs sm:text-sm leading-relaxed font-normal">
            {currentOrg.description}
          </p>
        </div>

        <div className="shrink-0 pt-2 md:pt-0 w-full md:w-auto">
          <Link 
            href={`/${lang}/login?tab=signup`}
            className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-bold text-xs transition-all duration-200 group ${styles.button}`}
          >
            <span>{isHindi ? 'संगठन शुरू करें' : `Start your ${currentOrg.title.replace(/s$/, '')}`}</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Desktop Split-Pane Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Features List */}
        <div className="lg:col-span-5 space-y-1.5 max-h-[600px] overflow-y-auto pr-2 border-r border-slate-200">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
            {isHindi ? `सभी ${currentOrg.features.length} सुविधाएं` : `All ${currentOrg.features.length} Features & Ground Tools`}
          </h3>
          {currentOrg.features.map((feature, index) => {
            const isActive = activeFeatureIndex === index
            const FeatureIcon = iconMap[feature.icon] || ClipboardList

            return (
              <button
                key={index}
                onClick={() => setActiveFeatureIndex(index)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-md border text-left font-semibold text-xs transition-all duration-150 ${
                  isActive
                    ? `${styles.featureActive} border-l-4 shadow-2xs`
                    : 'border-slate-200/60 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className={`p-1.5 rounded shrink-0 ${isActive ? styles.iconBg : 'bg-slate-100 text-slate-500'}`}>
                  <FeatureIcon size={14} />
                </div>
                <span className="flex-1 truncate">{feature.title}</span>
              </button>
            )
          })}
        </div>

        {/* Right Pane: Feature Details */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-7 shadow-xs flex flex-col justify-between min-h-[480px]">
          <div className="space-y-5">
            <div className={`inline-flex p-3 rounded-lg ${styles.bgLight} ${styles.border} border shadow-2xs`}>
              <ActiveFeatureIcon size={22} className={styles.text} />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">
                {activeFeature.title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {activeFeature.desc}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-3">
                {isHindi ? 'मुख्य लाभ और क्षमताएं' : 'Key Capabilities & Operational Ground Value'}
              </h4>
              <ul className="grid grid-cols-1 gap-2.5">
                {getBulletPoints(activeFeature.desc).map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2 text-slate-600 text-xs">
                    <ShieldCheck size={15} className={`${styles.text} mt-0.5 shrink-0`} />
                    <span className="leading-normal">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 mt-6 flex justify-between items-center text-xs">
            <div className="text-[11px] text-slate-400 font-mono">
              {isHindi ? 'संगठन द्वारा सुरक्षित और सत्यापित' : 'Secured and verified by Sangathan OS'}
            </div>
            <Link 
              href={`/${lang}/login?tab=signup`}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-bold text-xs transition-all duration-200 group ${styles.button}`}
            >
              <span>{isHindi ? 'आरंभ करें' : `Launch Workspace`}</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile / Accordion Fallback (Ultra-Smooth Touch Optimised) */}
      <div className="lg:hidden space-y-2.5">
        {currentOrg.features.map((feature, index) => {
          const isActive = activeFeatureIndex === index
          const FeatureIcon = iconMap[feature.icon] || ClipboardList

          return (
            <div 
              key={index}
              className={`border rounded-lg transition-all duration-200 overflow-hidden ${
                isActive ? `border-slate-300 bg-white shadow-xs` : 'border-slate-200 bg-slate-50/40'
              }`}
            >
              <button
                onClick={() => setActiveFeatureIndex(isActive ? -1 : index)}
                className="w-full flex items-center justify-between p-3.5 font-bold text-slate-900 text-left text-xs min-h-[48px]"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className={`p-1.5 rounded shrink-0 ${isActive ? styles.iconBg : 'bg-slate-200/80 text-slate-600'}`}>
                    <FeatureIcon size={15} />
                  </div>
                  <span className="truncate">{feature.title}</span>
                </div>
                {isActive ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
              </button>

              {isActive && (
                <div className="p-4 pt-0 border-t border-slate-100 space-y-3.5">
                  <p className="text-xs text-slate-600 leading-relaxed mt-2.5 font-normal">
                    {feature.desc}
                  </p>

                  <div className="space-y-1.5 border-t border-slate-100 pt-2.5">
                    {getBulletPoints(feature.desc).map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-slate-600">
                        <ShieldCheck size={14} className={`${styles.text} mt-0.5 shrink-0`} />
                        <span className="text-[11px] leading-tight">{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-1.5">
                    <Link 
                      href={`/${lang}/login?tab=signup`}
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-bold text-xs transition-all duration-200 group ${styles.button} min-h-[44px]`}
                    >
                      <span>{isHindi ? 'आरंभ करें' : `Launch for ${currentOrg.title.replace(/s$/, '')}`}</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
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
