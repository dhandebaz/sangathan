'use client'

import { useState } from 'react'
import { submitFormResponse } from '@/actions/forms/actions'
import { FormField } from '@/types/forms'
import { Star, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface Form {
  id: string
  title?: string
  description?: string | null
  fields: FormField[] // JSONB
}

interface PublicFormProps {
  form: Form
  csrfToken: string
}

export function PublicForm({ form, csrfToken }: PublicFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [answers, setAnswers] = useState<Record<string, any>>({})

  const fields = form.fields || []
  const interactiveFields = fields.filter(f => f.type !== 'heading')

  function handleFieldChange(fieldId: string, value: any) {
    setAnswers(prev => ({ ...prev, [fieldId]: value }))
    if (fieldErrors[fieldId]) {
      setFieldErrors(prev => {
        const next = { ...prev }
        delete next[fieldId]
        return next
      })
    }
  }

  function handleCheckboxToggle(fieldId: string, option: string) {
    const currentList: string[] = Array.isArray(answers[fieldId]) ? answers[fieldId] : []
    const updated = currentList.includes(option)
      ? currentList.filter(o => o !== option)
      : [...currentList, option]
    handleFieldChange(fieldId, updated)
  }

  // Calculate completion percentage
  const completedCount = interactiveFields.filter(f => {
    const val = answers[f.id]
    if (Array.isArray(val)) return val.length > 0
    return val !== undefined && val !== null && String(val).trim() !== ''
  }).length

  const progressPercent = interactiveFields.length > 0
    ? Math.round((completedCount / interactiveFields.length) * 100)
    : 0

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setFieldErrors({})

    const formData = new FormData(e.currentTarget)
    const honeypot = (formData.get('website_url') as string) || ''

    // Construct submission data
    const submissionData: Record<string, any> = {}
    interactiveFields.forEach(f => {
      if (answers[f.id] !== undefined) {
        submissionData[f.id] = answers[f.id]
      } else {
        const formVal = formData.get(f.id)
        if (formVal !== null && formVal !== '') {
          submissionData[f.id] = formVal
        }
      }
    })

    // Local client validation
    const errors: Record<string, string> = {}
    interactiveFields.forEach(f => {
      const val = submissionData[f.id]
      if (f.required && (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0))) {
        errors[f.id] = `${f.label} is required`
      }
      if (val && f.type === 'phone') {
        const digits = String(val).replace(/\D/g, '')
        if (digits.length < 10) {
          errors[f.id] = 'Please enter a valid 10-digit mobile number'
        }
      }
    })

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setError('Please fill in all required questions.')
      setLoading(false)
      return
    }

    try {
      const result = await submitFormResponse({
        formId: form.id,
        data: submissionData,
        honeypot,
        csrfToken,
      })

      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || 'Submission failed. Please try again.')
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors)
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-3xl">
          <CheckCircle size={36} />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Response Recorded!</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Thank you for sharing your feedback. Your submission has been securely registered in the organisation registry.
        </p>
        <div className="pt-4">
          <button
            type="button"
            onClick={() => {
              setSuccess(false)
              setAnswers({})
              setFieldErrors({})
            }}
            className="text-xs font-bold text-orange-700 hover:text-orange-900 underline"
          >
            Submit another response
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot Field */}
      <div className="hidden">
        <input name="website_url" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Progress Bar */}
      {interactiveFields.length > 3 && (
        <div className="space-y-1 pb-2 border-b border-slate-100">
          <div className="flex justify-between text-[11px] font-bold text-slate-500">
            <span>Progress: {completedCount} of {interactiveFields.length} answered</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-100 flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {fields.map((field) => {
          const isHeading = field.type === 'heading'
          const hasError = !!fieldErrors[field.id]
          const currentValue = answers[field.id]

          if (isHeading) {
            return (
              <div key={field.id} className="pt-4 border-t border-slate-100 first:border-t-0 first:pt-0">
                <h3 className="font-extrabold text-base text-slate-900">{field.label}</h3>
                {field.description && (
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{field.description}</p>
                )}
              </div>
            )
          }

          return (
            <div key={field.id} className="space-y-2">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-0.5">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.description && (
                  <p className="text-[11px] text-slate-500 mb-1.5 leading-relaxed">{field.description}</p>
                )}
              </div>

              {/* 1-5 Star Rating */}
              {field.type === 'rating' && (
                <div className="pt-1">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isSelected = currentValue >= star
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleFieldChange(field.id, star)}
                          className={`p-1.5 rounded-lg transition-transform hover:scale-115 ${
                            isSelected ? 'text-amber-400' : 'text-slate-200 hover:text-amber-300'
                          }`}
                        >
                          <Star size={28} fill={isSelected ? 'currentColor' : 'none'} strokeWidth={1.5} />
                        </button>
                      )
                    })}
                    {currentValue && (
                      <span className="text-xs font-bold text-slate-600 ml-2 font-mono">
                        {currentValue} / 5
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Likert Scale (1 to 5) */}
              {field.type === 'scale' && (
                <div className="space-y-1.5 pt-1">
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((score) => {
                      const isSelected = currentValue === score
                      return (
                        <button
                          key={score}
                          type="button"
                          onClick={() => handleFieldChange(field.id, score)}
                          className={`py-3 text-xs font-bold rounded-xl border transition-all ${
                            isSelected
                              ? 'border-orange-600 bg-orange-50 text-orange-950 ring-2 ring-orange-400 font-extrabold'
                              : 'border-slate-200 bg-white hover:border-orange-300 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          {score}
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium px-1">
                    <span>{field.minLabel || '1 - Poor / Disagree'}</span>
                    <span>{field.maxLabel || '5 - Excellent / Agree'}</span>
                  </div>
                </div>
              )}

              {/* Single Choice (Radio Pills) */}
              {field.type === 'radio' && (
                <div className="space-y-1.5 pt-1">
                  {(field.options || []).map((opt, i) => {
                    const isSelected = currentValue === opt
                    return (
                      <label
                        key={i}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50/50 text-orange-950 font-bold'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name={field.id}
                          value={opt}
                          checked={isSelected}
                          onChange={() => handleFieldChange(field.id, opt)}
                          className="text-orange-700 focus:ring-orange-600"
                        />
                        <span className="text-xs">{opt}</span>
                      </label>
                    )
                  })}
                </div>
              )}

              {/* Multiple Choice (Checkboxes) */}
              {field.type === 'checkbox' && (
                <div className="space-y-1.5 pt-1">
                  {(field.options || []).map((opt, i) => {
                    const currentList: string[] = Array.isArray(currentValue) ? currentValue : []
                    const isSelected = currentList.includes(opt)
                    return (
                      <label
                        key={i}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-orange-600 bg-orange-50/50 text-orange-950 font-bold'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleCheckboxToggle(field.id, opt)}
                          className="rounded border-slate-300 text-orange-700 focus:ring-orange-600"
                        />
                        <span className="text-xs">{opt}</span>
                      </label>
                    )
                  })}
                </div>
              )}

              {/* Yes / No Binary Decision */}
              {field.type === 'yes_no' && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleFieldChange(field.id, 'Yes')}
                    className={`py-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      currentValue === 'Yes'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500'
                        : 'border-slate-200 bg-white hover:border-emerald-400 text-slate-700'
                    }`}
                  >
                    ✓ Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFieldChange(field.id, 'No')}
                    className={`py-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      currentValue === 'No'
                        ? 'border-red-600 bg-red-50 text-red-950 ring-2 ring-red-500'
                        : 'border-slate-200 bg-white hover:border-red-400 text-slate-700'
                    }`}
                  >
                    ✕ No
                  </button>
                </div>
              )}

              {/* Dropdown Menu */}
              {field.type === 'dropdown' && (
                <select
                  value={currentValue || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className={`w-full p-2.5 text-xs rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium ${
                    hasError ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                  }`}
                >
                  <option value="">-- Select an option --</option>
                  {(field.options || []).map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {/* Short Text */}
              {field.type === 'text' && (
                <input
                  type="text"
                  value={currentValue || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder || 'Enter your response...'}
                  className={`w-full p-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    hasError ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
              )}

              {/* Long Text / Textarea */}
              {field.type === 'textarea' && (
                <textarea
                  rows={4}
                  value={currentValue || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder || 'Write your detailed suggestions or remarks here...'}
                  className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed ${
                    hasError ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
              )}

              {/* Phone (+91) */}
              {field.type === 'phone' && (
                <input
                  type="tel"
                  value={currentValue || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder || '+91 9876543210'}
                  className={`w-full p-2.5 text-xs font-mono rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    hasError ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
              )}

              {/* Email */}
              {field.type === 'email' && (
                <input
                  type="email"
                  value={currentValue || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder || 'name@example.com'}
                  className={`w-full p-2.5 text-xs font-mono rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    hasError ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
              )}

              {/* Number */}
              {field.type === 'number' && (
                <input
                  type="number"
                  value={currentValue || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder || '0'}
                  className={`w-full p-2.5 text-xs font-mono rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    hasError ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
              )}

              {/* Date */}
              {field.type === 'date' && (
                <input
                  type="date"
                  value={currentValue || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className={`w-full p-2.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                    hasError ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                  }`}
                />
              )}

              {hasError && (
                <p className="text-[11px] font-semibold text-red-600 mt-1">{fieldErrors[field.id]}</p>
              )}
            </div>
          )
        })}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-900 hover:bg-orange-700 text-white font-extrabold py-3.5 rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting Response...
          </>
        ) : (
          'Submit Response'
        )}
      </button>
    </form>
  )
}
