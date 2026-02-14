'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { submitAppeal } from '@/actions/governance'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

export function AppealForm({ orgId }: { orgId: string }) {
  const [loading, setLoading] = useState(false)
  const [reason, setReason] = useState('')
  const [url, setUrl] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const res = await submitAppeal(orgId, { reason, supporting_docs_url: url })
    
    setLoading(false)
    if (res.success) {
      router.refresh()
    } else {
      alert(res.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
      <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex gap-3 text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
        <p>
          Appeals are reviewed by the platform governance team. Please provide a detailed explanation 
          of why you believe the suspension or restriction was applied in error.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Reason for Appeal</Label>
        <textarea 
          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
          value={reason} 
          onChange={e => setReason(e.target.value)} 
          placeholder="Explain the context..."
        />
      </div>

      <div className="space-y-2">
        <Label>Supporting Document URL (Optional)</Label>
        <Input 
          type="url" 
          value={url} 
          onChange={e => setUrl(e.target.value)} 
          placeholder="https://drive.google.com/..." 
        />
        <p className="text-xs text-gray-500">Link to a public folder or document.</p>
      </div>

      <Button type="submit" disabled={loading || reason.length < 10} className="w-full">
        {loading ? 'Submitting...' : 'Submit Appeal'}
      </Button>
    </form>
  )
}
