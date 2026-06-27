'use client'

import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { updateComplianceData } from '@/actions/organisation/compliance'
import { Database } from '@/types/database'
import { Upload, ExternalLink } from 'lucide-react'
import Link from 'next/link'

type Org = {
  id: string
  registration_status: Database["public"]["Enums"]["registration_status"] | null
  registration_number: string | null
  incorporation_date: string | null
  tax_id: string | null
  darpan_id: string | null
  compliance_documents: unknown
}

const complianceSchema = z.object({
  registration_status: z.enum(['registered', 'unregistered', 'in_progress']),
  registration_number: z.string().optional().nullable(),
  incorporation_date: z.string().optional().nullable(),
  tax_id: z.string().optional().nullable(),
  darpan_id: z.string().optional().nullable(),
})

type ComplianceFormValues = z.infer<typeof complianceSchema>

export function ComplianceManager({ org }: { org: Org }) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ComplianceFormValues>({
    resolver: zodResolver(complianceSchema),
    defaultValues: {
      registration_status: org.registration_status || 'unregistered',
      registration_number: org.registration_number || '',
      incorporation_date: org.incorporation_date || '',
      tax_id: org.tax_id || '',
      darpan_id: org.darpan_id || '',
    },
  })

  const status = useWatch({ control: form.control, name: 'registration_status' })

  async function onSubmit(data: ComplianceFormValues) {
    setIsLoading(true)
    try {
      const res = await updateComplianceData(org.id, data)
      setIsLoading(false)

      if (res.success) {
        toast.success('Compliance settings updated')
      } else {
        toast.error('Failed to update', { description: res.error })
      }
    } catch {
      setIsLoading(false)
      toast.error('Error updating compliance details')
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-1">Legal & Compliance Engine</h2>
          <p className="text-sm text-gray-500">
            Keep your organisation compliant, maintain public trust, and manage official documents securely.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Registration Status</label>
            <select
              {...form.register('registration_status')}
              className="w-full max-w-sm border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-black outline-none"
            >
              <option value="unregistered">Unregistered / Informal Group</option>
              <option value="in_progress">Registration In Progress</option>
              <option value="registered">Formally Registered</option>
            </select>
          </div>

          {status === 'unregistered' && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">How Sangathan Helps You</h3>
              <p className="text-sm text-blue-800">
                Operating as an informal group is completely fine! Sangathan helps you build a solid foundation by 
                tracking your members, standardizing your operations, and keeping transparent records. Once you are 
                ready to register officially (as a Trust, Society, or Section 8 Company), you can export your records 
                from here to make the legal process much easier.
              </p>
            </div>
          )}

          {status === 'registered' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Registration Number</label>
                <input
                  {...form.register('registration_number')}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-black outline-none"
                  placeholder="e.g. MH/2021/123456"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Incorporation Date</label>
                <input
                  type="date"
                  {...form.register('incorporation_date')}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-black outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Tax ID / PAN</label>
                <input
                  {...form.register('tax_id')}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-black outline-none"
                  placeholder="e.g. ABCDE1234F"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">NGO Darpan ID (Optional)</label>
                <input
                  {...form.register('darpan_id')}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-black outline-none"
                  placeholder="e.g. MH/2021/0123456"
                />
                <p className="text-xs text-gray-500">Only applicable for Indian NGOs.</p>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Compliance Settings'}
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">Document Vault</h2>
            <p className="text-sm text-gray-500">
              Upload and manage compliance documents like Trust Deed, By-laws, PAN Card, and certifications.
            </p>
          </div>
          <Link
            href="/en/dashboard/compliance"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Open Compliance Tracker
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-center space-y-3">
          <div className="bg-gray-100 p-3 rounded-full">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Manage documents in the Compliance Tracker</p>
            <p className="text-xs text-gray-500">Upload, track status, and manage all your compliance requirements in one place.</p>
          </div>
          <Link
            href="/en/dashboard/compliance"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 mt-1"
          >
            Go to Compliance Tracker
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  )
}
