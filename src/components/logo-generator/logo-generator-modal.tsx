'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  Sparkles, RefreshCw, Download, Save, Check, X,
  Shield, Palette, Layout, Award, FileText, CheckCircle2,
  Loader2, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OrgType } from '@/lib/org-types'
import { LogoStyle, ColorTheme } from '@/lib/logo-generator/types'
import { COLOR_PALETTES, HERALDIC_SYMBOLS, getSymbolsForOrgType } from '@/lib/logo-generator/symbols-and-palettes'
import { generateLogoSvg, rasterizeSvgToPng } from '@/lib/logo-generator/vector-engine'
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

  const availableSymbols = useMemo(() => getSymbolsForOrgType(orgType), [orgType])

  const [name, setName] = useState(orgName)
  const [tagline, setTagline] = useState('DEMOCRATIC SOVEREIGNTY')
  const [year, setYear] = useState(establishedYear)
  const [location, setLocation] = useState(stateOrCity)
  const [style, setStyle] = useState<LogoStyle>('circular_seal')
  const [colorTheme, setColorTheme] = useState<ColorTheme>('sovereign_navy')
  const [selectedSymbolId, setSelectedSymbolId] = useState<string>(availableSymbols[0]?.id || 'flame_of_freedom')
  const [previewBg, setPreviewBg] = useState<'light' | 'letterhead'>('letterhead')

  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Sync props on change
  useEffect(() => {
    setName(orgName || 'My Organisation')
    setLocation(stateOrCity || 'India')
    setYear(establishedYear || new Date().getFullYear().toString())
    if (availableSymbols[0]) {
      setSelectedSymbolId(availableSymbols[0].id)
    }
  }, [orgName, stateOrCity, establishedYear, availableSymbols])

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
    })
  }, [name, orgType, tagline, year, location, style, colorTheme, selectedSymbolId])

  // Shuffle / Generate Again
  const handleGenerateAgain = () => {
    const styles: LogoStyle[] = ['circular_seal', 'modern_crest', 'movement_shield', 'official_stamp']
    const palettes: ColorTheme[] = ['sovereign_navy', 'grassroots_emerald', 'royal_indigo', 'crimson_flame', 'ink_monochrome']
    
    const randomStyle = styles[Math.floor(Math.random() * styles.length)]
    const randomPalette = palettes[Math.floor(Math.random() * palettes.length)]
    const randomSymbol = availableSymbols[Math.floor(Math.random() * availableSymbols.length)]

    setStyle(randomStyle)
    setColorTheme(randomPalette)
    if (randomSymbol) {
      setSelectedSymbolId(randomSymbol.id)
    }
    toast.info(isHindi ? 'नया डिज़ाइन वेरिएंट तैयार किया गया!' : 'Fresh emblem variation generated!')
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
          ? 'उच्च रिज़ॉल्यूशन (2048px) लोगो सफलतापूर्वक डाउनलोड हो गया!'
          : 'High-resolution 2048px logo downloaded successfully!'
      )
    } catch (err) {
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
        // If existing organisation, save to Supabase via server action
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
        // Onboarding flow: pass the dataUrl to parent form
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-white border border-slate-200 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-sm bg-slate-900 text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                {isHindi ? 'आधिकारिक संगठन लोगो व मोहर जनरेटर' : 'Generate Official Organization Emblem'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {isHindi
                  ? 'लेटरहेड, ज्ञापन और कानूनी प्रतिनिधित्व के लिए उपयुक्त'
                  : 'Vector insignia ready for letterheads, Gyapan memorandums & stamps'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live High-DPI Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between space-y-4">
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>{isHindi ? 'लाइव प्रीव्यू' : 'Live Vector Preview'}</span>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-sm">
                  <button
                    type="button"
                    onClick={() => setPreviewBg('letterhead')}
                    className={`px-2 py-0.5 text-[10px] rounded-xs font-bold transition ${
                      previewBg === 'letterhead' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Letterhead
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewBg('light')}
                    className={`px-2 py-0.5 text-[10px] rounded-xs font-bold transition ${
                      previewBg === 'light' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Clean Light
                  </button>
                </div>
              </div>

              {/* Preview Canvas Box */}
              <div
                className={`w-full aspect-square border border-slate-200 rounded-sm p-8 flex items-center justify-center shadow-xs transition-colors ${
                  previewBg === 'letterhead'
                    ? 'bg-[#fcfbf9] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px]'
                    : 'bg-white'
                }`}
              >
                <div
                  className="w-full h-full max-w-[260px] max-h-[260px] flex items-center justify-center transition-all duration-300 transform hover:scale-105"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </div>
            </div>

            {/* Shuffle / Regenerate Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateAgain}
              className="w-full gap-2 text-xs font-bold border-slate-300 text-slate-800 hover:bg-slate-50 rounded-sm h-9"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isHindi ? 'दोबारा बनाएं / नया वेरिएंट' : 'Generate Again / Try Next Style'}</span>
            </Button>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-7 space-y-5">
            {/* Style Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5" />
                <span>{isHindi ? 'लोगो शैली (Style)' : 'Emblem Structure'}</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'circular_seal', title: 'Circular Seal', desc: 'Official Statutory Ring' },
                  { id: 'modern_crest', title: 'Modern Crest', desc: 'Geometric Monogram' },
                  { id: 'movement_shield', title: 'Movement Shield', desc: 'Heraldic Badge' },
                  { id: 'official_stamp', title: 'Official Stamp', desc: 'Minimalist Ink Stamp' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyle(s.id as LogoStyle)}
                    className={`p-2.5 text-left border rounded-sm transition ${
                      style === s.id
                        ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">{s.title}</div>
                    <div className="text-[10px] text-slate-500">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Heraldic Symbol Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>{isHindi ? 'केंद्रीय प्रतीक (Heraldic Motif)' : 'Central Movement Symbol'}</span>
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableSymbols.map((sym) => (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => setSelectedSymbolId(sym.id)}
                    className={`p-2 text-left border rounded-sm transition flex items-center gap-2 ${
                      selectedSymbolId === sym.id
                        ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
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
                ))}
              </div>
            </div>

            {/* Color Palette Selector */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>{isHindi ? 'रंग थीम (Color Palette)' : 'Color Palette'}</span>
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(COLOR_PALETTES).map(([id, pal]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setColorTheme(id as ColorTheme)}
                    className={`p-2 text-left border rounded-sm transition flex items-center gap-2 ${
                      colorTheme === id
                        ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-slate-300 shrink-0"
                      style={{ backgroundColor: pal.primary }}
                    />
                    <span className="text-[11px] font-semibold text-slate-800 truncate">
                      {isHindi ? pal.nameHi : pal.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Text Overrides */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <Label className="text-[11px] font-bold text-slate-600">Org Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 text-xs mt-1 rounded-sm"
                />
              </div>
              <div>
                <Label className="text-[11px] font-bold text-slate-600">Tagline / Motto</Label>
                <Input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="h-8 text-xs mt-1 rounded-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
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
                <span>{isHindi ? 'उच्च रिज़ॉल्यूशन लोगो डाउनलोड करें (2048px PNG)' : 'Download High-Res Logo (2048px PNG)'}</span>
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
