'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, Clock, FileText, Upload, Trash2, Plus, X, Download } from 'lucide-react'
import { toast } from 'sonner'
import { updateComplianceItemStatus, deleteComplianceItem, addComplianceItem, uploadComplianceDocument, removeComplianceDocument } from '@/actions/compliance/items'
import type { ComplianceItemRow } from '@/actions/compliance/items'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  not_started: { label: 'Not Started', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <FileText className="w-4 h-4 text-gray-500" /> },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Clock className="w-4 h-4 text-blue-600" /> },
  submitted: { label: 'Submitted', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <Clock className="w-4 h-4 text-yellow-600" /> },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800 border-green-200', icon: <CheckCircle2 className="w-4 h-4 text-green-600" /> },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200', icon: <AlertCircle className="w-4 h-4 text-red-600" /> },
  not_applicable: { label: 'N/A', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <FileText className="w-4 h-4 text-gray-500" /> },
}

const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'not_applicable', label: 'N/A' },
]

function ComplianceItemRow({
  item,
  onStatusChange,
  onDelete,
  onUpload,
  onRemoveDoc,
}: {
  item: ComplianceItemRow
  onStatusChange: (id: string, status: string) => void
  onDelete: (id: string) => void
    onUpload: (id: string, file: File) => Promise<{ success: boolean; error?: string }>
  onRemoveDoc: (id: string) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.not_started

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('application/pdf') && !file.type.startsWith('image/')) {
      toast.error('Invalid file type', { description: 'Only PDF, JPG, or PNG files are accepted.' })
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large', { description: 'Maximum file size is 10MB.' })
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    const res = await onUpload(item.id, file)
    setIsUploading(false)

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card gap-3">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="mt-1 shrink-0">{cfg.icon}</div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm">{item.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{item.category}</span>
            {item.document_name && (
              <a
                href={item.document_url || '#'}
                target="_blank"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded"
              >
                <Download className="w-3 h-3" />
                {item.document_name}
              </a>
            )}
            {item.notes && (
              <span className="text-xs text-muted-foreground italic max-w-xs truncate" title={item.notes}>
                &quot;{item.notes}&quot;
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <select
          value={item.status}
          onChange={(e) => onStatusChange(item.id, e.target.value)}
          className="text-xs border rounded px-2 py-1 bg-background outline-none focus:ring-1 focus:ring-brand-500 max-w-[120px]"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-3 h-3" />
          )}
          {item.document_url ? 'Replace' : 'Upload'}
        </Button>
        {item.document_url && (
          <Button size="sm" variant="ghost" className="h-8 text-red-500 hover:text-red-700" onClick={() => onRemoveDoc(item.id)}>
            <X className="w-3 h-3" />
          </Button>
        )}
        <Button size="sm" variant="ghost" className="h-8 text-muted-foreground hover:text-red-600" onClick={() => onDelete(item.id)}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}

export function ComplianceTracker({
  items: initialItems,
  orgType,
  lang,
}: {
  items: ComplianceItemRow[]
  orgType: string
  lang: string
}) {
  const [items, setItems] = useState(initialItems)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addTitle, setAddTitle] = useState('')
  const [addCategory, setAddCategory] = useState('')
  const [addDescription, setAddDescription] = useState('')

  async function handleStatusChange(id: string, status: string) {
    const res = await updateComplianceItemStatus(id, status)
    if (res.success) {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
      toast.success('Status updated')
    } else {
      toast.error('Failed to update status', { description: res.error })
    }
  }

  async function handleDelete(id: string) {
    const res = await deleteComplianceItem(id)
    if (res.success) {
      setItems((prev) => prev.filter((i) => i.id !== id))
      toast.success('Item removed')
    } else {
      toast.error('Failed to delete', { description: res.error })
    }
  }

  async function handleUpload(id: string, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await uploadComplianceDocument(id, formData)
    if (res.success) {
      toast.success('Document uploaded')
    } else {
      toast.error('Upload failed', { description: res.error })
    }
    return res
  }

  async function handleRemoveDoc(id: string) {
    const res = await removeComplianceDocument(id)
    if (res.success) {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, document_url: null, document_name: null, document_size: null } : i))
      )
      toast.success('Document removed')
    } else {
      toast.error('Failed to remove document', { description: res.error })
    }
  }

  async function handleAddItem() {
    if (!addTitle.trim() || !addCategory.trim()) {
      toast.error('Title and category are required')
      return
    }
    const formData = new FormData()
    formData.append('title', addTitle)
    formData.append('category', addCategory)
    formData.append('description', addDescription)
    const res = await addComplianceItem(formData)
    if (res.success) {
      toast.success('Compliance item added')
      setAddTitle('')
      setAddCategory('')
      setAddDescription('')
      setIsAddOpen(false)
      window.location.reload()
    } else {
      toast.error('Failed to add item', { description: res.error })
    }
  }

  const statusCounts = items.reduce(
    (acc, i) => {
      acc[i.status] = (acc[i.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const approvedCount = statusCounts.approved || 0
  const notApplicableCount = statusCounts.not_applicable || 0
  const totalApplicable = items.length - notApplicableCount
  const progressPct = totalApplicable > 0 ? Math.round((approvedCount / totalApplicable) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Compliance Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage certifications, registrations, and legal requirements for your organisation.
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add Requirement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Compliance Requirement</DialogTitle>
              <DialogDescription>
                Track a new certification, registration, or legal requirement for your organisation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Title</label>
                <input
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="e.g. GST Registration"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Category</label>
                <input
                  value={addCategory}
                  onChange={(e) => setAddCategory(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="e.g. Tax, Legal, Safety"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Description (optional)</label>
                <textarea
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                  rows={2}
                  placeholder="Brief description of this requirement"
                />
              </div>
              <Button className="w-full" onClick={handleAddItem}>Add Requirement</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{items.length}</div>
            <div className="text-xs text-muted-foreground">Total Requirements</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <div className="text-xs text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.in_progress || 0 + statusCounts.submitted || 0}</div>
            <div className="text-xs text-muted-foreground">In Progress / Submitted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{progressPct}%</div>
            <div className="text-xs text-muted-foreground">Completion Progress</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{orgType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Requirements</CardTitle>
          <CardDescription>
            Upload supporting documents and track progress for each requirement. Documents are stored securely and only visible to org admins.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No compliance requirements added yet. Click &quot;Add Requirement&quot; to get started.
            </p>
          )}
          {items.map((item) => (
            <ComplianceItemRow
              key={item.id}
              item={item}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onUpload={handleUpload}
              onRemoveDoc={handleRemoveDoc}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
