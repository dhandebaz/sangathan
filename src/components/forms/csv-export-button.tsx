'use client'

import { Download } from 'lucide-react'
import { useState } from 'react'

interface CsvExportButtonProps {
  data: any[]
  filename?: string
}

export function CsvExportButton({ data, filename = 'export.csv' }: CsvExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => {
    try {
      setIsExporting(true)
      
      if (!data || data.length === 0) {
        alert('No data to export')
        return
      }

      // 1. Get all unique keys (headers)
      // We flatten the 'data' field if it exists, or just use the object keys
      // For form submissions, we have 'data' JSONB field.
      
      const headers = new Set<string>()
      const flattenedData = data.map(item => {
        const flat: Record<string, any> = {
          id: item.id,
          submitted_at: new Date(item.submitted_at).toISOString(),
          ...item.data // Spread the form data
        }
        Object.keys(flat).forEach(k => headers.add(k))
        return flat
      })

      const headerArray = Array.from(headers)
      
      // 2. Create CSV Content
      const csvContent = [
        headerArray.join(','), // Header row
        ...flattenedData.map(row => 
          headerArray.map(header => {
            const val = row[header]
            if (val === null || val === undefined) return ''
            const stringVal = String(val)
            // Escape quotes and wrap in quotes if contains comma
            if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
              return `"${stringVal.replace(/"/g, '""')}"`
            }
            return stringVal
          }).join(',')
        )
      ].join('\n')

      // 3. Trigger Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export CSV')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button 
      onClick={handleExport}
      disabled={isExporting}
      className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
    >
      <Download size={14} />
      {isExporting ? 'Exporting...' : 'Export CSV'}
    </button>
  )
}
