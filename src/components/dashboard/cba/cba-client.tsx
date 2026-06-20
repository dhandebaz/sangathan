'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { FileText, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface CBADocument {
  id: string
  title: string
  file_url: string
  status: string
  valid_from: string | null
  valid_until: string | null
  created_at: string | null
}

interface CBAClientProps {
  orgId: string
}

export function CBAClient({ orgId }: CBAClientProps) {
  const [documents, setDocuments] = useState<CBADocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDocuments() {
      const supabase = createClient()
      
      if (orgId) {
        const { data, error } = await supabase
          .from('cba_documents')
          .select('*')
          .eq('organisation_id', orgId)
          .order('created_at', { ascending: false })
          
        if (!error && data) {
          setDocuments(data as CBADocument[])
        }
      }
      setLoading(false)
    }
    
    fetchDocuments()
  }, [])

  function getStatusIcon(status: string) {
    switch (status) {
      case 'active': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'draft': return <Clock className="w-4 h-4 text-blue-500" />
      case 'expired': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CBA Documents</h1>
          <p className="text-muted-foreground mt-2">
            Manage Collective Bargaining Agreements, drafts, and active contracts.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Repository</CardTitle>
          <CardDescription>Your organization's registered contracts.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : documents.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              No CBA documents uploaded yet.
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map(doc => (
                <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3 mb-3 sm:mb-0">
                    <div className="mt-1">
                      {getStatusIcon(doc.status)}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-slate-900">{doc.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 mt-1.5">
                        {doc.valid_until && (
                          <div className="flex items-center text-xs text-muted-foreground gap-1">
                            <Calendar className="w-3 h-3" />
                            Valid until: {new Date(doc.valid_until).toLocaleDateString()}
                          </div>
                        )}
                        <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                          View File
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <Badge variant="secondary" className="capitalize">
                      {doc.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
