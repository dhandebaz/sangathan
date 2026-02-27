'use client'

import { useState } from 'react'
import { Download, Shield, FileJson } from 'lucide-react'
import { exportData } from '@/actions/data-export'
import { toast } from 'sonner'

export default function DataExportPage() {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const result = await exportData({})
      
      if (result.success && result.data) {
        // Trigger download
        const blob = new Blob([JSON.stringify(result.data.data, null, 2)], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = result.data.filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast.success('Export complete. Your data has been downloaded.')
      } else {
        toast.error(result.error || 'Export failed')
      }
    } catch (err) {
      toast.error('An unexpected error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Data Sovereignty</h1>
        <p className="text-gray-500 mt-1">
          Export your organisation's data at any time. No lock-in, ever.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start gap-4">
           <div className="bg-blue-50 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
           </div>
           <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Full Data Export</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                 Download a complete JSON archive of your organisation's members, forms, financial logs, and audit trails. 
                 This file adheres to the Open Civic Data standard (where applicable) and allows you to migrate to other systems 
                 or maintain offline backups.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-600 border border-gray-100">
                 <strong>Includes:</strong>
                 <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Membership Registry (PII included)</li>
                    <li>Financial Ledger & Donation Records</li>
                    <li>Form Definitions & Submissions</li>
                    <li>Meeting Minutes & Attendance</li>
                    <li>Immutable Audit Logs</li>
                 </ul>
              </div>

              <button
                onClick={handleExport}
                disabled={loading}
                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Download size={18} />
                    Download Archive
                  </>
                )}
              </button>
              
              <p className="text-xs text-gray-400 mt-3">
                 Note: This export contains sensitive data. Please store it securely.
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}
