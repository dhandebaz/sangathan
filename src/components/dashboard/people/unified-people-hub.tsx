'use client'

import React, { useState, useMemo } from 'react'
import {
  Users, Award, Network, HeartHandshake, ShieldCheck,
  Plus, Search, Filter, Printer, FileSpreadsheet, Contact,
  ArrowRight, ExternalLink, CheckCircle2, UserCheck, Globe,
  Copy, RefreshCw, Mail, Phone, MapPin, Sparkles, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'
import Link from 'next/link'
import { AddMemberDialog } from '@/components/members/add-member-dialog'
import { MemberTable } from '@/components/members/member-table'
import { MemberBadgeStudio } from '@/components/members/member-badge-studio'
import { VolunteersClient } from '@/components/dashboard/volunteers-client'
import { CertificatesManager } from '@/components/volunteers/certificates-manager'
import { Member } from '@/types/dashboard'

interface UnifiedPeopleHubProps {
  lang: string
  orgId: string
  orgType: string
  orgName: string
  orgSlug: string
  logoUrl: string | null
  isAdmin: boolean
  initialMembers: Member[]
  totalMembersCount: number
  subgroups: Array<{ id: string; name: string; type: string; description: string | null; memberCount?: number }>
  volunteers: any[]
  certificates: any[]
  networks: any[]
  currentUserProfile: {
    id: string
    full_name: string
    role: string
    designation?: string
    avatar_url?: string | null
  }
}

export function UnifiedPeopleHub({
  lang,
  orgId,
  orgType,
  orgName,
  orgSlug,
  logoUrl,
  isAdmin,
  initialMembers,
  totalMembersCount,
  subgroups,
  volunteers,
  certificates,
  networks,
  currentUserProfile
}: UnifiedPeopleHubProps) {
  const isHindi = lang === 'hi'

  // Tabs: 'members' | 'badges' | 'teams' | 'volunteers' | 'certificates' | 'networks'
  const [activeTab, setActiveTab] = useState<'members' | 'badges' | 'teams' | 'volunteers' | 'certificates' | 'networks'>('members')

  // Search & Filter state for members
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return initialMembers.filter((m) => {
      if (statusFilter !== 'all' && m.status !== statusFilter) return false
      if (roleFilter !== 'all' && m.role !== roleFilter) return false
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const matchName = m.full_name?.toLowerCase().includes(term)
        const matchPhone = m.phone?.toLowerCase().includes(term)
        const matchDesignation = m.designation?.toLowerCase().includes(term)
        const matchArea = m.area?.toLowerCase().includes(term)
        if (!matchName && !matchPhone && !matchDesignation && !matchArea) return false
      }
      return true
    })
  }, [initialMembers, searchTerm, roleFilter, statusFilter])

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {isHindi ? 'सदस्य एवं कार्यसमिति' : 'People & Members Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isHindi
              ? 'सदस्य सूची, आईडी कार्ड, समितियां, स्वयंसेवक, डिजिटल प्रमाण पत्र और नेटवर्क एक ही स्थान पर।'
              : 'Member rosters, digital ID badges, working committees, volunteers, service certificates, and networks.'}
          </p>
        </div>

        {/* Quick Launchpad Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Import Link */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs font-semibold border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs"
          >
            <Link href={`/${lang}/dashboard/members/import`}>
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              {isHindi ? 'आयात (Excel / Google)' : 'Import Roster'}
            </Link>
          </Button>

          {/* Member Badge Studio Quick Link */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs font-semibold border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs"
          >
            <Link href={`/${lang}/members/badge`}>
              <Award className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
              {isHindi ? 'बैज व आईडी स्टूडियो' : 'Verified Badge Studio'}
            </Link>
          </Button>

          {/* Add Member Dialog Trigger */}
          {isAdmin && (
            <AddMemberDialog
              triggerLabel={isHindi ? 'नया सदस्य जोड़ें' : 'Add Member'}
              triggerIcon={<Plus className="w-3.5 h-3.5 mr-1.5" />}
            />
          )}
        </div>
      </div>

      {/* 2. Unified KPIs Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          onClick={() => setActiveTab('members')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'members' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Members Roster</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{totalMembersCount}</div>
        </div>

        <div
          onClick={() => setActiveTab('badges')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'badges' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ID Cards & Badges</div>
          <div className="text-xl font-black text-indigo-600 mt-0.5">{totalMembersCount} Verified</div>
        </div>

        <div
          onClick={() => setActiveTab('teams')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'teams' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Committees</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{subgroups.length}</div>
        </div>

        <div
          onClick={() => setActiveTab('volunteers')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'volunteers' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Volunteers</div>
          <div className="text-xl font-black text-emerald-600 mt-0.5">{volunteers.length}</div>
        </div>

        <div
          onClick={() => setActiveTab('certificates')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'certificates' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Certificates Issued</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{certificates.length}</div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="overflow-x-auto pb-1 scrollbar-none">
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100/90 border border-slate-200/80 rounded-xl shadow-2xs">
          {[
            { id: 'members', label: isHindi ? 'सदस्य निर्देशिका' : 'Member Directory', icon: Users },
            { id: 'badges', label: isHindi ? 'डिजिटल आईडी व सत्यापित बैज' : 'ID Cards & Badges Studio', icon: Award },
            { id: 'teams', label: isHindi ? 'टीमें व कार्यसमितियां' : 'Teams & Committees', icon: Network },
            { id: 'volunteers', label: isHindi ? 'स्वयंसेवक डेस्क' : 'Volunteers Desk', icon: HeartHandshake },
            { id: 'certificates', label: isHindi ? 'प्रमाण पत्र स्टूडियो' : 'Volunteer Certificates', icon: ShieldCheck },
            { id: 'networks', label: isHindi ? 'महासंघ व संयुक्त मोर्चा' : 'Federation & Networks', icon: Globe },
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

      {/* 4. Tab 1: Member Directory */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          {/* Search and Filters Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isHindi ? 'नाम, फोन, पद या क्षेत्र से खोजें...' : 'Search by name, phone, designation, area...'}
                className="pl-9 text-xs bg-background h-9"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs font-semibold bg-background border border-border rounded-lg px-2.5 py-2 text-foreground focus:outline-none"
              >
                <option value="all">{isHindi ? 'सभी भूमिकाएं (All Roles)' : 'All Roles'}</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-semibold bg-background border border-border rounded-lg px-2.5 py-2 text-foreground focus:outline-none"
              >
                <option value="all">{isHindi ? 'सभी स्थिति (All Status)' : 'All Status'}</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                asChild
                className="text-xs font-semibold"
              >
                <Link href={`/${lang}/dashboard/members/print`}>
                  <Printer className="w-3.5 h-3.5 mr-1" />
                  {isHindi ? 'प्रिंट' : 'Print Roster'}
                </Link>
              </Button>
            </div>
          </div>

          {/* Member Table */}
          <MemberTable members={filteredMembers} />
        </div>
      )}

      {/* 5. Tab 2: ID Cards & Member Badge Studio */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                Verified Digital Identity & Credential Studio
              </h3>
              <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-0.5">
                Generate official high-resolution member cards, printable badges, and social avatar credentials with cryptographic QR verification.
              </p>
            </div>
            <Button
              size="sm"
              asChild
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0"
            >
              <Link href={`/${lang}/members/badge`}>
                Open Fullscreen Studio
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>

          <MemberBadgeStudio
            initialMemberName={currentUserProfile.full_name || 'Organization Member'}
            initialRole={currentUserProfile.role || 'Member'}
            initialOrgName={orgName}
            initialOrgSlug={orgSlug}
            initialOrgType={orgType}
            initialMemberId={`SAN-${new Date().getFullYear()}-${currentUserProfile.id.slice(0, 6).toUpperCase()}`}
            initialAvatarUrl={currentUserProfile.avatar_url || undefined}
            initialLang={isHindi ? 'hi' : 'en'}
          />
        </div>
      )}

      {/* 6. Tab 3: Teams & Working Committees */}
      {activeTab === 'teams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Network className="w-4 h-4 text-brand-600" />
                Teams, Departments & Committees ({subgroups.length})
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Decentralize operations across specialized working groups, units, and chapters.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subgroups.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-card border border-border rounded-xl">
                <Network className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-xs font-bold text-foreground">No Committees Created Yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create committees to organize members into operational teams.
                </p>
              </div>
            ) : (
              subgroups.map((sg) => (
                <div key={sg.id} className="p-4 bg-card border border-border rounded-xl shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-foreground">{sg.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-muted rounded uppercase">
                      {sg.type || 'Committee'}
                    </span>
                  </div>
                  {sg.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{sg.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                    <span className="text-muted-foreground font-medium">
                      {sg.memberCount || 0} Members
                    </span>
                    <Button size="sm" variant="ghost" asChild className="text-xs font-bold text-orange-600 p-0 h-auto hover:bg-transparent">
                      <Link href={`/${lang}/dashboard/subgroups`}>
                        Manage Team →
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 7. Tab 4: Volunteers Desk */}
      {activeTab === 'volunteers' && (
        <div className="space-y-4">
          <VolunteersClient initialVolunteers={volunteers} />
        </div>
      )}

      {/* 8. Tab 5: Volunteer Recognition Certificates */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <CertificatesManager
            orgId={orgId}
            initialCertificates={certificates}
            isHindi={isHindi}
          />
        </div>
      )}

      {/* 9. Tab 6: Federation & Networks */}
      {activeTab === 'networks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                Federated Alliances & Coalitions
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Connect and coordinate joint actions with allied organizations.
              </p>
            </div>
            <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
              <Link href={`/${lang}/dashboard/networks/new`}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Create Network Alliance
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {networks.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-card border border-border rounded-xl">
                <Globe className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-xs font-bold text-foreground">No Network Alliances Joined</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Create or join a joint coalition network to publish shared representations.
                </p>
              </div>
            ) : (
              networks.map((net) => (
                <div key={net.id} className="p-4 bg-card border border-border rounded-xl shadow-2xs space-y-2">
                  <h4 className="text-sm font-bold text-foreground">{net.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{net.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
