'use client'

import { useState } from 'react'
import { submitFormResponse } from '@/actions/forms/actions'

type FieldType = 'text' | 'number' | 'phone' | 'textarea' | 'dropdown'

interface FormField {
  id: string
  label: string
  type: FieldType
  required: boolean
  options?: string[]
}

interface Form {
  id: string
  fields: any // JSONB
}

export function PublicForm({ form }: { form: Form }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  
  const fields = form.fields as FormField[]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setFieldErrors({})

    const formData = new FormData(e.currentTarget)
    const data: Record<string, any> = {}
    
    fields.forEach(field => {
       data[field.id] = formData.get(field.id)
    })

    const honeypot = formData.get('website_url') as string

    const result = await submitFormResponse({
       formId: form.id,
       data,
       honeypot
    })

    if (result.success) {
       setSuccess(true)
    } else {
       setError(result.error || 'Submission failed')
       if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors)
       }
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center py-12">
         <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
           ✓
         </div>
         <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
         <p className="text-gray-500">Your response has been recorded successfully.</p>
         <button 
           onClick={() => window.location.reload()}
           className="mt-6 text-orange-600 hover:text-orange-700 font-medium underline"
         >
           Submit another response
         </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot Field - Hidden */}
      <div className="hidden">
         <input name="website_url" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100">
           {error}
        </div>
      )}

      {fields.map((field) => (
        <div key={field.id}>
           <label className="block text-sm font-medium text-gray-700 mb-1">
             {field.label} {field.required && <span className="text-red-500">*</span>}
           </label>
           
           {field.type === 'textarea' ? (
             <textarea
               name={field.id}
               required={field.required}
               rows={3}
               className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${
                 fieldErrors[field.id] ? 'border-red-500 bg-red-50' : 'border-gray-200'
               }`}
             />
           ) : field.type === 'dropdown' ? (
             <select
               name={field.id}
               required={field.required}
               className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none bg-white transition-all ${
                 fieldErrors[field.id] ? 'border-red-500 bg-red-50' : 'border-gray-200'
               }`}
             >
                <option value="">Select an option...</option>
                {field.options?.map(opt => (
                   <option key={opt} value={opt}>{opt}</option>
                ))}
             </select>
           ) : (
             <input
               type={field.type === 'phone' ? 'tel' : field.type === 'number' ? 'number' : 'text'}
               name={field.id}
               required={field.required}
               className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all ${
                 fieldErrors[field.id] ? 'border-red-500 bg-red-50' : 'border-gray-200'
               }`}
             />
           )}
           
           {fieldErrors[field.id] && (
             <p className="text-xs text-red-500 mt-1">{fieldErrors[field.id]}</p>
           )}
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg font-bold text-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
