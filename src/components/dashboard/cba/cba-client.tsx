'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { FileText, Calendar, CheckCircle2, Clock, AlertCircle, Plus, MoreVertical } from 'lucide-react'
import { uploadCBADocument, updateCBAStatus } from '@/actions/cba'
import { toast } from 'sonner'

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
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({ title: '', file_url: '', valid_from: '', valid_until: '' })
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

  const handleUpload = async () => {
    try {
      await uploadCBADocument({
        title: uploadForm.title,
        file_url: uploadForm.file_url,
        valid_from: uploadForm.valid_from || undefined,
        valid_until: uploadForm.valid_until || undefined
      })
      toast.success('Success')
      setIsUploadOpen(false)
      // Optimistically reload
      window.location.reload()
    } catch (e: any) {
      toast.error('Error')
    }
  }

  const handleStatusChange = async (docId: string, status: any) => {
    try {
      await updateCBAStatus({ document_id: docId, status })
      toast.success('Status Updated', { description: 'Document status changed successfully.'  })
      setDocuments(docs => docs.map(d => d.id === docId ? { ...d, status } : d))
    } catch (e: any) {
      toast.error('Error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">CBA Documents</h1>
          <p className="text-muted-foreground mt-2">
            Manage Collective Bargaining Agreements, drafts, and active contracts.
          </p>
        </div>
        
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Upload Document</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Upload CBA Document</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Document Title</Label>
                <Input value={uploadForm.title} onChange={e => setUploadForm({...uploadForm, title: e.target.value})} placeholder="e.g. Master CBA 2026-2028" />
              </div>
              <div className="space-y-2">
                <Label>File URL (Google Drive / S3 / PDF Link)</Label>
                <Input type="url" value={uploadForm.file_url} onChange={e => setUploadForm({...uploadForm, file_url: e.target.value})} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valid From</Label>
                  <Input type="date" value={uploadForm.valid_from} onChange={e => setUploadForm({...uploadForm, valid_from: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <Input type="date" value={uploadForm.valid_until} onChange={e => setUploadForm({...uploadForm, valid_until: e.target.value})} />
                </div>
              </div>
              <Button className="w-full" onClick={handleUpload}>Save Document</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Repository</CardTitle>
          <CardDescription>Your organization&apos;s registered contracts.</CardDescription>
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
                    <Badge variant={doc.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                      {doc.status}
                    </Badge>
                    <Select value={doc.status} onValueChange={(val) => handleStatusChange(doc.id, val)}>
                      <SelectTrigger className="w-[110px] h-8 bg-transparent border-0 shadow-none hover:bg-accent hover:text-accent-foreground focus:ring-0">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent align="end">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="archived">Archive</SelectItem>
                      </SelectContent>
                    </Select>
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
