'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { createForm } from '@/actions/forms/actions'
import Link from 'next/link'

type FieldType = 'text' | 'number' | 'phone' | 'textarea' | 'dropdown'

interface FormField {
  id: string
  label: string
  type: FieldType
  required: boolean
  options?: string[]
}

export default function NewFormPage() {
  const router = useRouter()
  const params = useParams() as { lang?: string }
  const lang = params.lang || 'en'
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fields, setFields] = useState<FormField[]>([
    { id: crypto.randomUUID(), label: 'Name', type: 'text', required: true }
  ])

  const addField = () => {
    setFields([...fields, { id: crypto.randomUUID(), label: 'New Field', type: 'text', required: false }])
  }

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id))
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await createForm({
      title,
      description,
      fields: fields.map(f => ({
         id: f.id,
         label: f.label,
         type: f.type,
         required: f.required,
         options: f.options
      }))
    })

    if (result.success) {
      router.push(`/${lang}/dashboard/forms`)
    } else {
      alert(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
         <Link href={`/${lang}/dashboard/forms`} className="text-gray-500 hover:text-black">
            <ArrowLeft size={20} />
         </Link>
         <h1 className="text-2xl font-bold">Create New Form</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="content-card rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Form Title</label>
            <input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-orange-500 outline-none text-lg font-medium"
              placeholder="e.g., Volunteer Registration"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Describe the purpose of this form..."
              rows={2}
            />
          </div>
        </div>

        <div className="space-y-4">
           {fields.map((field) => (
             <div key={field.id} className="content-card rounded-lg p-4 relative group">
                <div className="absolute top-4 right-4">
                   <button 
                      type="button" 
                      onClick={() => removeField(field.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                   </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                   <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                      <input 
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        className="w-full border rounded p-2 text-sm"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                      <select
                        value={field.type}
                        onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                        className="w-full border rounded p-2 text-sm bg-white"
                      >
                         <option value="text">Short Text</option>
                         <option value="textarea">Long Text</option>
                         <option value="number">Number</option>
                         <option value="phone">Phone Number</option>
                         <option value="dropdown">Dropdown</option>
                      </select>
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      Required Field
                   </label>
                </div>
             </div>
           ))}
        </div>

        <button 
           type="button"
           onClick={addField}
           className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 flex items-center justify-center gap-2 font-medium"
        >
           <Plus size={18} />
           Add Field
        </button>

        <div className="flex justify-end pt-4 border-t">
           <button 
              type="submit"
              disabled={loading}
              className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
           >
              {loading ? 'Creating...' : 'Create Form'}
           </button>
        </div>
      </form>
    </div>
  )
}
