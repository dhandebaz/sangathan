'use client'

import React, { useState, useMemo } from 'react'
import {
  FolderLock, BookOpen, Scale, Printer, ShieldCheck, Plus, Search,
  Filter, FileText, UserCog, Settings, CreditCard, Zap, ExternalLink,
  ChevronRight, AlertCircle, CheckCircle2, Clock, Newspaper, Phone,
  FileSignature, Activity, Landmark, Upload, Download, Eye, Layers
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Link from 'next/link'
import { DocumentVault } from '@/components/documents/document-vault'

interface UnifiedAdministrationHubProps {
  lang: string
  orgId: string
  orgName: string
  orgType: string
  isAdmin: boolean
  initialTab?: string
  documents?: any[]
  registers?: any[]
  complianceItems?: any[]
  grievances?: any[]
  letters?: any[]
  auditLogs?: any[]
  stats?: {
    totalDocuments: number
    activeRegisters: number
    complianceScore: number
    openGrievances: number
    totalLetters: number
    auditEvents: number
  }
}

export function UnifiedAdministrationHub({
  lang,
  orgId,
  orgName,
  orgType,
  isAdmin,
  initialTab = 'vault',
  documents = [],
  registers = [],
  complianceItems = [],
  grievances = [],
  letters = [],
  auditLogs = [],
  stats: initialStats = {
    totalDocuments: 0,
    activeRegisters: 0,
    complianceScore: 100,
    openGrievances: 0,
    totalLetters: 0,
    auditEvents: 0,
  }
}: UnifiedAdministrationHubProps) {
  const isHindi = lang === 'hi'

  // Tab State: 'vault' | 'registers_compliance' | 'legal_helpdesk' | 'letters_media' | 'roles_audit'
  const [activeTab, setActiveTab] = useState<
    'vault' | 'registers_compliance' | 'legal_helpdesk' | 'letters_media' | 'roles_audit'
  >(
    ['vault', 'registers_compliance', 'legal_helpdesk', 'letters_media', 'roles_audit'].includes(initialTab)
      ? (initialTab as any)
      : 'vault'
  )

  const [searchQuery, setSearchQuery] = useState('')

  // Tab definitions
  const tabsList = useMemo(() => [
    { id: 'vault', label: isHindi ? 'दस्तावेज़ तिजोरी (Vault)' : 'Document Vault & Deeds', icon: FolderLock },
    { id: 'registers_compliance', label: isHindi ? 'वैधानिक रजिस्टर व अनुपालन' : 'Registers & Compliance', icon: BookOpen },
    { id: 'legal_helpdesk', label: isHindi ? 'विधिक सहायता व निवारण' : 'Legal Aid & Helpdesk', icon: Scale },
    { id: 'letters_media', label: isHindi ? 'सरकारी पत्र व प्रेस विज्ञप्ति' : 'Official Letters & Media', icon: Printer },
    { id: 'roles_audit', label: isHindi ? 'भूमिकाएं, सुरक्षा व ऑडिट' : 'Roles, Security & Audit', icon: ShieldCheck },
  ], [isHindi])

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isHindi ? 'प्रशासन, कानूनी अनुपालन एवं तिजोरी' : 'Administration & Vault Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            {isHindi
              ? 'वैधानिक दस्तावेज़, रजिस्टर, श्रम व संस्थागत अनुपालन, विधिक नोटिस और ऑडिट लॉग एक ही स्थान पर।'
              : 'Institutional documents, statutory registers, legal defense, official letters, and audit logs.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Official Letterhead Generator */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs font-bold border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-2xs"
          >
            <Link href={`/${lang}/dashboard/letterhead`}>
              <Printer className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
              {isHindi ? 'लेटरहेड जनरेटर' : 'Official Letterhead'}
            </Link>
          </Button>

          {/* Org Settings / Roles */}
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs font-bold border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-2xs"
            >
              <Link href={`/${lang}/dashboard/settings`}>
                <Settings className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
                {isHindi ? 'संस्था सेटिंग्स' : 'Org Settings'}
              </Link>
            </Button>
          )}

          {/* Upload Vault Document */}
          <Button
            size="sm"
            asChild
            className="text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
          >
            <Link href={`/${lang}/dashboard/documents/upload`}>
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              {isHindi ? 'दस्तावेज़ अपलोड करें' : 'Upload Document'}
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Unified KPIs Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div
          onClick={() => setActiveTab('vault')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'vault' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Vault Documents</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{documents.length || initialStats.totalDocuments}</div>
        </div>

        <div
          onClick={() => setActiveTab('registers_compliance')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'registers_compliance' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Statutory Registers</div>
          <div className="text-xl font-black text-indigo-600 mt-0.5">{registers.length || 4} Active</div>
        </div>

        <div
          onClick={() => setActiveTab('legal_helpdesk')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'legal_helpdesk' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Legal Grievances</div>
          <div className="text-xl font-black text-rose-600 mt-0.5">{grievances.length || initialStats.openGrievances}</div>
        </div>

        <div
          onClick={() => setActiveTab('letters_media')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'letters_media' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Official Letters</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{letters.length || initialStats.totalLetters}</div>
        </div>

        <div
          onClick={() => setActiveTab('roles_audit')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'roles_audit' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Audit & Guardrails</div>
          <div className="text-xl font-black text-emerald-600 mt-0.5">{auditLogs.length || initialStats.auditEvents} Events</div>
        </div>
      </div>

      {/* 3. Navigation Tabs (Segmented Control) */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100/90 border border-slate-200/80 rounded-xl shadow-2xs">
          {tabsList.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/90 font-extrabold'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-600' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Tab 1: Document Vault & Deeds */}
      {activeTab === 'vault' && (
        <div className="space-y-4">
          <DocumentVault
            documents={documents}
            isAdmin={isAdmin}
            lang={lang}
            orgId={orgId}
            orgType={orgType}
          />
        </div>
      )}

      {/* 5. Tab 2: Statutory Registers & Legal Compliance */}
      {activeTab === 'registers_compliance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Registers Suite */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Statutory Registers Desk</span>
                </span>
                <Badge variant="outline" className="text-[10px] border-slate-200">Legal Standard</Badge>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {isHindi ? 'श्रम व संस्थागत रजिस्टर (Form L, H, I & Membership)' : 'Official Registers (Form L, H, I & Roster)'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {isHindi
                  ? 'सरकारी जांच व श्रम निरीक्षकों के समक्ष प्रस्तुत किए जाने वाले वैधानिक फॉर्म व दैनिक उपस्थिति रजिस्टर।'
                  : 'Statutory registers compliant with Trade Unions Act, Societies Act, and State Cooperative Acts.'}
              </p>
              <div className="pt-2">
                <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs w-full">
                  <Link href={`/${lang}/dashboard/registers`}>
                    <BookOpen className="w-3.5 h-3.5 mr-1" />
                    {isHindi ? 'रजिस्टर खोलें' : 'Open Statutory Registers'}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Compliance Suite */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Statutory Returns & Filing</span>
                </span>
                <Badge variant="outline" className="text-[10px] border-slate-200">Annual Audit</Badge>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {isHindi ? 'वार्षिक अनुपालन, 80G/12A व BQF प्रमाणन' : 'Annual Compliance, 80G/12A & BQF Certification'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {isHindi
                  ? 'आईटी रिटर्न, लिंगदोह समिति सीमाएं, 15-दिवसीय RTI टाइमर्स और वैधानिक समय-सीमा ट्रैकिंग।'
                  : 'Track filing deadlines, regulatory returns, Citizens Charter countdowns, and audit reports.'}
              </p>
              <div className="pt-2">
                <Button asChild size="sm" variant="outline" className="text-xs font-bold border-slate-200 w-full">
                  <Link href={`/${lang}/dashboard/compliance`}>
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    {isHindi ? 'अनुपालन ट्रैकर' : 'View Compliance Tracker'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Legal Aid, Grievances & Helpdesk */}
      {activeTab === 'legal_helpdesk' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Disputes & Grievances */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
                  <Scale className="w-4 h-4" />
                  <span>Disputes & Grievances</span>
                </span>
                <Badge variant="outline" className="text-[10px] border-slate-200">Conciliation</Badge>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {isHindi ? 'विवाद निवारण, ALC व विधिक सहायता' : 'Dispute Redressal & Labor Conciliation'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {isHindi
                  ? 'सहायक श्रम आयुक्त (ALC) विवाद, एंटी-रैगिंग सेल, और सदस्य शिकायतों का समाधान।'
                  : 'Track ALC conciliation notices, workplace grievances, anti-ragging complaints, and tenant verifications.'}
              </p>
              <div className="pt-2">
                <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs w-full">
                  <Link href={orgType === 'workers_union' ? `/${lang}/dashboard/disputes` : `/${lang}/dashboard/grievances`}>
                    <Scale className="w-3.5 h-3.5 mr-1" />
                    {isHindi ? 'विवाद व शिकायतें देखें' : 'View Grievance Desk'}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Support Helpdesk */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-600 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Public & Member Support</span>
                </span>
                <Badge variant="outline" className="text-[10px] border-slate-200">Helpdesk</Badge>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {isHindi ? 'सदस्य सहायता व हेल्पडेस्क टिकट' : 'Member Helpdesk & Support Tickets'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {isHindi
                  ? 'सदस्यों, काडर और लाभार्थियों की समस्याओं को टिकट प्रणाली के माध्यम से सुलझाएं।'
                  : 'Address support queries, service requests, and maintenance tickets with SLAs.'}
              </p>
              <div className="pt-2">
                <Button asChild size="sm" variant="outline" className="text-xs font-bold border-slate-200 w-full">
                  <Link href={`/${lang}/dashboard/helpdesk`}>
                    <AlertCircle className="w-3.5 h-3.5 mr-1 text-sky-600" />
                    {isHindi ? 'हेल्पडेस्क खोलें' : 'Open Support Helpdesk'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Tab 4: Official Letters & Media Dispatch */}
      {activeTab === 'letters_media' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Letterhead & Letters */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                  <Printer className="w-4 h-4" />
                  <span>Official Letterhead Desk</span>
                </span>
                <Badge variant="outline" className="text-[10px] border-slate-200">Printable</Badge>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {isHindi ? 'लेटरहेड, ज्ञापन व प्रशासनिक पत्र' : 'Official Representations & Letterheads'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {isHindi
                  ? 'सरकारी अधिकारियों, निगम वार्डों, और कुलसचिव को औपचारिक पत्र व ज्ञापन जारी करें।'
                  : 'Draft and export official memorandums, municipal representations, and statutory demand letters.'}
              </p>
              <div className="pt-2">
                <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs w-full">
                  <Link href={`/${lang}/dashboard/letterhead`}>
                    <Printer className="w-3.5 h-3.5 mr-1" />
                    {isHindi ? 'लेटरहेड जनरेटर' : 'Open Letterhead Studio'}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Press Releases & Media */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <Newspaper className="w-4 h-4" />
                  <span>Media Dispatch</span>
                </span>
                <Badge variant="outline" className="text-[10px] border-slate-200">Press Ready</Badge>
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {isHindi ? 'प्रेस विज्ञप्ति व मीडिया डिस्पैच स्टूडियो' : 'Press Releases & Media Statements'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {isHindi
                  ? 'द्विभाषी मीडिया वक्तव्य, प्रेस नोट और व्हाट्सएप बुलेटिन तैयार करें और पत्रकारों को भेजें।'
                  : 'Author bilingual press releases, media statements, and WhatsApp journalist copy in seconds.'}
              </p>
              <div className="pt-2">
                <Button asChild size="sm" variant="outline" className="text-xs font-bold border-slate-200 w-full">
                  <Link href={`/${lang}/dashboard/press-releases`}>
                    <Newspaper className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    {isHindi ? 'प्रेस विज्ञप्ति बनाएं' : 'Press Release Studio'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Tab 5: Roles, Security & Guardrails Audit */}
      {activeTab === 'roles_audit' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Roles & Permissions */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <UserCog className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {isHindi ? 'कस्टम भूमिकाएं व अनुमतियां' : 'Custom Roles & RBAC'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {isHindi
                  ? 'काडर सदस्यों व पदाधिकारियों के लिए विशिष्ट एक्सेस अधिकार व अनुमतियां निर्धारित करें।'
                  : 'Configure granular permissions and security roles for council members and organizers.'}
              </p>
              <Button asChild variant="outline" size="sm" className="text-xs font-bold border-slate-200 w-full">
                <Link href={`/${lang}/dashboard/roles`}>
                  {isHindi ? 'भूमिकाएं प्रबंधित करें' : 'Manage Roles'}
                </Link>
              </Button>
            </div>

            {/* Audit & Guardrails */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {isHindi ? 'ऑडिट लॉग व सुरक्षा गार्डरेल्स' : 'Audit Logs & Guardrails'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {isHindi
                  ? 'संगठन के हर प्रशासनिक कदम, डेटा बदलाव और एक्सेस का अपरिवर्तनीय ऑडिट रिकॉर्ड।'
                  : 'Cryptographic, tamper-evident record of all administrative actions and security events.'}
              </p>
              <Button asChild variant="outline" size="sm" className="text-xs font-bold border-slate-200 w-full">
                <Link href={`/${lang}/dashboard/audit`}>
                  {isHindi ? 'ऑडिट लॉग देखें' : 'View Audit Log'}
                </Link>
              </Button>
            </div>

            {/* Transparency Ledger */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                {isHindi ? 'सार्वजनिक पारदर्शिता लेज़र' : 'Transparency Ledger'}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {isHindi
                  ? 'जनता व सदस्यों के विश्वास के लिए प्रकाशित प्रस्तावों व वित्तीय रिपोर्ट का लेज़र।'
                  : 'Public-facing transparency register for community trust, donor assurance, and democratic scrutiny.'}
              </p>
              <Button asChild variant="outline" size="sm" className="text-xs font-bold border-slate-200 w-full">
                <Link href={`/${lang}/dashboard/transparency`}>
                  {isHindi ? 'पारदर्शिता लेज़र' : 'Transparency Ledger'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
