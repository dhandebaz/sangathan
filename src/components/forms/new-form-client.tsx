'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Trash2,
  ArrowLeft,
  Copy,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Eye,
  Settings2,
  FileText,
  Star,
  CheckSquare,
  CircleDot,
  ListFilter,
  Calendar,
  Hash,
  Phone,
  Mail,
  HelpCircle,
  Heading,
  CheckCircle,
  ToggleLeft,
  SlidersHorizontal,
  Loader2,
  Layers,
  Wand2
} from 'lucide-react'
import { createForm } from '@/actions/forms/actions'
import { FormField, FieldType } from '@/types/forms'
import { FORM_TEMPLATES } from '@/lib/forms/templates'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface NewFormClientProps {
  lang: string
  orgType?: string
}

const FIELD_PALETTE: Array<{
  type: FieldType
  label: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  category: 'basic' | 'survey' | 'layout'
  defaultField: Omit<FormField, 'id'>
}> = [
  // Basic Fields
  {
    type: 'text',
    label: 'Short Text',
    icon: FileText,
    category: 'basic',
    defaultField: { label: 'Full Name / Short Answer', type: 'text', required: true, placeholder: 'Enter your answer here...' },
  },
  {
    type: 'textarea',
    label: 'Long Text / Feedback',
    icon: FileText,
    category: 'basic',
    defaultField: { label: 'Detailed Description / Feedback', type: 'textarea', required: false, placeholder: 'Write your detailed thoughts here...' },
  },
  {
    type: 'phone',
    label: 'Phone (+91)',
    icon: Phone,
    category: 'basic',
    defaultField: { label: 'Mobile / WhatsApp Number', type: 'phone', required: true, placeholder: '+91 9876543210' },
  },
  {
    type: 'email',
    label: 'Email Address',
    icon: Mail,
    category: 'basic',
    defaultField: { label: 'Email Address', type: 'email', required: false, placeholder: 'name@example.com' },
  },
  {
    type: 'number',
    label: 'Number / Count',
    icon: Hash,
    category: 'basic',
    defaultField: { label: 'Quantity / Number', type: 'number', required: false, placeholder: 'e.g. 5' },
  },
  {
    type: 'date',
    label: 'Date Picker',
    icon: Calendar,
    category: 'basic',
    defaultField: { label: 'Date of Event / Incident', type: 'date', required: false },
  },

  // Survey & Analytics Fields
  {
    type: 'rating',
    label: '1 to 5 Star Rating',
    icon: Star,
    category: 'survey',
    defaultField: { label: 'How would you rate our service / facility?', type: 'rating', required: true, maxRating: 5 },
  },
  {
    type: 'scale',
    label: '1 to 5 Likert Scale',
    icon: SlidersHorizontal,
    category: 'survey',
    defaultField: {
      label: 'Agreement / Satisfaction Scale',
      type: 'scale',
      required: true,
      minLabel: '1 - Strongly Disagree',
      maxLabel: '5 - Strongly Agree',
      maxRating: 5,
    },
  },
  {
    type: 'radio',
    label: 'Single Choice (Radio)',
    icon: CircleDot,
    category: 'survey',
    defaultField: {
      label: 'Select one option',
      type: 'radio',
      required: true,
      options: ['Option 1', 'Option 2', 'Option 3'],
    },
  },
  {
    type: 'checkbox',
    label: 'Multiple Choice (Checkboxes)',
    icon: CheckSquare,
    category: 'survey',
    defaultField: {
      label: 'Select all that apply',
      type: 'checkbox',
      required: true,
      options: ['Priority A', 'Priority B', 'Priority C'],
    },
  },
  {
    type: 'dropdown',
    label: 'Dropdown Menu',
    icon: ListFilter,
    category: 'survey',
    defaultField: {
      label: 'Choose from dropdown',
      type: 'dropdown',
      required: true,
      options: ['Category A', 'Category B', 'Category C'],
    },
  },
  {
    type: 'yes_no',
    label: 'Yes / No Decision',
    icon: ToggleLeft,
    category: 'survey',
    defaultField: { label: 'Do you agree with this proposal?', type: 'yes_no', required: true },
  },

  // Layout / Instruction
  {
    type: 'heading',
    label: 'Section Heading',
    icon: Heading,
    category: 'layout',
    defaultField: { label: 'Section Title', type: 'heading', required: false, description: 'Instructions or subtext for the questions below.' },
  },
]

export function NewFormClient({ lang, orgType = 'ngo' }: NewFormClientProps) {
  const router = useRouter()
  const isHindi = lang === 'hi'

  const [activeMode, setActiveMode] = useState<'build' | 'preview'>('build')
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'members' | 'private'>('public')

  const [fields, setFields] = useState<FormField[]>([
    { id: crypto.randomUUID(), label: 'Full Name', type: 'text', required: true, placeholder: 'e.g. Dr. Ambedkar' },
    { id: crypto.randomUUID(), label: 'Mobile / WhatsApp Number', type: 'phone', required: true, placeholder: '+91 9876543210' },
    { id: crypto.randomUUID(), label: 'Overall Satisfaction / Rating', type: 'rating', required: true, maxRating: 5 },
    { id: crypto.randomUUID(), label: 'Detailed Suggestions / Feedback', type: 'textarea', required: false, placeholder: 'Share your suggestions...' },
  ])

  // Template modal state
  const [showTemplateModal, setShowTemplateModal] = useState(false)

  function handleAddField(paletteItem: typeof FIELD_PALETTE[number]) {
    const newField: FormField = {
      id: crypto.randomUUID(),
      ...paletteItem.defaultField,
      options: paletteItem.defaultField.options ? [...paletteItem.defaultField.options] : undefined,
    }
    setFields([...fields, newField])
    toast.success(`Added "${paletteItem.label}"`)
  }

  function handleRemoveField(id: string) {
    if (fields.length <= 1) {
      toast.error('Form must have at least one field')
      return
    }
    setFields(fields.filter(f => f.id !== id))
  }

  function handleDuplicateField(id: string) {
    const target = fields.find(f => f.id === id)
    if (!target) return
    const dup: FormField = {
      ...target,
      id: crypto.randomUUID(),
      label: `${target.label} (Copy)`,
      options: target.options ? [...target.options] : undefined,
    }
    const idx = fields.findIndex(f => f.id === id)
    const newFields = [...fields]
    newFields.splice(idx + 1, 0, dup)
    setFields(newFields)
    toast.success('Field duplicated')
  }

  function handleMoveField(index: number, direction: 'up' | 'down') {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === fields.length - 1) return

    const newFields = [...fields]
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    const [moved] = newFields.splice(index, 1)
    newFields.splice(targetIdx, 0, moved)
    setFields(newFields)
  }

  function handleUpdateField(id: string, updates: Partial<FormField>) {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  function handleAddOption(fieldId: string) {
    const target = fields.find(f => f.id === fieldId)
    if (!target) return
    const current = target.options || []
    handleUpdateField(fieldId, { options: [...current, `Option ${current.length + 1}`] })
  }

  function handleUpdateOption(fieldId: string, optIndex: number, val: string) {
    const target = fields.find(f => f.id === fieldId)
    if (!target || !target.options) return
    const newOptions = [...target.options]
    newOptions[optIndex] = val
    handleUpdateField(fieldId, { options: newOptions })
  }

  function handleRemoveOption(fieldId: string, optIndex: number) {
    const target = fields.find(f => f.id === fieldId)
    if (!target || !target.options) return
    const newOptions = target.options.filter((_, i) => i !== optIndex)
    handleUpdateField(fieldId, { options: newOptions })
  }

  function applyOptionPreset(fieldId: string, presetType: 'yes_no' | 'agreement' | 'satisfaction' | 'priority') {
    let opts: string[] = []
    if (presetType === 'yes_no') opts = ['Yes, definitely', 'No, not now', 'Undecided / Neutral']
    if (presetType === 'agreement') opts = ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']
    if (presetType === 'satisfaction') opts = ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied']
    if (presetType === 'priority') opts = ['High Priority (Immediate)', 'Medium Priority', 'Low Priority (Later)']

    handleUpdateField(fieldId, { options: opts })
    toast.success('Applied option preset')
  }

  function loadTemplate(template: typeof FORM_TEMPLATES[number]) {
    setTitle(template.title)
    setDescription(template.description)
    setFields(template.fields.map(f => ({ ...f, id: crypto.randomUUID() })))
    setShowTemplateModal(false)
    toast.success(`Loaded "${template.title}" template!`)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      toast.error(isHindi ? 'कृपया फॉर्म का शीर्षक दें' : 'Please provide a Form Title')
      return
    }

    setLoading(true)

    try {
      const result = await createForm({
        title: title.trim(),
        description: description.trim() || undefined,
        visibility,
        fields: fields.map(f => ({
          id: f.id,
          label: f.label,
          type: f.type,
          required: !!f.required,
          description: f.description || undefined,
          placeholder: f.placeholder || undefined,
          options: f.options || undefined,
          minLabel: f.minLabel || undefined,
          maxLabel: f.maxLabel || undefined,
          maxRating: f.maxRating || 5,
        })),
      })

      if (result.success && result.data) {
        toast.success(isHindi ? 'फॉर्म सफलतापूर्वक प्रकाशित हुआ!' : 'Form created & published successfully!')
        router.push(`/${lang}/dashboard/forms/${result.data.formId}`)
      } else {
        toast.error(result.error || 'Failed to create form')
        setLoading(false)
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  // Filter templates: matching orgType first, then all
  const filteredTemplates = FORM_TEMPLATES.filter(t => t.category === orgType || t.category === 'general' || t.category === 'civic_collective')

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4">
      {/* Top Navigation & Mode Switcher */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link href={`/${lang}/dashboard/forms`} className="text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700">
              <Sparkles className="w-3.5 h-3.5" />
              {isHindi ? 'संगठन फॉर्म व सर्वे स्टूडियो' : 'Sangathan Form & Survey Studio'}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {title ? title : (isHindi ? 'नया फॉर्म / सर्वे बनाएं' : 'Create Form / Survey')}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowTemplateModal(true)}
            className="text-xs font-bold border-orange-200 text-orange-800 bg-orange-50 hover:bg-orange-100"
          >
            <Wand2 className="w-3.5 h-3.5 mr-1.5" />
            {isHindi ? 'तैयार टेम्पलेट लोड करें' : 'Load Ready Template'}
          </Button>

          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveMode('build')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeMode === 'build' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5 inline mr-1" />
              {isHindi ? 'बिल्डर मोड' : 'Builder'}
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('preview')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeMode === 'preview' ? 'bg-white text-orange-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" />
              {isHindi ? 'लाइव पूर्वावलोकन' : 'Live Preview'}
            </button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-orange-700 hover:bg-orange-800 text-white font-bold text-xs px-5 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                {isHindi ? 'सहेज रहे हैं...' : 'Publishing...'}
              </>
            ) : (
              isHindi ? 'फॉर्म प्रकाशित करें' : 'Publish Form'
            )}
          </Button>
        </div>
      </div>

      {/* TEMPLATE PICKER MODAL */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {isHindi ? 'संगठन के लिए तैयार टेम्पलेट्स' : 'Curated Civic & Survey Templates'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isHindi
                    ? 'अपनी संस्था के अनुरूप 1-क्लिक में सिद्ध सर्वेक्षण व फॉर्म लोड करें।'
                    : '1-click load pre-configured questionnaires tailored specifically to your organization.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 divide-y divide-slate-100">
              {FORM_TEMPLATES.map((tmpl) => (
                <div key={tmpl.id} className="pt-3 first:pt-0 flex items-start justify-between gap-4 group">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-orange-100 text-orange-800">
                        {tmpl.orgTypeLabel}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{tmpl.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{tmpl.description}</p>
                    <div className="text-[11px] text-slate-400">
                      {tmpl.fields.length} {isHindi ? 'सवाल शामिल हैं' : 'pre-configured fields & rating scales'}
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => loadTemplate(tmpl)}
                    className="bg-slate-900 hover:bg-orange-700 text-white font-bold text-xs shrink-0"
                  >
                    {isHindi ? 'उपयोग करें' : 'Use Template'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BUILDER MODE */}
      {activeMode === 'build' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PALETTE: Quick Field Insertion */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-orange-700" />
                  {isHindi ? 'फ़ील्ड पैलेट (1-क्लिक जोड़ें)' : 'Question & Field Elements'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">13 Types</span>
              </div>

              {/* Survey & Rating Category */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-orange-800 uppercase tracking-wider flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {isHindi ? 'सर्वेक्षण व रेटिंग टूल्स' : 'Survey & Rating Tools'}
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {FIELD_PALETTE.filter(p => p.category === 'survey').map(p => {
                    const Icon = p.icon
                    return (
                      <button
                        key={p.type}
                        type="button"
                        onClick={() => handleAddField(p)}
                        className="flex items-center gap-2.5 p-2 text-xs font-semibold rounded-lg border border-slate-100 hover:border-orange-300 bg-slate-50/50 hover:bg-orange-50/60 text-slate-800 transition-all text-left group"
                      >
                        <div className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-orange-700 group-hover:border-orange-400">
                          <Icon size={13} />
                        </div>
                        <span className="flex-1">{p.label}</span>
                        <Plus className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-700" />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Basic Contact & Information Category */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {isHindi ? 'संपर्क व बुनियादी जानकारी' : 'Contact & Information'}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {FIELD_PALETTE.filter(p => p.category === 'basic').map(p => {
                    const Icon = p.icon
                    return (
                      <button
                        key={p.type}
                        type="button"
                        onClick={() => handleAddField(p)}
                        className="flex items-center gap-2 p-2 text-xs font-semibold rounded-lg border border-slate-100 hover:border-orange-300 bg-slate-50/50 hover:bg-orange-50/60 text-slate-800 transition-all text-left group"
                      >
                        <Icon size={13} className="text-slate-500 group-hover:text-orange-700" />
                        <span className="truncate">{p.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Layout Dividers */}
              <div className="pt-2 border-t border-slate-100">
                {FIELD_PALETTE.filter(p => p.category === 'layout').map(p => (
                  <button
                    key={p.type}
                    type="button"
                    onClick={() => handleAddField(p)}
                    className="w-full flex items-center justify-center gap-1.5 p-2 text-xs font-semibold rounded-lg border border-dashed border-slate-200 hover:border-slate-400 bg-white text-slate-600 hover:text-slate-900 transition-all"
                  >
                    <Heading size={13} />
                    <span>{isHindi ? '+ सेक्शन हेडिंग / निर्देश जोड़ें' : '+ Add Section Heading'}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN CANVAS: Form Configuration & Question Blocks */}
          <div className="lg:col-span-8 space-y-4">
            {/* Form Settings Header Card */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div>
                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                  {isHindi ? 'फॉर्म / सर्वे का शीर्षक' : 'Form / Survey Title'} <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Hostel Mess Quality Survey 2026"
                  className="font-bold text-base border-slate-200 focus:border-orange-600"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                  {isHindi ? 'विवरण व उद्देश्य' : 'Description & Objectives'}
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the purpose of this survey and how responses will be used..."
                  rows={2}
                  className="text-xs border-slate-200 focus:border-orange-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                    {isHindi ? 'दृश्यता व पहुंच' : 'Audience Visibility'}
                  </Label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as 'public' | 'members' | 'private')}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800"
                  >
                    <option value="public">🌐 Public - Open to anyone via link</option>
                    <option value="members">👥 Members Only - Active members of organisation</option>
                    <option value="private">🔒 Private - Staff / Executive use only</option>
                  </select>
                </div>

                <div className="p-2.5 rounded-lg bg-orange-50/50 border border-orange-100 text-xs text-orange-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-700 shrink-0" />
                  <span className="leading-tight">
                    {isHindi ? 'सबमिशन से स्वचालित एनालिटिक्स रिपोर्ट तैयार होगी।' : 'Submissions will auto-generate instant sentiment & Goal consensus analytics.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Question Cards List */}
            <div className="space-y-3">
              {fields.map((field, index) => {
                const isHeading = field.type === 'heading'
                const hasOptions = ['radio', 'checkbox', 'dropdown'].includes(field.type)

                return (
                  <div
                    key={field.id}
                    className={`bg-white rounded-xl border transition-all p-4 relative group ${
                      isHeading ? 'border-orange-200 bg-orange-50/20' : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    {/* Top Action Bar of Card */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 uppercase tracking-wider">
                          {field.type.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Reorder, Duplicate, Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveField(index, 'up')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                          title="Move Up"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          type="button"
                          disabled={index === fields.length - 1}
                          onClick={() => handleMoveField(index, 'down')}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded"
                          title="Move Down"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateField(field.id)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded"
                          title="Duplicate Question"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveField(field.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded"
                          title="Delete Question"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Question Inputs */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-8">
                          <Label className="text-[11px] font-bold text-slate-600 uppercase mb-1 block">
                            {isHeading ? 'Section Header Title' : 'Question Label'}
                          </Label>
                          <Input
                            value={field.label}
                            onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                            className="font-medium text-xs border-slate-200"
                            placeholder="Enter your question text here..."
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <Label className="text-[11px] font-bold text-slate-600 uppercase mb-1 block">Field Type</Label>
                          <select
                            value={field.type}
                            onChange={(e) => handleUpdateField(field.id, { type: e.target.value as FieldType })}
                            className="w-full text-xs p-2 rounded-md border border-slate-200 bg-white font-medium"
                          >
                            {FIELD_PALETTE.map(p => (
                              <option key={p.type} value={p.type}>{p.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Helper Description */}
                      <div>
                        <Input
                          value={field.description || ''}
                          onChange={(e) => handleUpdateField(field.id, { description: e.target.value })}
                          placeholder="Optional helper text or instructions for the participant..."
                          className="text-xs border-slate-100 bg-slate-50/50 text-slate-600"
                        />
                      </div>

                      {/* Likert Scale Labels */}
                      {field.type === 'scale' && (
                        <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <div>
                            <Label className="text-[10px] font-bold text-slate-500 uppercase">Min Rating Label (1)</Label>
                            <Input
                              value={field.minLabel || ''}
                              onChange={(e) => handleUpdateField(field.id, { minLabel: e.target.value })}
                              placeholder="e.g. Strongly Disagree / Poor"
                              className="text-xs bg-white"
                            />
                          </div>
                          <div>
                            <Label className="text-[10px] font-bold text-slate-500 uppercase">Max Rating Label (5)</Label>
                            <Input
                              value={field.maxLabel || ''}
                              onChange={(e) => handleUpdateField(field.id, { maxLabel: e.target.value })}
                              placeholder="e.g. Strongly Agree / Excellent"
                              className="text-xs bg-white"
                            />
                          </div>
                        </div>
                      )}

                      {/* Choice Options Manager (for Radio, Checkbox, Dropdown) */}
                      {hasOptions && (
                        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                              Choices / Options List:
                            </span>

                            {/* Preset Buttons */}
                            <div className="flex flex-wrap gap-1 text-[10px]">
                              <span className="text-slate-400 mr-1 self-center">Presets:</span>
                              <button
                                type="button"
                                onClick={() => applyOptionPreset(field.id, 'yes_no')}
                                className="px-1.5 py-0.5 rounded bg-white border border-slate-200 hover:border-orange-400 text-slate-700"
                              >
                                Yes/No
                              </button>
                              <button
                                type="button"
                                onClick={() => applyOptionPreset(field.id, 'agreement')}
                                className="px-1.5 py-0.5 rounded bg-white border border-slate-200 hover:border-orange-400 text-slate-700"
                              >
                                Agreement (5)
                              </button>
                              <button
                                type="button"
                                onClick={() => applyOptionPreset(field.id, 'satisfaction')}
                                className="px-1.5 py-0.5 rounded bg-white border border-slate-200 hover:border-orange-400 text-slate-700"
                              >
                                Satisfaction (5)
                              </button>
                              <button
                                type="button"
                                onClick={() => applyOptionPreset(field.id, 'priority')}
                                className="px-1.5 py-0.5 rounded bg-white border border-slate-200 hover:border-orange-400 text-slate-700"
                              >
                                Priority (3)
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            {(field.options || []).map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-2">
                                <span className="w-4 text-[11px] text-slate-400 text-right">{optIdx + 1}.</span>
                                <Input
                                  value={opt}
                                  onChange={(e) => handleUpdateOption(field.id, optIdx, e.target.value)}
                                  className="text-xs bg-white h-8"
                                />
                                <button
                                  type="button"
                                  disabled={(field.options || []).length <= 1}
                                  onClick={() => handleRemoveOption(field.id, optIdx)}
                                  className="text-slate-400 hover:text-red-500 disabled:opacity-20 p-1"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddOption(field.id)}
                            className="text-xs font-bold text-orange-700 hover:underline flex items-center gap-1 mt-1"
                          >
                            <Plus size={14} /> Add another choice
                          </button>
                        </div>
                      )}

                      {/* Required Switch (if not heading) */}
                      {!isHeading && (
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                              className="rounded border-slate-300 text-orange-700 focus:ring-orange-600"
                            />
                            Required Response
                          </label>

                          <span className="text-[11px] text-slate-400">
                            ID: <code className="font-mono">{field.id.slice(0, 8)}</code>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom Add Field & Save Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleAddField(FIELD_PALETTE[0])}
                className="text-xs font-bold text-slate-700"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5 text-orange-700" />
                {isHindi ? '+ नया सवाल जोड़ें' : '+ Add Another Question'}
              </Button>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-orange-700 hover:bg-orange-800 text-white font-bold text-xs px-8 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    {isHindi ? 'सहेज रहे हैं...' : 'Publishing...'}
                  </>
                ) : (
                  isHindi ? 'फॉर्म प्रकाशित करें' : 'Publish Form'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW MODE */}
      {activeMode === 'preview' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
            <span>
              <strong>{isHindi ? 'लाइव पूर्वावलोकन सक्रिय है:' : 'Interactive Live Preview Active:'}</strong>{' '}
              {isHindi ? 'यह वही दृश्य है जो आपके प्रतिभागियों को दिखेगा।' : 'Test how your respondents will interact with your form in real-time.'}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveMode('build')}
              className="text-xs font-bold bg-white"
            >
              Back to Builder
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-extrabold text-slate-900">{title || 'Untitled Survey'}</h2>
              {description && <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{description}</p>}
            </div>

            <div className="space-y-5">
              {fields.map((field, idx) => {
                if (field.type === 'heading') {
                  return (
                    <div key={field.id} className="pt-4 border-t border-slate-100 first:border-t-0 first:pt-0">
                      <h3 className="font-extrabold text-sm text-slate-900">{field.label}</h3>
                      {field.description && <p className="text-xs text-slate-500 mt-0.5">{field.description}</p>}
                    </div>
                  )
                }

                return (
                  <div key={field.id} className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    {field.description && <p className="text-[11px] text-slate-400">{field.description}</p>}

                    {/* Star Rating Preview */}
                    {field.type === 'rating' && (
                      <div className="flex items-center gap-2 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="p-1 text-amber-400 hover:scale-110 transition-transform"
                          >
                            <Star size={24} fill="currentColor" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Likert Scale Preview */}
                    {field.type === 'scale' && (
                      <div className="space-y-1.5 pt-1">
                        <div className="grid grid-cols-5 gap-2">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button
                              key={num}
                              type="button"
                              className="py-2.5 text-xs font-bold rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50 text-slate-800 text-center"
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>{field.minLabel || '1 - Poor'}</span>
                          <span>{field.maxLabel || '5 - Excellent'}</span>
                        </div>
                      </div>
                    )}

                    {/* Radio Choice Preview */}
                    {field.type === 'radio' && (
                      <div className="space-y-1.5 pt-1">
                        {(field.options || []).map((opt, i) => (
                          <label key={i} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs text-slate-800 cursor-pointer">
                            <input type="radio" name={field.id} className="text-orange-700 focus:ring-orange-600" />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Checkbox Choice Preview */}
                    {field.type === 'checkbox' && (
                      <div className="space-y-1.5 pt-1">
                        {(field.options || []).map((opt, i) => (
                          <label key={i} className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs text-slate-800 cursor-pointer">
                            <input type="checkbox" className="rounded text-orange-700 focus:ring-orange-600" />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Yes/No Choice Preview */}
                    {field.type === 'yes_no' && (
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <button type="button" className="py-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-xs font-bold text-slate-800">
                          ✓ Yes
                        </button>
                        <button type="button" className="py-2.5 rounded-lg border border-slate-200 hover:border-red-500 hover:bg-red-50 text-xs font-bold text-slate-800">
                          ✕ No
                        </button>
                      </div>
                    )}

                    {/* Dropdown Choice Preview */}
                    {field.type === 'dropdown' && (
                      <select className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white">
                        <option value="">-- Select an option --</option>
                        {(field.options || []).map((opt, i) => (
                          <option key={i} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}

                    {/* Standard Text/Phone/Number Inputs */}
                    {field.type === 'text' && (
                      <Input placeholder={field.placeholder || 'Your answer...'} className="text-xs" />
                    )}
                    {field.type === 'textarea' && (
                      <Textarea placeholder={field.placeholder || 'Your detailed answer...'} rows={3} className="text-xs" />
                    )}
                    {field.type === 'phone' && (
                      <Input placeholder={field.placeholder || '+91 9876543210'} type="tel" className="text-xs font-mono" />
                    )}
                    {field.type === 'email' && (
                      <Input placeholder={field.placeholder || 'name@example.com'} type="email" className="text-xs font-mono" />
                    )}
                    {field.type === 'number' && (
                      <Input placeholder={field.placeholder || '0'} type="number" className="text-xs font-mono" />
                    )}
                    {field.type === 'date' && (
                      <Input type="date" className="text-xs" />
                    )}
                  </div>
                )
              })}

              <Button
                type="button"
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-sm"
              >
                Submit Response (Preview Mode)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
