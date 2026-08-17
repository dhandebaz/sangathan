'use client'

import React, { useState, useMemo } from 'react'
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  BarChart3,
  Globe,
  QrCode,
  Share2,
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  Download,
  Printer,
  Database,
  Smartphone,
  CheckCircle2,
  Users,
  Copy,
  Layers,
  RefreshCw,
  Eye,
  MessageCircle,
  Clock,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { FormStatusToggle } from '@/components/forms/form-status-toggle'
import { WhatsappShareModal } from '@/components/forms/whatsapp-share-modal'
import { GoogleFormImporter } from '@/components/forms/google-form-importer'
import { deleteForm } from '@/actions/forms/actions'
import { toast } from 'sonner'
import Link from 'next/link'

interface FormItem {
  id: string
  title: string
  description?: string | null
  slug?: string | null
  is_active: boolean
  created_at: string
  visibility?: string | null
  fields?: any[]
  form_submissions?: { count: number }[] | [{ count: number }]
}

interface UnifiedFormsHubProps {
  lang: string
  orgId: string
  orgName: string
  orgType: string
  initialForms: FormItem[]
  recentSubmissions?: any[]
  totalSubmissionsCount: number
}

export function UnifiedFormsHub({
  lang,
  orgId,
  orgName,
  orgType,
  initialForms,
  recentSubmissions = [],
  totalSubmissionsCount: initialTotalSubmissions
}: UnifiedFormsHubProps) {
  const isHindi = lang === 'hi'

  // Tabs: 'studio' | 'submissions' | 'google_import' | 'offline_field' | 'paper_print'
  const [activeTab, setActiveTab] = useState<'studio' | 'submissions' | 'google_import' | 'offline_field' | 'paper_print'>('studio')

  const [forms, setForms] = useState<FormItem[]>(initialForms)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  // Modals
  const [qrModalForm, setQrModalForm] = useState<FormItem | null>(null)
  const [shareModalForm, setShareModalForm] = useState<FormItem | null>(null)
  const [paperFormSelected, setPaperFormSelected] = useState<FormItem | null>(initialForms[0] || null)

  // Filtered Forms
  const filteredForms = useMemo(() => {
    return forms.filter((f) => {
      if (statusFilter === 'active' && !f.is_active) return false
      if (statusFilter === 'inactive' && f.is_active) return false
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const matchTitle = f.title.toLowerCase().includes(term)
        const matchDesc = f.description?.toLowerCase().includes(term)
        const matchSlug = f.slug?.toLowerCase().includes(term)
        if (!matchTitle && !matchDesc && !matchSlug) return false
      }
      return true
    })
  }, [forms, searchTerm, statusFilter])

  // Count active forms
  const activeCount = useMemo(() => forms.filter((f) => f.is_active).length, [forms])

  // Delete Form Handler
  async function handleDeleteForm(formId: string, title: string) {
    if (!confirm(isHindi ? `क्या आप "${title}" फॉर्म को हटाना चाहते हैं?` : `Are you sure you want to delete form "${title}"?`)) {
      return
    }

    const res = await deleteForm({ formId })
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success(isHindi ? 'फॉर्म हटा दिया गया' : 'Form deleted successfully')
      setForms((prev) => prev.filter((f) => f.id !== formId))
    }
  }

  // Generate Form Public URL
  function getPublicFormUrl(form: FormItem) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sangathan.space'
    const identifier = form.slug || form.id
    return `${origin}/${lang}/f/${identifier}`
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {isHindi ? 'फॉर्म एवं सर्वेक्षण हब' : 'Forms & Survey Studio'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isHindi
              ? 'सर्वेक्षण बनाएं, Google Forms आयात करें, व्हाट्सएप पर साझा करें, और ऑफलाइन फील्ड डेटा एकत्र करें।'
              : 'Deploy surveys, import Google Forms, forward to WhatsApp groups, and capture offline field data.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Google Forms API Importer Tab Trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab('google_import')}
            className="text-xs font-semibold border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs"
          >
            <Database className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
            {isHindi ? 'Google Form आयात' : 'Import Google Form'}
          </Button>

          {/* Offline Field Mode Quick Link */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs font-semibold border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs"
          >
            <Link href={`/${lang}/dashboard/field-mode`}>
              <Smartphone className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              {isHindi ? 'ऑफलाइन फील्ड PWA' : 'Offline Field Mode'}
            </Link>
          </Button>

          {/* New Form Studio Trigger */}
          <Button
            size="sm"
            asChild
            className="text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
          >
            <Link href={`/${lang}/dashboard/forms/new`}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              {isHindi ? 'नया फॉर्म बनाएं' : 'Create New Form'}
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Unified KPIs Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => { setActiveTab('studio'); setStatusFilter('all'); }}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'studio' && statusFilter === 'all' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Forms</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{forms.length}</div>
        </div>

        <div
          onClick={() => { setActiveTab('studio'); setStatusFilter('active'); }}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'studio' && statusFilter === 'active' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Live & Active</div>
          <div className="text-xl font-black text-emerald-600 mt-0.5">{activeCount}</div>
        </div>

        <div
          onClick={() => setActiveTab('submissions')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'submissions' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Responses</div>
          <div className="text-xl font-black text-indigo-600 mt-0.5">{initialTotalSubmissions}</div>
        </div>

        <div
          onClick={() => setActiveTab('offline_field')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'offline_field' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Field PWA Ready</div>
          <div className="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            100% Offline
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100/90 border border-slate-200/80 rounded-xl shadow-2xs">
          {[
            { id: 'studio', label: isHindi ? 'फॉर्म एवं सर्वेक्षण सूची' : 'Forms & Survey Studio', icon: FileText },
            { id: 'submissions', label: isHindi ? 'उत्तर एवं लाइव एनालिटिक्स' : 'Submissions & Analytics', icon: BarChart3 },
            { id: 'google_import', label: isHindi ? 'Google Forms API माइग्रेटर' : 'Google Forms Importer', icon: Database },
            { id: 'offline_field', label: isHindi ? 'ऑफलाइन फील्ड मोड PWA' : 'Offline Field Mode', icon: Smartphone },
            { id: 'paper_print', label: isHindi ? 'प्रिंटेबल A4 पर्चा / सर्वे शीट' : 'Printable Paper Sheets', icon: Printer },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/90 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Tab 1: Forms & Survey Studio */}
      {activeTab === 'studio' && (
        <div className="space-y-4">
          {/* Search & Filter Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isHindi ? 'फॉर्म नाम या लिंक से खोजें...' : 'Search forms by title or slug...'}
                className="pl-9 text-xs bg-background h-9"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-xs font-semibold bg-background border border-border rounded-lg px-2.5 py-2 text-foreground focus:outline-none"
              >
                <option value="all">{isHindi ? 'सभी फॉर्म्स (All Forms)' : 'All Forms'}</option>
                <option value="active">{isHindi ? 'सक्रिय (Active Only)' : 'Active Only'}</option>
                <option value="inactive">{isHindi ? 'निष्क्रिय (Inactive Only)' : 'Inactive Only'}</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-xs font-semibold"
              >
                <Link href={`/${lang}/dashboard/forms/new`}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {isHindi ? 'नया फॉर्म' : 'New Form'}
                </Link>
              </Button>
            </div>
          </div>

          {/* Form Cards Grid */}
          {filteredForms.length === 0 ? (
            <div className="text-center py-16 px-4 bg-card rounded-2xl border border-dashed border-border">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">
                {isHindi ? 'कोई फॉर्म नहीं मिला' : 'No forms found'}
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto mb-6">
                {isHindi
                  ? 'जनता से फीडबैक, स्वयंसेवक कौशल, या मोहल्ला शिकायतें दर्ज करने के लिए अपना पहला फॉर्म बनाएं।'
                  : 'Create custom forms, surveys, or Google Forms imports to gather community data and feedback.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 font-bold text-xs">
                  <Link href={`/${lang}/dashboard/forms/new`}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    {isHindi ? 'पहला फॉर्म बनाएं' : 'Create First Form'}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('google_import')}
                  className="font-bold text-xs"
                >
                  <Database className="w-4 h-4 mr-1.5 text-indigo-600" />
                  {isHindi ? 'Google Form से आयात करें' : 'Import from Google Forms'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredForms.map((form) => {
                const subCount = form.form_submissions?.[0]?.count ?? 0
                const publicUrl = getPublicFormUrl(form)

                return (
                  <div
                    key={form.id}
                    className="bg-card border border-border rounded-xl p-5 shadow-2xs hover:border-orange-200 dark:hover:border-orange-900 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top status bar */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {form.slug ? `/f/${form.slug}` : 'Standard Form'}
                        </span>
                        <FormStatusToggle formId={form.id} isActive={form.is_active} />
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-base font-bold text-foreground mb-1.5 line-clamp-1">
                        {form.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                        {form.description || (isHindi ? 'कोई विवरण नहीं' : 'No description provided')}
                      </p>

                      {/* Response Metrics */}
                      <div className="flex items-center gap-4 py-2 border-y border-border/60 text-xs font-semibold text-muted-foreground mb-4">
                        <div className="flex items-center gap-1.5 text-foreground font-bold">
                          <Users className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{subCount} {isHindi ? 'उत्तर' : 'Responses'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span>{new Date(form.created_at).toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="space-y-2 pt-1">
                      {/* Primary Actions: Analytics & Edit */}
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="w-full text-xs font-bold border-indigo-200 bg-indigo-50/50 text-indigo-800 hover:bg-indigo-100/60 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
                        >
                          <Link href={`/${lang}/dashboard/forms/${form.id}/submissions`}>
                            <BarChart3 className="w-3.5 h-3.5 mr-1" />
                            {isHindi ? 'एनालिटिक्स' : 'Responses'}
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="w-full text-xs font-bold"
                        >
                          <Link href={`/${lang}/dashboard/forms/${form.id}/edit`}>
                            <Edit3 className="w-3.5 h-3.5 mr-1" />
                            {isHindi ? 'संपादित करें' : 'Edit Form'}
                          </Link>
                        </Button>
                      </div>

                      {/* Secondary Utility Actions */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="flex items-center gap-1">
                          {/* WhatsApp Share Modal */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShareModalForm(form)}
                            className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                            title="WhatsApp Share"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </Button>

                          {/* QR Code Modal */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setQrModalForm(form)}
                            className="h-8 px-2 text-slate-700 dark:text-slate-300 hover:bg-muted"
                            title="QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </Button>

                          {/* Copy Link */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              navigator.clipboard.writeText(publicUrl)
                              toast.success(isHindi ? 'लिंक कॉपी हुआ!' : 'Link copied to clipboard!')
                            }}
                            className="h-8 px-2 text-slate-700 dark:text-slate-300 hover:bg-muted"
                            title="Copy Public Link"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </Button>

                          {/* Open Public Live Form */}
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                            className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                            title="Open Form Live"
                          >
                            <a href={publicUrl} target="_blank" rel="noreferrer">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </Button>
                        </div>

                        {/* Delete Button */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteForm(form.id, form.title)}
                          className="h-8 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete Form"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Tab 2: Submissions & Field Analytics */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                {isHindi ? 'केंद्रीय उत्तर एवं जनमत एनालिटिक्स' : 'Centralized Submissions & Consensus Analytics'}
              </h3>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-0.5">
                {isHindi
                  ? 'सभी सर्वेक्षणों के लाइव परिणाम देखें, CSV में निर्यात करें, और व्यक्तिगत डोज़ियर डाउनलोड करें।'
                  : 'View live responses, export data to CSV/Excel, and generate consensus analytics across all active forms.'}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => {
              const subCount = form.form_submissions?.[0]?.count ?? 0
              return (
                <div key={form.id} className="p-4 bg-card border border-border rounded-xl shadow-2xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-foreground mb-1">{form.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{form.description || 'No description'}</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-4">
                      <Users className="w-4 h-4" />
                      <span>{subCount} Total Submissions</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    asChild
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    <Link href={`/${lang}/dashboard/forms/${form.id}/submissions`}>
                      <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                      Open Full Analytics & CSV Export
                    </Link>
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 6. Tab 3: Google Forms API Migrator */}
      {activeTab === 'google_import' && (
        <div className="space-y-4">
          <GoogleFormImporter lang={lang} />
        </div>
      )}

      {/* 7. Tab 4: Offline Field Mode & Door-to-Door Kiosk */}
      {activeTab === 'offline_field' && (
        <div className="p-6 bg-card border border-border rounded-2xl shadow-2xs space-y-6 max-w-4xl">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {isHindi ? 'ऑफ़लाइन फील्ड मोड व डोर-टू-डोर कियोस्क' : 'Offline-First Field Organizer PWA'}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {isHindi
                  ? 'बिना इंटरनेट वाले दूरदराज के क्षेत्रों या बस्तियों में कार्यकर्ताओं के लिए शून्य-कनेक्टिविटी डेटा संग्रह। डिवाइस में स्थानीय रूप से सहेजा जाता है और इंटरनेट मिलते ही स्वतः सिंक होता है।'
                  : 'Equip ground volunteers with a zero-connectivity Progressive Web App. Log membership registrations, survey forms, and grievances offline with automatic IndexedDB queue synchronization.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border">
            <div className="p-3 bg-muted/40 rounded-lg">
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Zero Connectivity
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">Works in basement halls and rural territories with no signal.</div>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg">
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                IndexedDB Storage
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">Encrypted local storage on phone browser cache.</div>
            </div>
            <div className="p-3 bg-muted/40 rounded-lg">
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Auto Background Sync
              </div>
              <div className="text-[11px] text-muted-foreground mt-1">Automatically pushes queued entries when reconnected.</div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              <Link href={`/${lang}/dashboard/field-mode`}>
                <Smartphone className="w-3.5 h-3.5 mr-1.5" />
                {isHindi ? 'फील्ड मोड लॉन्च करें' : 'Launch Offline Field PWA'}
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* 8. Tab 5: Printable Paper Survey Sheets & Parchas */}
      {activeTab === 'paper_print' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200 flex items-center gap-2">
                <Printer className="w-4 h-4 text-amber-600" />
                {isHindi ? '1-पेज A4 प्रिंटेबल पर्चा व हस्ताक्षर शीट' : 'Printable 1-Page A4 Survey Sheets & Tea-Stall Parchas'}
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                {isHindi
                  ? 'चाय की दुकानों, बस्तियों और फैक्ट्री गेट पर पेन-कागज हस्ताक्षर अभियानों के लिए उच्च-कंट्रास्ट शीट निकालें।'
                  : 'Generate high-contrast black-and-white physical forms optimized for ₹1 photostat machines and ground paper drives.'}
              </p>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-2xs space-y-6 max-w-4xl">
            <div className="space-y-2">
              <Label className="text-xs font-bold">Select Form to Print</Label>
              <select
                value={paperFormSelected?.id || ''}
                onChange={(e) => {
                  const found = forms.find((f) => f.id === e.target.value)
                  if (found) setPaperFormSelected(found)
                }}
                className="w-full text-xs bg-background border border-border rounded-lg p-2.5 font-semibold"
              >
                {forms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.title} {f.slug ? `(/f/${f.slug})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {paperFormSelected && (
              <div className="border border-slate-300 dark:border-slate-700 p-6 rounded-xl bg-white text-slate-900 space-y-4">
                <div className="border-b border-slate-900 pb-3 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600">
                      {orgName} • Ground Survey & Representation
                    </span>
                    <h2 className="text-lg font-black tracking-tight">{paperFormSelected.title}</h2>
                    <p className="text-xs text-slate-600 mt-0.5">{paperFormSelected.description || 'Public Citizen Representation & Intake Form'}</p>
                  </div>
                  <div className="text-right text-[10px] font-mono text-slate-500">
                    <div>Date: ____________</div>
                    <div>Ward/Unit: ________</div>
                  </div>
                </div>

                {/* Printable Fields Preview */}
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border-b border-slate-400 pb-1 text-xs text-slate-700">
                      <span className="font-bold">1. Full Name (पूरा नाम):</span> _________________________
                    </div>
                    <div className="border-b border-slate-400 pb-1 text-xs text-slate-700">
                      <span className="font-bold">2. Phone / WhatsApp (फोन नंबर):</span> ________________
                    </div>
                  </div>
                  <div className="border-b border-slate-400 pb-1 text-xs text-slate-700">
                    <span className="font-bold">3. House / Colony / Workplace Address (पता):</span> __________________________________________________
                  </div>
                  <div className="border-b border-slate-400 pb-1 text-xs text-slate-700">
                    <span className="font-bold">4. Key Concern / Demand (मुख्य मांग या समस्या):</span> _______________________________________________
                  </div>
                  <div className="border-b border-slate-400 pb-1 text-xs text-slate-700">
                    <span className="font-bold">5. Signature / अंगूठे का निशान:</span> _________________________
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200">
                  <span>Managed via Sangathan Civic Infrastructure (https://sangathan.space)</span>
                  <span>Form ID: {paperFormSelected.id.slice(0, 8)}</span>
                </div>
              </div>
            )}

            <Button
              onClick={() => window.print()}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              {isHindi ? 'A4 शीट प्रिंट करें (Print Sheet)' : 'Print A4 Survey Sheet'}
            </Button>
          </div>
        </div>
      )}

      {/* MODAL: QR Code Display */}
      {qrModalForm && (
        <Dialog open={!!qrModalForm} onOpenChange={() => setQrModalForm(null)}>
          <DialogContent className="sm:max-w-md bg-card text-foreground border border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <QrCode className="w-5 h-5 text-orange-600" />
                {isHindi ? 'फॉर्म क्यूआर कोड' : 'Public Form QR Code'}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {qrModalForm.title}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center p-6 space-y-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                {/* Responsive QR preview image using standard dynamic generator */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getPublicFormUrl(qrModalForm))}`}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
              <Input
                readOnly
                value={getPublicFormUrl(qrModalForm)}
                className="text-xs font-mono text-center"
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(getPublicFormUrl(qrModalForm))
                  toast.success('Link copied!')
                }}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy Public Form Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* MODAL: WhatsApp Viral Share Modal */}
      {shareModalForm && (
        <WhatsappShareModal
          isOpen={!!shareModalForm}
          onClose={() => setShareModalForm(null)}
          formId={shareModalForm.id}
          formTitle={shareModalForm.title}
          formDescription={shareModalForm.description || undefined}
          currentSlug={shareModalForm.slug || undefined}
          orgName={orgName}
          lang={lang}
          onSlugUpdated={(newSlug) => {
            setForms((prev) =>
              prev.map((f) => (f.id === shareModalForm.id ? { ...f, slug: newSlug } : f))
            )
          }}
        />
      )}
    </div>
  )
}
