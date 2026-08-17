'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Sparkles, RefreshCw, Download, Save, Check, X,
  Shield, Palette, Layout, Award, FileText, CheckCircle2,
  Loader2, ArrowRight, Type, Compass, Landmark, Flame,
  Briefcase, Trees, Users2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OrgType } from '@/lib/org-types'
import { LogoStyle, ColorTheme, CenterType, FontStyle, SymbolCategory } from '@/lib/logo-generator/types'
import { COLOR_PALETTES, HERALDIC_SYMBOLS } from '@/lib/logo-generator/symbols-and-palettes'
import { generateLogoSvg, rasterizeSvgToPng } from '@/lib/logo-generator/vector-engine'
import { analyzeOrganizationIdentity } from '@/lib/logo-generator/smart-analyzer'
import { saveGeneratedLogoAction } from '@/actions/organisation/logo-generator'
import { toast } from 'sonner'

export interface LogoGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  orgName: string
  orgType: OrgType
  orgId?: string
  orgSlug?: string
  stateOrCity?: string
  establishedYear?: string
  lang?: string
  onLogoSelected?: (logoUrl: string, dataUrl: string) => void
}

export function LogoGeneratorModal({
  isOpen,
  onClose,
  orgName = 'My Organisation',
  orgType = 'civic_collective',
  orgId,
  orgSlug = 'org',
  stateOrCity = 'India',
  establishedYear = new Date().getFullYear().toString(),
  lang = 'en',
  onLogoSelected,
}: LogoGeneratorModalProps) {
  const isHindi = lang === 'hi'

  // Smart Analysis based on Organization Name & Type
  const smartAnalysis = useMemo(() => {
    return analyzeOrganizationIdentity(orgName, orgType, stateOrCity)
  }, [orgName, orgType, stateOrCity])

  const [activeTab, setActiveTab] = useState<'presets' | 'structure' | 'symbol' | 'palette' | 'typography'>('presets')
  const [name, setName] = useState(orgName)
  const [tagline, setTagline] = useState(smartAnalysis.suggestedTaglinesEn[0] || 'DEMOCRATIC SOVEREIGNTY')
  const [year, setYear] = useState(establishedYear)
  const [location, setLocation] = useState(stateOrCity)
  const [style, setStyle] = useState<LogoStyle>(smartAnalysis.presets[0]?.style || 'circular_seal')
  const [colorTheme, setColorTheme] = useState<ColorTheme>(smartAnalysis.presets[0]?.colorTheme || 'sovereign_navy')
  const [centerType, setCenterType] = useState<CenterType>(smartAnalysis.presets[0]?.centerType || 'symbol')
  const [selectedSymbolId, setSelectedSymbolId] = useState<string>(smartAnalysis.presets[0]?.symbolId || 'scales_of_justice')
  const [customInitials, setCustomInitials] = useState<string>(smartAnalysis.monogram)
  const [fontStyle, setFontStyle] = useState<FontStyle>('sans')
  const [symbolCategoryFilter, setSymbolCategoryFilter] = useState<SymbolCategory | 'all'>('all')
  const [previewBg, setPreviewBg] = useState<'letterhead' | 'light' | 'dark'>('letterhead')

  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Sync props on change
  useEffect(() => {
    setName(orgName || 'My Organisation')
    setLocation(stateOrCity || 'India')
    setYear(establishedYear || new Date().getFullYear().toString())
    setCustomInitials(smartAnalysis.monogram)
    if (smartAnalysis.presets[0]) {
      setStyle(smartAnalysis.presets[0].style)
      setColorTheme(smartAnalysis.presets[0].colorTheme)
      setSelectedSymbolId(smartAnalysis.presets[0].symbolId)
      setTagline(smartAnalysis.presets[0].tagline)
    }
  }, [orgName, stateOrCity, establishedYear, smartAnalysis])

  // Filtered symbols
  const displayedSymbols = useMemo(() => {
    if (symbolCategoryFilter === 'all') return HERALDIC_SYMBOLS
    return HERALDIC_SYMBOLS.filter((s) => s.themeCategory === symbolCategoryFilter)
  }, [symbolCategoryFilter])

  // Generate SVG in real time
  const svgContent = useMemo(() => {
    return generateLogoSvg({
      orgName: name,
      orgType,
      tagline,
      establishedYear: year,
      stateOrCity: location,
      style,
      colorTheme,
      symbolId: selectedSymbolId,
      centerType,
      customInitials,
      fontStyle,
    })
  }, [name, orgType, tagline, year, location, style, colorTheme, selectedSymbolId, centerType, customInitials, fontStyle])

  // Apply a smart preset
  const handleApplyPreset = (preset: (typeof smartAnalysis.presets)[0]) => {
    setStyle(preset.style)
    setColorTheme(preset.colorTheme)
    setSelectedSymbolId(preset.symbolId)
    setCenterType(preset.centerType)
    setTagline(preset.tagline)
    toast.success(
      isHindi
        ? `"${preset.titleHi}" प्रीसेट लागू किया गया!`
        : `Applied "${preset.title}" smart preset!`
    )
  }

  // Shuffle / Generate Again
  const handleGenerateAgain = () => {
    const allStyles: LogoStyle[] = [
      'circular_seal',
      'movement_shield',
      'vintage_laurel',
      'modern_crest',
      'hexagon_insignia',
      'official_stamp',
      'minimal_monogram',
    ]
    const allThemes: ColorTheme[] = [
      'sovereign_navy',
      'royal_indigo',
      'grassroots_emerald',
      'crimson_flame',
      'earth_terracotta',
      'inquilab_saffron',
      'forest_gold',
      'ink_monochrome',
    ]

    const randomStyle = allStyles[Math.floor(Math.random() * allStyles.length)]
    const randomTheme = allThemes[Math.floor(Math.random() * allThemes.length)]
    const randomSymbol = HERALDIC_SYMBOLS[Math.floor(Math.random() * HERALDIC_SYMBOLS.length)]
    const randomTaglines = isHindi ? smartAnalysis.suggestedTaglinesHi : smartAnalysis.suggestedTaglinesEn
    const randomTagline = randomTaglines[Math.floor(Math.random() * randomTaglines.length)] || tagline

    setStyle(randomStyle)
    setColorTheme(randomTheme)
    if (randomSymbol) setSelectedSymbolId(randomSymbol.id)
    if (randomTagline) setTagline(randomTagline)
    toast.info(isHindi ? 'नया स्मार्ट डिज़ाइन तैयार किया गया!' : 'Generated fresh smart design!')
  }

  // Download High-Resolution 2048x2048 PNG
  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const { blob } = await rasterizeSvgToPng(svgContent, 2048)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${orgSlug || 'sangathan'}-official-emblem.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success(
        isHindi
          ? 'उच्च रिज़ॉल्यूशन (2048px) लोगो डाउनलोड हो गया!'
          : 'High-resolution 2048px emblem downloaded successfully!'
      )
    } catch {
      toast.error(isHindi ? 'डाउनलोड करने में विफल।' : 'Failed to download logo.')
    } finally {
      setIsDownloading(false)
    }
  }

  // Save to Sangathan & Use Logo
  const handleSaveAndUse = async () => {
    setIsSaving(true)
    try {
      const { dataUrl } = await rasterizeSvgToPng(svgContent, 1024)

      if (orgId) {
        const res = await saveGeneratedLogoAction({
          orgId,
          base64Data: dataUrl,
        })

        if (!res.success) {
          throw new Error(res.error || 'Failed to save logo to organisation')
        }

        if (onLogoSelected && res.publicUrl) {
          onLogoSelected(res.publicUrl, dataUrl)
        }

        toast.success(
          isHindi
            ? 'लोगो संगठन में सफलतापूर्वक सेव और लागू कर दिया गया!'
            : 'Emblem saved to Sangathan and applied to organisation!'
        )
      } else {
        if (onLogoSelected) {
          onLogoSelected(dataUrl, dataUrl)
        }
        toast.success(
          isHindi
            ? 'लोगो आपके नए संगठन प्रोफ़ाइल के लिए चयनित हो गया!'
            : 'Emblem selected for your new organisation profile!'
        )
      }

      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save logo.'
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  const styleItems = [
    { id: 'circular_seal', title: 'Circular Seal', titleHi: 'संवैधानिक गोल मोहर', desc: 'Statutory Double-Ring Medallion' },
    { id: 'movement_shield', title: 'Movement Shield', titleHi: 'आंदोलन रक्षा ढाल', desc: 'Heraldic Badge with Banner' },
    { id: 'vintage_laurel', title: 'Vintage Laurel', titleHi: 'पुष्पचक्र एम्बलम', desc: 'Prestige Wreath of Honor' },
    { id: 'modern_crest', title: 'Modern Crest', titleHi: 'आधुनिक क्रेस्ट', desc: 'Geometric Rounded Octagon' },
    { id: 'hexagon_insignia', title: 'Hexagon Badge', titleHi: 'षट्कोण इंसीग्निया', desc: 'Constitutional 6-Sided Shield' },
    { id: 'official_stamp', title: 'Letterhead Stamp', titleHi: 'लेटरहेड रबर स्टांप', desc: 'Minimalist Official Ink Stamp' },
    { id: 'minimal_monogram', title: 'Monogram Badge', titleHi: 'मोनोग्राम बैज', desc: 'Bold Initials & Typographic Circle' },
  ]

  const categoryPills: Array<{ id: SymbolCategory | 'all'; label: string; labelHi: string; icon: React.ReactNode }> = [
    { id: 'all', label: 'All Motifs', labelHi: 'सभी', icon: <Sparkles className="w-3 h-3" /> },
    { id: 'justice_rights', label: 'Justice & Law', labelHi: 'न्याय व विधि', icon: <Landmark className="w-3 h-3" /> },
    { id: 'liberty_resistance', label: 'Resistance & Torch', labelHi: 'मशाल व क्रांति', icon: <Flame className="w-3 h-3" /> },
    { id: 'environment_land', label: 'Land & Ecology', labelHi: 'माटी व पर्यावरण', icon: <Trees className="w-3 h-3" /> },
    { id: 'knowledge_youth', label: 'Youth & Education', labelHi: 'छात्र व चेतना', icon: <Award className="w-3 h-3" /> },
    { id: 'labor_industry', label: 'Labor & Workers', labelHi: 'श्रम व उद्योग', icon: <Briefcase className="w-3 h-3" /> },
    { id: 'community_solidarity', label: 'Community & Housing', labelHi: 'समुदाय व आवास', icon: <Users2 className="w-3 h-3" /> },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-5xl bg-white border border-slate-200 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-sm bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  {isHindi ? 'स्मार्ट संगठन लोगो व मोहर डिज़ाइनर' : 'Smart Organization Emblem & Insignia Studio'}
                </h2>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-xs bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {smartAnalysis.detectedTheme}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {isHindi
                  ? 'आपके संगठन नाम और स्वरूप के अनुरूप स्वतः अनुकूलित वेक्टर मोहर'
                  : 'Tailored vector insignia analyzed dynamically from your organization name & identity'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-sm hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live High-DPI Vector Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between space-y-4">
            <div className="w-full space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span className="font-bold text-slate-700">{isHindi ? 'लाइव वेक्टर प्रीव्यू' : 'Live Vector Preview'}</span>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-sm border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPreviewBg('letterhead')}
                    className={`px-2 py-0.5 text-[10px] rounded-xs font-bold transition ${
                      previewBg === 'letterhead' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Letterhead
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewBg('light')}
                    className={`px-2 py-0.5 text-[10px] rounded-xs font-bold transition ${
                      previewBg === 'light' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Clean White
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewBg('dark')}
                    className={`px-2 py-0.5 text-[10px] rounded-xs font-bold transition ${
                      previewBg === 'dark' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              {/* Preview Canvas Box */}
              <div
                className={`w-full aspect-square border border-slate-200 rounded-sm p-6 sm:p-8 flex items-center justify-center shadow-xs transition-colors ${
                  previewBg === 'letterhead'
                    ? 'bg-[#fbf9f5] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px]'
                    : previewBg === 'dark'
                    ? 'bg-slate-950'
                    : 'bg-white'
                }`}
              >
                <div
                  className="w-full h-full max-w-[270px] max-h-[270px] flex items-center justify-center transition-all duration-300 transform hover:scale-105"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Vector: SVG 500×500</span>
                <span>Export: High-DPI 2048px PNG</span>
              </div>
            </div>

            {/* Shuffle Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateAgain}
              className="w-full gap-2 text-xs font-bold border-slate-300 text-slate-800 hover:bg-slate-50 rounded-sm h-9"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isHindi ? 'नया स्मार्ट वेरिएंट बनाएं' : 'Surprise Me / Generate Next Variant'}</span>
            </Button>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
              {[
                { id: 'presets', label: isHindi ? 'स्मार्ट प्रीसेट्स' : '1. Smart Presets', icon: <Sparkles className="w-3.5 h-3.5" /> },
                { id: 'structure', label: isHindi ? 'ढांचा व आकार' : '2. Structure & Shape', icon: <Layout className="w-3.5 h-3.5" /> },
                { id: 'symbol', label: isHindi ? 'केंद्रीय प्रतीक' : '3. Central Motif', icon: <Award className="w-3.5 h-3.5" /> },
                { id: 'palette', label: isHindi ? 'रंग थीम' : '4. Color Theme', icon: <Palette className="w-3.5 h-3.5" /> },
                { id: 'typography', label: isHindi ? 'पाठ व विवरण' : '5. Text & Details', icon: <Type className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: SMART PRESETS */}
            {activeTab === 'presets' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="bg-indigo-50/60 border border-indigo-100 p-2.5 rounded-sm flex items-start gap-2 text-xs text-indigo-900">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{isHindi ? 'संगठन नाम के आधार पर तैयार 4 स्मार्ट शैलियाँ:' : `Tailored for "${name}":`}</span>{' '}
                    {isHindi
                      ? 'नीचे दिए गए किसी भी प्रीसेट पर क्लिक करें और पूरा लोगो तुरंत अपडेट हो जाएगा।'
                      : 'Click any instant preset below to automatically configure the emblem shape, palette, and central motif.'}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {smartAnalysis.presets.map((p) => {
                    const isCurrent =
                      style === p.style &&
                      colorTheme === p.colorTheme &&
                      (centerType === p.centerType ? selectedSymbolId === p.symbolId : false)

                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleApplyPreset(p)}
                        className={`p-3 text-left border rounded-sm transition flex flex-col justify-between ${
                          isCurrent
                            ? 'border-slate-900 bg-slate-50 ring-1.5 ring-slate-900 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">
                              {isHindi ? p.titleHi : p.title}
                            </span>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-slate-900" />}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug">{p.desc}</p>
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-600">
                          <span className="font-semibold uppercase tracking-wider">{p.style.replace('_', ' ')}</span>
                          <span className="truncate max-w-[120px] font-bold text-indigo-600">
                            {COLOR_PALETTES[p.colorTheme]?.name.split('&')[0]}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: STRUCTURE & SHAPE */}
            {activeTab === 'structure' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {isHindi ? 'लोगो का आकार व फ्रेम' : 'Emblem Shape & Frame Geometry'}
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {styleItems.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStyle(s.id as LogoStyle)}
                      className={`p-2.5 text-left border rounded-sm transition ${
                        style === s.id
                          ? 'border-slate-900 bg-slate-50 ring-1.5 ring-slate-900 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{isHindi ? s.titleHi : s.title}</span>
                        {style === s.id && <Check className="w-3.5 h-3.5 text-slate-900" />}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: CENTRAL MOTIF & MONOGRAM */}
            {activeTab === 'symbol' && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                {/* Switch: Symbol vs Monogram */}
                <div className="flex items-center justify-between bg-slate-100 p-1 rounded-sm border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setCenterType('symbol')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xs transition flex items-center justify-center gap-1.5 ${
                      centerType === 'symbol'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'केंद्रीय हेराल्डिक प्रतीक (Icon Motif)' : 'Heraldic Symbol Icon'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCenterType('monogram')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xs transition flex items-center justify-center gap-1.5 ${
                      centerType === 'monogram'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'मोनोग्राम अक्षर (Initials Monogram)' : 'Initials Monogram (e.g. NF)'}</span>
                  </button>
                </div>

                {centerType === 'monogram' ? (
                  <div className="p-4 border border-slate-200 rounded-sm bg-slate-50 space-y-3">
                    <div>
                      <Label className="text-xs font-bold text-slate-700">Custom Monogram Initials</Label>
                      <Input
                        value={customInitials}
                        maxLength={4}
                        onChange={(e) => setCustomInitials(e.target.value.toUpperCase())}
                        placeholder={smartAnalysis.monogram}
                        className="h-9 text-base font-bold tracking-widest mt-1 uppercase"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Up to 3-4 letters representing {name} (e.g. {smartAnalysis.monogram}).
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                      {categoryPills.map((cp) => (
                        <button
                          key={cp.id}
                          type="button"
                          onClick={() => setSymbolCategoryFilter(cp.id)}
                          className={`px-2 py-1 text-[11px] rounded-sm font-semibold flex items-center gap-1 whitespace-nowrap transition ${
                            symbolCategoryFilter === cp.id
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {cp.icon}
                          <span>{isHindi ? cp.labelHi : cp.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Symbols Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {displayedSymbols.map((sym) => {
                        const isSelected = selectedSymbolId === sym.id && centerType === 'symbol'
                        return (
                          <button
                            key={sym.id}
                            type="button"
                            onClick={() => {
                              setSelectedSymbolId(sym.id)
                              setCenterType('symbol')
                            }}
                            className={`p-2 text-left border rounded-sm transition flex items-center gap-2 ${
                              isSelected
                                ? 'border-slate-900 bg-slate-50 ring-1.5 ring-slate-900'
                                : 'border-slate-200 bg-white hover:bg-slate-50'
                            }`}
                          >
                            <div className="w-5 h-5 flex items-center justify-center shrink-0">
                              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-slate-900">
                                <path d={sym.svgPath} />
                              </svg>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-800 truncate">
                              {isHindi ? sym.nameHi : sym.name}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 4: COLOR PALETTE */}
            {activeTab === 'palette' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {isHindi ? 'आधिकारिक संप्रभु रंग पैलेट' : 'Sovereign Color Themes'}
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(COLOR_PALETTES).map(([id, pal]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setColorTheme(id as ColorTheme)}
                      className={`p-2.5 text-left border rounded-sm transition flex items-center justify-between ${
                        colorTheme === id
                          ? 'border-slate-900 bg-slate-50 ring-1.5 ring-slate-900 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center -space-x-1 shrink-0">
                          <div
                            className="w-4 h-4 rounded-full border border-white shadow-xs"
                            style={{ backgroundColor: pal.primary }}
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-white shadow-xs"
                            style={{ backgroundColor: pal.accent }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-900">
                          {isHindi ? pal.nameHi : pal.name}
                        </span>
                      </div>
                      {colorTheme === id && <Check className="w-3.5 h-3.5 text-slate-900" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: TEXT & TYPOGRAPHY */}
            {activeTab === 'typography' && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px] font-bold text-slate-700">Organization Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-8 text-xs mt-1 rounded-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold text-slate-700">State / City / Nation</Label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-8 text-xs mt-1 rounded-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px] font-bold text-slate-700">Established Year</Label>
                    <Input
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="h-8 text-xs mt-1 rounded-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold text-slate-700">Font Family</Label>
                    <div className="grid grid-cols-3 gap-1 mt-1">
                      {(['sans', 'serif', 'slab'] as FontStyle[]).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFontStyle(f)}
                          className={`h-8 text-[11px] font-bold uppercase rounded-sm border ${
                            fontStyle === f
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-bold text-slate-700">Tagline / Motto</Label>
                    <span className="text-[10px] text-slate-400">Click a smart suggestion below</span>
                  </div>
                  <Input
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="h-8 text-xs mt-1 rounded-sm"
                  />

                  {/* Smart Suggested Taglines */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(isHindi ? smartAnalysis.suggestedTaglinesHi : smartAnalysis.suggestedTaglinesEn).map((st, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setTagline(st)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-xs border transition ${
                          tagline === st
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full sm:w-auto text-xs font-bold border-slate-300 rounded-sm h-9 gap-1.5"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{isHindi ? 'डाउनलोड हो रहा है...' : 'Generating 2048px...'}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{isHindi ? 'उच्च रिज़ॉल्यूशन लोगो (2048px PNG)' : 'Download High-Res Logo (2048px PNG)'}</span>
              </>
            )}
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="w-1/3 sm:w-auto text-xs font-semibold rounded-sm h-9"
            >
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </Button>

            <Button
              type="button"
              onClick={handleSaveAndUse}
              disabled={isSaving}
              className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 rounded-sm h-9 shadow-xs flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isHindi ? 'सेव हो रहा है...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'संगठन में सेव करें और लोगो लगाएं' : 'Save to Sangathan & Use Logo'}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
