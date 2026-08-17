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
  Heading,
  SlidersHorizontal,
  Loader2,
  Save
} from 'lucide-react'
import { updateForm, checkFormSlugAvailability } from '@/actions/forms/actions'
import { FormField, FieldType } from '@/types/forms'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface EditFormClientProps {
  form: {
    id: string
    title: string
    description?: string | null
    slug?: string | null
    visibility?: 'public' | 'members' | 'private' | null
    is_active: boolean
    fields?: FormField[] | null
  }
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
    label: 'Star Rating (1-5★)',
    icon: Star,
    category: 'survey',
    defaultField: { label: 'Overall Satisfaction / Rating', type: 'rating', required: true, maxRating: 5 },
  },
  {
    type: 'scale',
    label: 'Likert Scale (1-10)',
    icon: SlidersHorizontal,
    category: 'survey',
    defaultField: { label: 'How strongly do you agree with this policy?', type: 'scale', required: true, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree' },
  },
  {
    type: 'radio',
    label: 'Single Choice (Radio)',
    icon: CircleDot,
    category: 'survey',
    defaultField: { label: 'Select your preferred option', type: 'radio', required: true, options: ['Option 1', 'Option 2', 'Option 3'] },
  },
  {
    type: 'checkbox',
    label: 'Multi-Select Checkboxes',
    icon: CheckSquare,
    category: 'survey',
    defaultField: { label: 'Which areas need immediate improvement?', type: 'checkbox', required: false, options: ['Sanitation', 'Roads & Lights', 'Security / Police', 'Public Transport'] },
  },
  {
    type: 'dropdown',
    label: 'Dropdown List',
    icon: ListFilter,
    category: 'survey',
    defaultField: { label: 'Select your locality / ward', type: 'dropdown', required: true, options: ['Ward 1', 'Ward 2', 'Ward 3', 'Other'] },
  },

  // Layout & Sectioning
  {
    type: 'heading',
    label: 'Section Heading',
    icon: Heading,
    category: 'layout',
    defaultField: { label: 'Part 2: Priority Concerns', type: 'heading', description: 'Please share your key grassroots grievances below.' },
  },
]

export function EditFormClient({ form, lang }: EditFormClientProps) {
  const router = useRouter()
  const isHindi = lang === 'hi'

  const [activeMode, setActiveMode] = useState<'build' | 'preview'>('build')
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState(form.title || '')
  const [slug, setSlug] = useState(form.slug || '')
  const [description, setDescription] = useState(form.description || '')
  const [visibility, setVisibility] = useState<'public' | 'members' | 'private'>(form.visibility || 'public')

  const [fields, setFields] = useState<FormField[]>(
    form.fields && form.fields.length > 0
      ? form.fields.map(f => ({ ...f, id: f.id || crypto.randomUUID() }))
      : [
          { id: crypto.randomUUID(), label: 'Full Name', type: 'text', required: true, placeholder: 'e.g. Dr. Ambedkar' },
          { id: crypto.randomUUID(), label: 'Mobile / WhatsApp Number', type: 'phone', required: true, placeholder: '+91 9876543210' },
          { id: crypto.randomUUID(), label: 'Overall Satisfaction / Rating', type: 'rating', required: true, maxRating: 5 },
        ]
  )

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50)
  }

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      toast.error(isHindi ? 'कृपया फॉर्म का शीर्षक दें' : 'Please provide a Form Title')
      return
    }

    setLoading(true)

    try {
      const normalizedSlug = slug.trim() ? slugify(slug) : undefined

      if (normalizedSlug && normalizedSlug !== form.slug) {
        const availability = await checkFormSlugAvailability(normalizedSlug, form.id)
        if (!availability.available) {
          toast.error(availability.error || 'Custom link is already in use')
          setLoading(false)
          return
        }
      }

      const result = await updateForm({
        formId: form.id,
        title: title.trim(),
        description: description.trim() || undefined,
        slug: normalizedSlug,
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

      if (result.success) {
        toast.success(isHindi ? 'फॉर्म सफलतापूर्वक अपडेट हुआ!' : 'Form & survey updated successfully!')
        router.push(`/${lang}/dashboard/forms/${form.id}`)
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to update form')
        setLoading(false)
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href={`/${lang}/dashboard/forms/${form.id}`}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            title="Back to Form Analytics"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-orange-100 text-orange-800">
                {isHindi ? 'फॉर्म संपादन मोड' : 'Form Edit Studio'}
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {form.id.slice(0, 8)}</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
              {isHindi ? 'सर्वेक्षण व प्रश्न संपादित करें' : 'Edit Survey & Questions'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveMode('build')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeMode === 'build' ? 'bg-white text-orange-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings2 size={13} />
              <span>{isHindi ? 'बिल्डर' : 'Builder'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('preview')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeMode === 'preview' ? 'bg-white text-orange-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye size={13} />
              <span>{isHindi ? 'पूर्वावलोकन' : 'Live Preview'}</span>
            </button>
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-orange-700 hover:bg-orange-800 text-white font-extrabold text-xs shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                {isHindi ? 'सहेज रहे हैं...' : 'Saving Changes...'}
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {isHindi ? 'परिवर्तन सहेजें' : 'Save Changes'}
              </>
            )}
          </Button>
        </div>
      </div>

      {activeMode === 'build' ? (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDEBAR: Question Palette */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4 sticky top-6">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <Plus size={16} className="text-orange-700" />
                  <span>{isHindi ? 'प्रश्न व फ़ील्ड जोड़ें' : 'Add Question Types'}</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isHindi ? 'अपने फॉर्म में नया फ़ील्ड जोड़ने के लिए क्लिक करें।' : 'Click any component below to append to your survey.'}
                </p>
              </div>

              {/* Survey & Analytics category */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  {isHindi ? 'सर्वेक्षण व रेटिंग्स' : 'Survey & Scaled Ratings'}
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {FIELD_PALETTE.filter(p => p.category === 'survey').map((p) => {
                    const Icon = p.icon
                    return (
                      <button
                        key={p.type}
                        type="button"
                        onClick={() => handleAddField(p)}
                        className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-100 hover:border-orange-200 hover:bg-orange-50/50 text-left transition-all group"
                      >
                        <div className="w-7 h-7 rounded-md bg-orange-100 text-orange-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                          <Icon size={14} />
                        </div>
                        <span className="text-xs font-bold text-slate-700 group-hover:text-orange-950">{p.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Basic Fields */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  {isHindi ? 'मूल जानकारी' : 'Participant Details'}
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {FIELD_PALETTE.filter(p => p.category === 'basic').map((p) => {
                    const Icon = p.icon
                    return (
                      <button
                        key={p.type}
                        type="button"
                        onClick={() => handleAddField(p)}
                        className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:border-orange-200 hover:bg-orange-50/50 text-left transition-all group"
                      >
                        <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                          <Icon size={12} />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700 truncate">{p.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Layout category */}
              <div className="pt-2 border-t border-slate-100">
                {FIELD_PALETTE.filter(p => p.category === 'layout').map((p) => (
                  <button
                    key={p.type}
                    type="button"
                    onClick={() => handleAddField(p)}
                    className="w-full flex items-center justify-center gap-1.5 p-2 text-xs font-semibold rounded-lg border border-dashed border-slate-200 hover:border-slate-400 bg-white text-slate-600 hover:text-slate-900 transition-all"
                  >
                    <Heading size={13} />
                    <span>{isHindi ? '+ सेक्शन हेडिंग जोड़ें' : '+ Add Section Heading'}</span>
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
                <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>{isHindi ? 'कस्टम फ्रेंडली लिंक (SEO URL Slug)' : 'Custom SEO Link (URL Slug)'}</span>
                  <span className="text-[11px] font-normal text-slate-400 font-mono">
                    sangathan.space/f/{slug || 'custom-slug'}
                  </span>
                </Label>
                <div className="flex items-center">
                  <span className="bg-slate-100 border border-r-0 border-slate-200 text-slate-500 px-3 py-2 rounded-l-md text-xs font-mono select-none">
                    /f/
                  </span>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="e.g. annual-hostel-mess-survey-2026"
                    className="rounded-l-none font-mono text-xs border-slate-200 focus:border-orange-600"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isHindi
                    ? 'यह लिंक याद रखने में आसान है और इसे व्हाट्सएप पर सीधे शेयर किया जा सकता है।'
                    : 'Memorable short link to easily share and forward directly across WhatsApp groups.'}
                </p>
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

                return (
                  <div
                    key={field.id}
                    className={`bg-white p-5 rounded-xl border transition-all ${
                      isHeading
                        ? 'border-orange-200 bg-orange-50/30'
                        : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                          {field.type}
                        </span>
                        {field.required && !isHeading && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                            Required
                          </span>
                        )}
                      </div>

                      {/* Card Action Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveField(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveField(index, 'down')}
                          disabled={index === fields.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ChevronDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateField(field.id)}
                          className="p-1 text-slate-400 hover:text-slate-800"
                          title="Duplicate"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveField(field.id)}
                          className="p-1 text-slate-400 hover:text-red-600"
                          title="Delete Field"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Question Title / Label */}
                    <div className="space-y-3">
                      <div>
                        <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 block">
                          {isHeading ? 'Section Header Text' : 'Question / Prompt'} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={field.label}
                          onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                          placeholder="e.g. How satisfied are you with the mess food?"
                          className="text-xs font-bold border-slate-200"
                        />
                      </div>

                      {/* Subtitle / Helper Description */}
                      <div>
                        <Label className="text-[10px] font-semibold text-slate-500 mb-1 block">
                          Helper Instructions / Subtitle (Optional)
                        </Label>
                        <Input
                          value={field.description || ''}
                          onChange={(e) => handleUpdateField(field.id, { description: e.target.value })}
                          placeholder="Add extra guidance or context for respondents..."
                          className="text-xs border-slate-200"
                        />
                      </div>

                      {/* Scaled Rating Options (Rating / Linear Scale) */}
                      {field.type === 'rating' && (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">Maximum Stars:</span>
                          <select
                            value={field.maxRating || 5}
                            onChange={(e) => handleUpdateField(field.id, { maxRating: Number(e.target.value) })}
                            className="p-1 border border-slate-200 rounded font-mono text-xs"
                          >
                            <option value={3}>3 Stars (★★★)</option>
                            <option value={5}>5 Stars (★★★★★)</option>
                            <option value={10}>10 Stars (★★★★★★★★★★)</option>
                          </select>
                        </div>
                      )}

                      {field.type === 'scale' && (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <Label className="text-[10px] text-slate-500 mb-0.5 block">Left Label (Low)</Label>
                            <Input
                              value={field.minLabel || ''}
                              onChange={(e) => handleUpdateField(field.id, { minLabel: e.target.value })}
                              placeholder="e.g. Strongly Disagree"
                              className="text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-[10px] text-slate-500 mb-0.5 block">Right Label (High)</Label>
                            <Input
                              value={field.maxLabel || ''}
                              onChange={(e) => handleUpdateField(field.id, { maxLabel: e.target.value })}
                              placeholder="e.g. Strongly Agree"
                              className="text-xs"
                            />
                          </div>
                        </div>
                      )}

                      {/* Multiple Choice Options List */}
                      {['radio', 'checkbox', 'dropdown'].includes(field.type) && (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-[11px] font-bold text-slate-700">Choice Options</Label>
                            {/* Preset Buttons */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => applyOptionPreset(field.id, 'yes_no')}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                              >
                                Yes/No
                              </button>
                              <button
                                type="button"
                                onClick={() => applyOptionPreset(field.id, 'agreement')}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                              >
                                Agreement
                              </button>
                              <button
                                type="button"
                                onClick={() => applyOptionPreset(field.id, 'satisfaction')}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                              >
                                Satisfaction
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            {(field.options || []).map((opt, optIdx) => (
                              <div key={optIdx} className="flex items-center gap-2">
                                <span className="text-slate-400 font-mono text-[11px] w-4 text-center">
                                  {optIdx + 1}.
                                </span>
                                <Input
                                  value={opt}
                                  onChange={(e) => handleUpdateOption(field.id, optIdx, e.target.value)}
                                  className="text-xs border-slate-200 bg-white"
                                />
                                {(field.options?.length || 0) > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveOption(field.id, optIdx)}
                                    className="p-1 text-slate-400 hover:text-red-600"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddOption(field.id)}
                            className="text-xs text-orange-700 font-bold hover:underline inline-flex items-center gap-1 mt-1"
                          >
                            <Plus size={12} />
                            <span>Add Choice Option</span>
                          </button>
                        </div>
                      )}

                      {/* Required Toggle */}
                      {!isHeading && (
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                              className="rounded border-slate-300 text-orange-700 focus:ring-orange-500"
                            />
                            <span className="text-xs font-medium text-slate-700">Require respondent to answer</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </form>
      ) : (
        /* LIVE PREVIEW MODE */
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-200 pb-4 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Live Public Form Preview
            </span>
            <h2 className="text-2xl font-black text-slate-900">{title || 'Untitled Survey'}</h2>
            {description && <p className="text-xs text-slate-600 leading-relaxed">{description}</p>}
          </div>

          <div className="space-y-5">
            {fields.map((field, idx) => {
              if (field.type === 'heading') {
                return (
                  <div key={field.id} className="pt-4 border-t border-slate-200">
                    <h3 className="font-black text-lg text-slate-900">{field.label}</h3>
                    {field.description && <p className="text-xs text-slate-500 mt-0.5">{field.description}</p>}
                  </div>
                )
              }

              return (
                <div key={field.id} className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">
                    {idx + 1}. {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.description && <p className="text-[11px] text-slate-500">{field.description}</p>}

                  {field.type === 'text' && (
                    <Input disabled placeholder={field.placeholder || 'Your answer'} className="text-xs" />
                  )}
                  {field.type === 'textarea' && (
                    <Textarea disabled placeholder={field.placeholder || 'Your answer'} rows={3} className="text-xs" />
                  )}
                  {field.type === 'phone' && (
                    <Input disabled placeholder="+91 9876543210" className="text-xs" />
                  )}
                  {field.type === 'rating' && (
                    <div className="flex gap-2 text-amber-400">
                      {Array.from({ length: field.maxRating || 5 }).map((_, i) => (
                        <Star key={i} size={24} className="fill-amber-400 stroke-amber-500" />
                      ))}
                    </div>
                  )}
                  {['radio', 'checkbox'].includes(field.type) && (
                    <div className="space-y-1.5 pt-1">
                      {(field.options || ['Option 1', 'Option 2']).map((opt, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                          <input type={field.type} disabled />
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <Button disabled className="w-full bg-orange-700 text-white font-bold opacity-60">
            Submit Response (Preview Only)
          </Button>
        </div>
      )}
    </div>
  )
}
