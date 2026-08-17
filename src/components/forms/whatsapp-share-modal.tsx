'use client'

import { useState, useMemo, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Copy,
  Check,
  Globe,
  MessageCircle,
  Sparkles,
  Link2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Send,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { updateFormSlug, checkFormSlugAvailability } from '@/actions/forms/actions'

interface WhatsappShareModalProps {
  isOpen: boolean
  onClose: () => void
  formId: string
  formTitle: string
  formDescription?: string | null
  currentSlug?: string | null
  orgName?: string
  lang: string
  onSlugUpdated?: (newSlug: string) => void
}

type TemplateType = 'survey' | 'urgent' | 'mobilize' | 'custom'

export function WhatsappShareModal({
  isOpen,
  onClose,
  formId,
  formTitle,
  formDescription,
  currentSlug,
  orgName = 'Sangathan',
  lang,
  onSlugUpdated,
}: WhatsappShareModalProps) {
  const isHindi = lang === 'hi'

  // Slug management state
  const [activeSlug, setActiveSlug] = useState<string>(currentSlug || '')
  const [isEditingSlug, setIsEditingSlug] = useState(false)
  const [slugInput, setSlugInput] = useState<string>(currentSlug || '')
  const [slugLoading, setSlugLoading] = useState(false)
  const [slugCheckStatus, setSlugCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [slugCheckError, setSlugCheckError] = useState<string | null>(null)

  // Template & Customization state
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('survey')
  const [customLeadText, setCustomLeadText] = useState('')
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedMessage, setCopiedMessage] = useState(false)

  // Sync state when props change
  useEffect(() => {
    setActiveSlug(currentSlug || '')
    setSlugInput(currentSlug || '')
  }, [currentSlug])

  // Form public URL computation
  const publicPath = activeSlug ? `/f/${activeSlug}` : `/f/${formId}`
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sangathan.space'
  const fullPublicUrl = `${origin}${publicPath}`

  // Slug availability check with debounce
  useEffect(() => {
    const trimmed = slugInput.trim().toLowerCase()
    if (!isEditingSlug || !trimmed || trimmed === activeSlug) {
      setSlugCheckStatus('idle')
      setSlugCheckError(null)
      return
    }

    if (trimmed.length < 3) {
      setSlugCheckStatus('taken')
      setSlugCheckError(isHindi ? 'कम से कम 3 अक्षर होने चाहिए' : 'Must be at least 3 characters')
      return
    }

    if (!/^[a-z0-9-]+$/.test(trimmed)) {
      setSlugCheckStatus('taken')
      setSlugCheckError(isHindi ? 'केवल छोटे अक्षर, संख्या और हाइफ़न (-) अनुमत हैं' : 'Only lowercase letters, numbers, and hyphens allowed')
      return
    }

    setSlugCheckStatus('checking')
    const timer = setTimeout(async () => {
      try {
        const res = await checkFormSlugAvailability(trimmed, formId)
        if (res.available) {
          setSlugCheckStatus('available')
          setSlugCheckError(null)
        } else {
          setSlugCheckStatus('taken')
          setSlugCheckError(res.error || (isHindi ? 'यह लिंक पहले से उपयोग में है' : 'This slug is already taken'))
        }
      } catch {
        setSlugCheckStatus('idle')
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [slugInput, isEditingSlug, activeSlug, formId, isHindi])

  async function handleSaveSlug() {
    const trimmed = slugInput.trim().toLowerCase()
    if (!trimmed) {
      toast.error(isHindi ? 'कृपया एक वैध लिंक दें' : 'Please enter a valid slug')
      return
    }

    if (trimmed === activeSlug) {
      setIsEditingSlug(false)
      return
    }

    setSlugLoading(true)
    try {
      const res = await updateFormSlug({
        formId,
        slug: trimmed,
      })

      if (res.success && res.data) {
        setActiveSlug(res.data.slug)
        setIsEditingSlug(false)
        if (onSlugUpdated) onSlugUpdated(res.data.slug)
        toast.success(isHindi ? 'कस्टम लिंक सफलतापूर्वक सेट हो गया!' : 'Custom SEO link saved successfully!')
      } else {
        toast.error(res.error || 'Failed to update slug')
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error updating slug')
    } finally {
      setSlugLoading(false)
    }
  }

  // Pre-composed high-converting messages
  const generatedMessage = useMemo(() => {
    const descText = formDescription ? `\n${formDescription.slice(0, 140)}${formDescription.length > 140 ? '...' : ''}\n` : '\n'

    if (selectedTemplate === 'survey') {
      if (isHindi) {
        return `📋 *${formTitle}*${descText}
👉 कृपया इस आधिकारिक सर्वेक्षण को भरें (केवल 1 मिनट लगेगा):
${fullPublicUrl}

आपकी राय ${orgName} को ठोस कार्यवाही करने में मदद करेगी। कृपया इसे अन्य साथियों को भी साझा करें!`
      }
      return `📋 *${formTitle}*${descText}
👉 Please take 1 minute to fill out this official survey:
${fullPublicUrl}

Your voice helps ${orgName} take ground action. Please forward to your fellow members!`
    }

    if (selectedTemplate === 'urgent') {
      if (isHindi) {
        return `🚨 *अति आवश्यक जनसुनवाई: ${formTitle}*${descText}
⚠️ हम तत्काल साक्ष्य व प्रतिक्रियाएं संकलित कर रहे हैं। तुरंत भरें:
${fullPublicUrl}

— *${orgName}* जमीनी कार्यवाही डेस्क`
      }
      return `🚨 *Urgent Attention: ${formTitle}*${descText}
⚠️ We are compiling immediate ground evidence and responses. Fill here:
${fullPublicUrl}

— *${orgName}* Ground Action Desk`
    }

    if (selectedTemplate === 'mobilize') {
      if (isHindi) {
        return `✊ *${formTitle}*${descText}
📢 अपने संगठन के साथ जुड़ें और अपनी सहभागिता दर्ज करें:
${fullPublicUrl}

जय हिन्द! इंकलाब ज़िन्दाबाद! सभी साथियों को आगे भेजें।`
      }
      return `✊ *${formTitle}*${descText}
📢 Join the movement and register your collective pledge here:
${fullPublicUrl}

Inquilab Zindabad! Forward to all comrades and supporters.`
    }

    // Custom template
    if (customLeadText.trim()) {
      return `${customLeadText.trim()}

${fullPublicUrl}`
    }

    return `*${formTitle}*
${fullPublicUrl}`
  }, [selectedTemplate, formTitle, formDescription, fullPublicUrl, orgName, isHindi, customLeadText])

  function handleShareToWhatsapp() {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(generatedMessage)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  function handleCopyMessage() {
    navigator.clipboard.writeText(generatedMessage)
    setCopiedMessage(true)
    toast.success(isHindi ? 'पूरा व्हाट्सएप संदेश व लिंक कॉपी हुआ!' : 'Complete WhatsApp message & link copied!')
    setTimeout(() => setCopiedMessage(false), 2000)
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(fullPublicUrl)
    setCopiedLink(true)
    toast.success(isHindi ? 'पब्लिक लिंक कॉपी हो गया!' : 'Public form link copied!')
    setTimeout(() => setCopiedLink(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-emerald-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs text-white">
              <MessageCircle className="w-5 h-5 fill-white text-emerald-700" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                {isHindi ? 'व्हाट्सएप पर शेयर करें' : 'Share Form on WhatsApp'}
              </h3>
              <p className="text-xs text-emerald-100">
                {isHindi ? 'कस्टम लिंक व सीटीए संदेश के साथ सीधे फॉरवर्ड करें' : 'Viral forward with memorable link and high-converting CTA'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          
          {/* Section 1: SEO-Friendly Link Configuration */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-orange-700" />
                <span>{isHindi ? 'कस्टम फ्रेंडली लिंक (SEO Slug)' : 'Custom SEO Link & Slug'}</span>
              </div>

              {!isEditingSlug && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingSlug(true)
                    setSlugInput(activeSlug || '')
                  }}
                  className="text-xs font-bold text-orange-700 hover:text-orange-900 flex items-center gap-1 self-start sm:self-auto"
                >
                  <Edit3 size={13} />
                  <span>{activeSlug ? (isHindi ? 'लिंक बदलें' : 'Change Slug') : (isHindi ? '+ आसान लिंक सेट करें' : '+ Set Custom Link')}</span>
                </button>
              )}
            </div>

            {/* Current Active URL Display */}
            {!isEditingSlug ? (
              <div className="flex items-center justify-between gap-2 p-2.5 bg-white border border-slate-200 rounded-lg text-xs font-mono">
                <span className="truncate text-slate-700 font-semibold">{fullPublicUrl}</span>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyLink}
                  className="h-7 px-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 shrink-0"
                >
                  {copiedLink ? <Check size={13} className="text-emerald-600 mr-1" /> : <Copy size={13} className="mr-1" />}
                  {copiedLink ? (isHindi ? 'कॉपी हुआ' : 'Copied') : (isHindi ? 'कॉपी' : 'Copy')}
                </Button>
              </div>
            ) : (
              <div className="space-y-2 pt-1 border-t border-slate-200">
                <Label className="text-[11px] font-bold text-slate-600 uppercase">
                  {isHindi ? 'नया स्लग दर्ज करें (उदा. delhi-survey-2026)' : 'Enter custom slug (e.g. annual-hostel-survey)'}
                </Label>

                <div className="flex items-center">
                  <span className="bg-slate-200 border border-r-0 border-slate-300 text-slate-700 px-3 py-2 rounded-l-lg text-xs font-mono select-none">
                    sangathan.space/f/
                  </span>
                  <Input
                    value={slugInput}
                    onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="my-memorable-slug"
                    className="rounded-l-none text-xs font-mono font-bold border-slate-300 focus:border-orange-600"
                  />
                </div>

                {/* Validation Status Indicator */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div>
                    {slugCheckStatus === 'checking' && (
                      <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                        <Loader2 size={12} className="animate-spin text-orange-700" />
                        {isHindi ? 'उपलब्धता जांची जा रही है...' : 'Checking availability...'}
                      </span>
                    )}
                    {slugCheckStatus === 'available' && (
                      <span className="text-emerald-600 flex items-center gap-1 font-bold text-[11px]">
                        <CheckCircle2 size={13} />
                        {isHindi ? '✓ लिंक उपलब्ध है!' : '✓ Link is available!'}
                      </span>
                    )}
                    {slugCheckStatus === 'taken' && (
                      <span className="text-red-600 flex items-center gap-1 font-semibold text-[11px]">
                        <AlertCircle size={13} />
                        {slugCheckError}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingSlug(false)}
                      className="h-7 text-xs text-slate-600"
                    >
                      {isHindi ? 'रद्द करें' : 'Cancel'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleSaveSlug}
                      disabled={slugLoading || slugCheckStatus === 'taken' || slugCheckStatus === 'checking'}
                      className="h-7 px-3 text-xs font-bold bg-orange-700 hover:bg-orange-800 text-white shadow-xs"
                    >
                      {slugLoading ? <Loader2 size={12} className="animate-spin mr-1" /> : null}
                      {isHindi ? 'सेव करें' : 'Save Slug'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: CTA Template Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                {isHindi ? 'संदेश प्रारूप चुनें (CTA Preset)' : 'Select WhatsApp CTA Template'}
              </Label>
              <span className="text-[11px] text-slate-400 font-medium">4 Presets</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setSelectedTemplate('survey')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                  selectedTemplate === 'survey'
                    ? 'border-emerald-600 bg-emerald-50/60 font-bold text-emerald-950 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-base mb-1">📋</span>
                <span className="font-bold">{isHindi ? 'जनमत सर्वेक्षण' : 'Civic Survey'}</span>
                <span className="text-[10px] text-slate-500 font-normal">Official feedback</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTemplate('urgent')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                  selectedTemplate === 'urgent'
                    ? 'border-rose-600 bg-rose-50/60 font-bold text-rose-950 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-base mb-1">🚨</span>
                <span className="font-bold">{isHindi ? 'त्वरित सुनवाई' : 'Urgent Call'}</span>
                <span className="text-[10px] text-slate-500 font-normal">Emergency issues</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTemplate('mobilize')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                  selectedTemplate === 'mobilize'
                    ? 'border-orange-600 bg-orange-50/60 font-bold text-orange-950 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-base mb-1">✊</span>
                <span className="font-bold">{isHindi ? 'कार्यकर्ता आह्वान' : 'Mobilization'}</span>
                <span className="text-[10px] text-slate-500 font-normal">Cadre pledge</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTemplate('custom')}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                  selectedTemplate === 'custom'
                    ? 'border-slate-800 bg-slate-100 font-bold text-slate-900 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-base mb-1">✏️</span>
                <span className="font-bold">{isHindi ? 'कस्टम संदेश' : 'Custom Copy'}</span>
                <span className="text-[10px] text-slate-500 font-normal">Write your own</span>
              </button>
            </div>

            {selectedTemplate === 'custom' && (
              <div className="pt-2">
                <Textarea
                  value={customLeadText}
                  onChange={(e) => setCustomLeadText(e.target.value)}
                  placeholder={isHindi ? 'अपना व्यक्तिगत संदेश लिखें... लिंक नीचे स्वतः जुड़ जाएगा।' : 'Write your custom call-to-action message here... link will be automatically attached.'}
                  rows={3}
                  className="text-xs border-slate-200"
                />
              </div>
            )}
          </div>

          {/* Section 3: Live WhatsApp Chat Bubble Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                {isHindi ? 'व्हाट्सएप लाइव प्रीव्यू' : 'Live WhatsApp Message Preview'}
              </span>
              <span className="text-[11px] text-slate-400">Authentic WhatsApp formatting</span>
            </div>

            {/* WhatsApp Chat Container */}
            <div className="bg-[#EFEAE2] p-4 rounded-xl border border-slate-300/80 shadow-inner">
              <div className="max-w-md bg-white rounded-lg p-3.5 shadow-sm text-xs space-y-2 border-l-4 border-l-[#25D366] relative">
                <div className="whitespace-pre-line text-slate-800 leading-relaxed font-sans text-xs">
                  {generatedMessage}
                </div>

                {/* Link Preview Card inside Bubble */}
                <div className="mt-2 bg-[#F0F2F5] p-2.5 rounded-md border border-slate-200/80 space-y-1">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">{orgName}</div>
                  <div className="font-bold text-xs text-slate-900 truncate">{formTitle}</div>
                  <div className="text-[11px] text-slate-500 truncate font-mono">{fullPublicUrl}</div>
                </div>

                <div className="flex justify-end items-center gap-1 text-[10px] text-slate-400 pt-1">
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="text-emerald-600 font-bold">✓✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyMessage}
              className="text-xs font-bold border-slate-300 text-slate-700 bg-white hover:bg-slate-100 flex-1 sm:flex-initial"
            >
              {copiedMessage ? <Check size={14} className="text-emerald-600 mr-1.5" /> : <Copy size={14} className="mr-1.5" />}
              {copiedMessage ? (isHindi ? 'संदेश कॉपी हुआ' : 'Message Copied') : (isHindi ? 'संदेश व लिंक कॉपी करें' : 'Copy Message & Link')}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="text-xs font-bold border-slate-300 text-slate-700 bg-white hover:bg-slate-100"
              title="Copy Link Only"
            >
              <Link2 size={14} className="mr-1" />
              {isHindi ? 'केवल लिंक' : 'Link Only'}
            </Button>
          </div>

          <Button
            type="button"
            onClick={handleShareToWhatsapp}
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs px-6 py-2.5 shadow-md flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>{isHindi ? 'व्हाट्सएप पर अभी भेजें' : 'Share to WhatsApp Now'}</span>
            <Send size={13} className="ml-0.5" />
          </Button>
        </div>

      </div>
    </div>
  )
}
