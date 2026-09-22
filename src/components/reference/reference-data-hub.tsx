'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getAllStates, searchDistricts } from '@/lib/geo/india'
import {
  NGO_SDG_SECTORS,
  NGO_TAX_EXEMPTIONS,
} from '@/lib/data/org-master-data'
import {
  MapPin,
  Building2,
  Search,
  Copy,
  Layers,
} from 'lucide-react'
import { toast } from 'sonner'

interface ReferenceDataHubProps {
  lang: string
  orgType: string
}

export function ReferenceDataHub({ lang, orgType }: ReferenceDataHubProps) {
  const isHindi = lang === 'hi'
  const [activeTab, setActiveTab] = useState<'geo' | 'ngo'>('geo')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStateCode, setSelectedStateCode] = useState<string>('IN-DL')

  const states = getAllStates()
  const activeState = states.find((s) => s.code === selectedStateCode) || states[0]

  const filteredDistricts = (activeState?.districts || []).filter((d) =>
    !searchQuery || d.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function copyText(text: string) {
    navigator.clipboard.writeText(text)
    toast.success(isHindi ? 'क्लिपबोर्ड पर कॉपी किया गया' : 'Copied to clipboard')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700 mb-1">
          <Layers className="w-4 h-4" />
          {isHindi ? 'राष्ट्रीय मास्टर संदर्भ व भौगोलिक डेटा' : 'National Master Reference & Geo Engine'}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {isHindi ? 'मानकीकृत राज्य, जिला एवं संगठनात्मक वर्गीकरण' : 'Standardized Master Datasets & Taxonomies'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isHindi
            ? 'भारत के सभी 28 राज्यों, 8 केंद्र शासित प्रदेशों और 780+ जिलों के साथ-साथ एनजीओ के लिए आधिकारिक मास्टर डेटा।'
            : 'Pre-populated national geographic registry (28 States, 8 UTs, 780+ Districts) and standardized statutory taxonomies tailored for civic organizing.'}
        </p>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'geo', labelEn: 'States & Districts (780+)', labelHi: 'राज्य व जिले (780+)', icon: MapPin },
          { id: 'ngo', labelEn: 'NGO & SDG Taxonomies', labelHi: 'एनजीओ व SDG वर्गीकरण', icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any)
                setSearchQuery('')
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {isHindi ? tab.labelHi : tab.labelEn}
            </button>
          )
        })}
      </div>

      {/* TAB 1: States & Districts */}
      {activeTab === 'geo' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border border-slate-200 bg-white">
              <CardContent className="p-4">
                <div className="text-2xl font-extrabold text-slate-900">{states.length}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{isHindi ? 'कुल राज्य व केंद्र शासित प्रदेश' : 'Total States & Union Territories'}</div>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 bg-white">
              <CardContent className="p-4">
                <div className="text-2xl font-extrabold text-orange-700">
                  {states.reduce((acc, s) => acc + s.districts.length, 0)}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{isHindi ? 'सत्यापित प्रशासनिक जिले' : 'Standardized Administrative Districts'}</div>
              </CardContent>
            </Card>
            <Card className="border border-slate-200 bg-white">
              <CardContent className="p-4">
                <div className="text-2xl font-extrabold text-emerald-700">100% E.164</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{isHindi ? 'राष्ट्रीय कोड अनुरूपता' : 'ISO 3166-2:IN Standard Compliant'}</div>
              </CardContent>
            </Card>
          </div>

          {/* State Selector & District Browser */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: States List */}
            <Card className="border border-slate-200 bg-white lg:col-span-1">
              <CardHeader className="p-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">
                  {isHindi ? 'राज्य / केंद्र शासित प्रदेश चुनें' : 'Select State / Union Territory'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 max-h-[500px] overflow-y-auto space-y-1">
                {states.map((s) => {
                  const isSelected = selectedStateCode === s.code
                  return (
                    <button
                      key={s.code}
                      onClick={() => setSelectedStateCode(s.code)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-orange-50 text-orange-950 border border-orange-200 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{isHindi ? s.nameHi : s.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                        {s.districts.length} {isHindi ? 'जिले' : 'districts'}
                      </span>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Right: Districts in Selected State */}
            <Card className="border border-slate-200 bg-white lg:col-span-2">
              <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    {isHindi ? activeState.nameHi : activeState.name} ({activeState.code})
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    {activeState.districts.length} {isHindi ? 'आधिकारिक जिले सूचीबद्ध' : 'administrative districts mapped'}
                  </CardDescription>
                </div>
                <div className="relative w-48">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isHindi ? 'जिला खोजें...' : 'Filter districts...'}
                    className="text-xs pl-8 h-8 rounded-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[450px] overflow-y-auto pr-1">
                  {filteredDistricts.map((district, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all flex items-center justify-between text-xs text-slate-800"
                    >
                      <span className="truncate font-medium">{district}</span>
                      <button
                        onClick={() => copyText(district)}
                        title="Copy district name"
                        className="text-slate-400 hover:text-slate-700 p-1"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: NGO & SDG Master Data */}
      {activeTab === 'ngo' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">
              {isHindi ? 'संयुक्त राष्ट्र सतत विकास लक्ष्य (UN SDGs) व नीति आयोग प्राथमिकताएं' : 'UN Sustainable Development Goals (SDGs) & Sector Codes'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {NGO_SDG_SECTORS.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                        {item.code}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{isHindi ? item.nameHi : item.nameEn}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{item.category}</p>
                  </div>
                  <button onClick={() => copyText(item.code || '')} className="text-slate-400 hover:text-slate-700 p-1">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">
              {isHindi ? 'वैधानिक आयकर छूट व विनियामक पंजीकरण' : 'Statutory Tax Exemptions & Compliance Formats'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {NGO_TAX_EXEMPTIONS.map((item) => (
                <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 text-orange-900 border border-orange-200 font-mono">
                        {item.code}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{isHindi ? item.nameHi : item.nameEn}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{isHindi ? item.descriptionHi : item.descriptionEn}</p>
                  </div>
                  <button onClick={() => copyText(item.code || '')} className="text-slate-400 hover:text-slate-700 p-1">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
