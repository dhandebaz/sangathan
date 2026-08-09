'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  FolderLock,
  Upload,
  FileText,
  Shield,
  Download,
  Trash2,
  Share2,
  Search,
  Plus,
  Lock,
  Globe,
  FileCheck,
  Building,
  HardDrive,
  Sparkles
} from 'lucide-react'
import type { OrgDocument } from '@/actions/documents'
import { createDocumentRecord, deleteDocumentRecord, updateDocumentAccessLevel } from '@/actions/documents'
import { useRouter } from 'next/navigation'

interface DocumentVaultProps {
  documents: OrgDocument[]
  orgId: string
  orgType: string
  lang: string
  isAdmin: boolean
}

const CATEGORIES = [
  { id: 'all', labelEn: 'All Files', labelHi: 'सभी दस्तावेज़', icon: HardDrive },
  { id: 'statutory', labelEn: 'Statutory & Legal', labelHi: 'वैधानिक व कानूनी', icon: Shield },
  { id: 'agreements', labelEn: 'Bipartite & CBAs', labelHi: 'समझौते व CBA', icon: FileCheck },
  { id: 'agm_circulars', labelEn: 'AGM & Circulars', labelHi: 'AGM व परिपत्र', icon: FileText },
  { id: 'property_deeds', labelEn: 'Asset & Deeds', labelHi: 'परिसंपत्ति व विलेख', icon: Building },
  { id: 'media', labelEn: 'Press & Media', labelHi: 'प्रेस व मीडिया', icon: Share2 },
]

export function DocumentVault({ documents: initialDocs, orgId, orgType, lang, isAdmin }: DocumentVaultProps) {
  const router = useRouter()
  const isHindi = lang === 'hi'

  const [docs, setDocs] = useState<OrgDocument[]>(initialDocs)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Upload Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<'statutory' | 'agreements' | 'agm_circulars' | 'property_deeds' | 'media' | 'general'>('statutory')
  const [accessLevel, setAccessLevel] = useState<'public' | 'members_only' | 'executives_only'>('members_only')
  const [fileUrl, setFileUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(1024 * 50)
  const [tagsInput, setTagsInput] = useState('')

  const filteredDocs = docs.filter((d) => {
    const matchesCat = selectedCategory === 'all' || d.category === selectedCategory
    const matchesSearch =
      !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.file_name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  async function handleCreateDoc(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !fileUrl.trim()) {
      toast.error(isHindi ? 'कृपया शीर्षक और फाइल लिंक दर्ज करें' : 'Please provide title and file URL')
      return
    }

    setIsUploading(true)
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const res = await createDocumentRecord(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        file_url: fileUrl.trim(),
        file_name: fileName.trim() || `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        file_size: fileSize,
        mime_type: 'application/pdf',
        category,
        access_level: accessLevel,
        tags,
      },
      orgId
    )

    setIsUploading(false)

    if (res.success && res.document) {
      setDocs([res.document as OrgDocument, ...docs])
      setIsUploadOpen(false)
      setTitle('')
      setDescription('')
      setFileUrl('')
      setFileName('')
      setTagsInput('')
      toast.success(isHindi ? 'दस्तावेज़ वॉल्ट में सुरक्षित रूप से जोड़ा गया' : 'Document securely added to Vault')
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to upload document')
    }
  }

  async function handleDelete(docId: string) {
    if (!confirm(isHindi ? 'क्या आप वाकई इस दस्तावेज़ को हटाना चाहते हैं?' : 'Are you sure you want to delete this document?')) {
      return
    }

    const res = await deleteDocumentRecord(docId, orgId)
    if (res.success) {
      setDocs(docs.filter((d) => d.id !== docId))
      toast.success(isHindi ? 'दस्तावेज़ हटा दिया गया' : 'Document deleted')
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to delete')
    }
  }

  async function handleToggleAccess(docId: string, currentAccess: 'public' | 'members_only' | 'executives_only') {
    const nextAccess: 'public' | 'members_only' | 'executives_only' =
      currentAccess === 'public' ? 'members_only' : currentAccess === 'members_only' ? 'executives_only' : 'public'

    const res = await updateDocumentAccessLevel(docId, orgId, nextAccess)
    if (res.success) {
      setDocs(docs.map((d) => (d.id === docId ? { ...d, access_level: nextAccess } : d)))
      toast.success(isHindi ? 'पहुंच स्तर अपडेट किया गया' : `Access level updated to ${nextAccess}`)
    } else {
      toast.error(res.error || 'Failed to update access level')
    }
  }

  const statutoryCount = docs.filter((d) => d.category === 'statutory').length
  const publicCount = docs.filter((d) => d.access_level === 'public').length
  const totalStorage = docs.reduce((acc, d) => acc + (d.file_size || 0), 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700 mb-1">
            <FolderLock className="w-4 h-4" />
            {isHindi ? 'सार्वभौमिक दस्तावेज़ वॉल्ट' : 'Universal Document & Asset Vault'}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isHindi ? 'दस्तावेज़ एवं परिसंपत्ति क्लाउड' : 'Institutional Document Cloud'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isHindi
              ? 'वैधानिक पंजीकरण, 12A/80G, CBA समझौते, AGM परिपत्र और स्वामित्व विलेखों का सुरक्षित डिजिटल भंडार।'
              : 'Encrypted, sovereign repository for statutory registrations, Trust Deeds, CBAs, AGM circulars, and asset conveyance deeds.'}
          </p>
        </div>

        {isAdmin && (
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-700 hover:bg-orange-800 text-white font-bold text-xs rounded-xl shadow-sm gap-2">
                <Plus className="w-4 h-4" />
                {isHindi ? 'नया दस्तावेज़ जोड़ें' : 'Upload Document'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-white border border-slate-200">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900">
                  {isHindi ? 'वॉल्ट में दस्तावेज़ जोड़ें' : 'Add Document to Vault'}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  {isHindi
                    ? 'संस्थागत फ़ाइल मेटाडेटा, श्रेणी और पहुंच स्तर सेट करें।'
                    : 'Configure file metadata, institutional category, and role-based permissions.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateDoc} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-900">
                    {isHindi ? 'दस्तावेज़ का शीर्षक' : 'Document Title'} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Registered Trust Deed 2026 / 80G Certificate"
                    className="text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-900">
                      {isHindi ? 'श्रेणी' : 'Category'}
                    </Label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="statutory">{isHindi ? 'वैधानिक व कानूनी (Statutory)' : 'Statutory & Legal'}</option>
                      <option value="agreements">{isHindi ? 'समझौते व CBA (Agreements)' : 'Bipartite & CBAs'}</option>
                      <option value="agm_circulars">{isHindi ? 'AGM व परिपत्र (Circulars)' : 'AGM & Circulars'}</option>
                      <option value="property_deeds">{isHindi ? 'विलेख व संपत्ति (Deeds)' : 'Asset & Deeds'}</option>
                      <option value="media">{isHindi ? 'प्रेस व मीडिया (Media)' : 'Press & Media'}</option>
                      <option value="general">{isHindi ? 'सामान्य (General)' : 'General Files'}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-900">
                      {isHindi ? 'पहुंच स्तर' : 'Access Level'}
                    </Label>
                    <select
                      value={accessLevel}
                      onChange={(e) => setAccessLevel(e.target.value as any)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="members_only">{isHindi ? 'केवल सदस्य (Members Only)' : 'Members Only'}</option>
                      <option value="executives_only">{isHindi ? 'केवल कार्यकारी (Executives Only)' : 'Executives Only'}</option>
                      <option value="public">{isHindi ? 'सार्वजनिक (Public Shareable)' : 'Public Shareable'}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-900">
                    {isHindi ? 'फाइल यूआरएल / स्टोरेज लिंक' : 'File URL / Cloud Link'} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={fileUrl}
                    onChange={(e) => {
                      setFileUrl(e.target.value)
                      if (!fileName && e.target.value) {
                        const parts = e.target.value.split('/')
                        setFileName(parts[parts.length - 1] || 'document.pdf')
                      }
                    }}
                    placeholder="https://... or uploaded storage link"
                    className="text-xs font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-900">
                    {isHindi ? 'विवरण (वैकल्पिक)' : 'Description (Optional)'}
                  </Label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Notes on registration number, validity date, or signing parties..."
                    rows={2}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-900">
                    {isHindi ? 'टैग (अल्पविराम से अलग करें)' : 'Tags (Comma separated)'}
                  </Label>
                  <Input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="tax, 80g, 2026, registrar"
                    className="text-xs"
                  />
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsUploadOpen(false)}
                    className="text-xs font-bold"
                  >
                    {isHindi ? 'रद्द करें' : 'Cancel'}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUploading}
                    className="bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold"
                  >
                    {isUploading ? (isHindi ? 'सहेजा जा रहा है...' : 'Saving...') : isHindi ? 'वॉल्ट में सहेजें' : 'Save to Vault'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Storage & Vault Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border border-slate-200 bg-white">
          <CardContent className="p-4">
            <div className="text-2xl font-extrabold text-slate-900">{docs.length}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{isHindi ? 'कुल संग्रहीत दस्तावेज़' : 'Total Vault Documents'}</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 bg-white">
          <CardContent className="p-4">
            <div className="text-2xl font-extrabold text-orange-700">{statutoryCount}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{isHindi ? 'वैधानिक व कानूनी फाइलें' : 'Statutory & Tax Records'}</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 bg-white">
          <CardContent className="p-4">
            <div className="text-2xl font-extrabold text-emerald-700">{publicCount}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{isHindi ? 'सार्वजनिक रूप से साझा' : 'Publicly Shared Files'}</div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 bg-white">
          <CardContent className="p-4">
            <div className="text-2xl font-extrabold text-blue-700">{formatBytes(totalStorage)}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{isHindi ? 'सुरक्षित स्टोरेज उपयोग' : 'Encrypted Storage Used'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Bar & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {isHindi ? cat.labelHi : cat.labelEn}
              </button>
            )
          })}
        </div>

        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? 'दस्तावेज़ खोजें...' : 'Search documents...'}
            className="text-xs pl-9 h-9 rounded-xl border-slate-200 bg-white"
          />
        </div>
      </div>

      {/* Document Grid */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-16 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FolderLock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {isHindi ? 'कोई दस्तावेज़ नहीं मिला' : 'No documents in this category'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isHindi
              ? 'इस श्रेणी में अभी तक कोई फाइल अपलोड नहीं की गई है। नया दस्तावेज़ जोड़ने के लिए ऊपर बटन पर क्लिक करें।'
              : 'Upload your Trust Deeds, MoUs, 80G tax orders, AGM circulars, or media releases to keep them safe in one place.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <Card key={doc.id} className="border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between">
              <CardHeader className="pb-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {doc.category.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => isAdmin && handleToggleAccess(doc.id, doc.access_level)}
                    title={isAdmin ? 'Click to cycle access level' : undefined}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-all ${
                      doc.access_level === 'public'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : doc.access_level === 'executives_only'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {doc.access_level === 'public' ? (
                      <Globe className="w-2.5 h-2.5" />
                    ) : (
                      <Lock className="w-2.5 h-2.5" />
                    )}
                    {doc.access_level.replace('_', ' ')}
                  </button>
                </div>
                <CardTitle className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                  {doc.title}
                </CardTitle>
                {doc.description && (
                  <CardDescription className="text-xs text-slate-500 line-clamp-2">
                    {doc.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium border-t border-slate-100 pt-3">
                  <span className="truncate max-w-[140px]" title={doc.file_name}>
                    {doc.file_name}
                  </span>
                  <span>{formatBytes(doc.file_size)}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {isHindi ? 'डाउनलोड / देखें' : 'View / Download'}
                  </a>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(doc.id)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
