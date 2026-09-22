'use client'

import React, { useState, useMemo } from 'react'
import {
  ScrollText, Vote, Landmark, HandCoins, DollarSign, Flag, CheckSquare,
  Plus, Search, Filter, ShieldCheck, Sparkles, ArrowUpRight, ArrowDownLeft,
  ChevronRight, ExternalLink, Calendar, CheckCircle2, Clock, AlertCircle,
  FileText, Users, Network, BarChart3, Lock, MessageSquare, Download, Layers
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Link from 'next/link'
import { ProposalManager } from '@/components/dashboard/proposal-manager'

interface UnifiedGovernanceHubProps {
  lang: string
  orgId: string
  orgName: string
  orgType: string
  isAdmin: boolean
  initialTab?: string
  proposals?: any[]
  polls?: any[]
  transactions?: any[]
  chandaRecords?: any[]
  grants?: any[]
  campaigns?: any[]
  tasks?: any[]
  stats?: {
    totalProposals: number
    activePolls: number
    totalIncome: number
    totalExpenses: number
    netBalance: number
    totalChanda: number
    activeCampaigns: number
    pendingTasks: number
  }
}

export function UnifiedGovernanceHub({
  lang,
  orgId,
  orgName,
  orgType,
  isAdmin,
  initialTab = 'proposals',
  proposals = [],
  polls = [],
  transactions = [],
  chandaRecords = [],
  grants = [],
  campaigns = [],
  tasks = [],
  stats: initialStats = {
    totalProposals: 0,
    activePolls: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    totalChanda: 0,
    activeCampaigns: 0,
    pendingTasks: 0,
  }
}: UnifiedGovernanceHubProps) {
  const isHindi = lang === 'hi'

  // Tab State: 'proposals' | 'voting' | 'ledger' | 'chanda' | 'grants' | 'campaigns' | 'tasks'
  const [activeTab, setActiveTab] = useState<
    'proposals' | 'voting' | 'ledger' | 'chanda' | 'grants' | 'campaigns' | 'tasks'
  >(
    ['proposals', 'voting', 'ledger', 'chanda', 'grants', 'campaigns', 'tasks'].includes(initialTab)
      ? (initialTab as any)
      : 'proposals'
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Income / Expense Computations
  const income = useMemo(() => {
    return transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
  }, [transactions])

  const expenses = useMemo(() => {
    return transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
  }, [transactions])

  const balance = income - expenses

  // Tab definitions
  const tabsList = useMemo(() => [
    { id: 'proposals', label: isHindi ? 'प्रस्ताव व निर्णय' : 'Proposals & Resolutions', icon: ScrollText },
    { id: 'voting', label: isHindi ? 'मतदान व रायशुमारी' : 'Voting & Ballots', icon: Vote },
    { id: 'ledger', label: isHindi ? 'वित्तीय कोष व बहीखाता' : 'Financial Ledger', icon: Landmark },
    { id: 'chanda', label: isHindi ? 'चंदा व दान रसीदें (80G)' : 'Chanda & Donations', icon: HandCoins },
    { id: 'grants', label: isHindi ? 'अनुदान व CSR मैचिंग' : 'Grants & CSR', icon: DollarSign },
    { id: 'campaigns', label: isHindi ? 'अभियान व जन-याचिकाएं' : 'Campaigns & Petitions', icon: Flag },
    { id: 'tasks', label: isHindi ? 'कार्य व फील्ड दायित्व' : 'Program Tasks', icon: CheckSquare },
  ], [isHindi])

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isHindi ? 'शासन प्रणाली, लोकतांत्रिक निर्णय एवं कोष' : 'Governance & Treasury Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            {isHindi
              ? 'प्रस्ताव, मतदान, आय-व्यय बहीखाता, चंदा रसीदें, CSR अनुदान, और जन-आंदोलन अभियान एक ही स्थान पर।'
              : 'Democratic resolutions, voting ballots, financial ledger, chanda & donations, grants, and campaigns.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Record Transaction */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs font-bold border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-2xs"
          >
            <Link href={`/${lang}/dashboard/financials/new`}>
              <Landmark className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              {isHindi ? 'आय / व्यय प्रविष्टि' : 'Record Transaction'}
            </Link>
          </Button>

          {/* Quick Issue Chanda Receipt */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs font-bold border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-2xs"
          >
            <Link href={`/${lang}/dashboard/donations`}>
              <HandCoins className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              {isHindi ? 'चंदा रसीद' : 'Issue Receipt'}
            </Link>
          </Button>

          {/* New Proposal / Motion */}
          <Button
            size="sm"
            asChild
            className="text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
          >
            <Link href={`/${lang}/dashboard/governance/proposals`}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              {isHindi ? 'नया प्रस्ताव बनाएं' : 'New Proposal'}
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. Unified KPIs Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div
          onClick={() => setActiveTab('proposals')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'proposals' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Proposals</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{proposals.length || initialStats.totalProposals}</div>
        </div>

        <div
          onClick={() => setActiveTab('voting')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'voting' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Live Ballots</div>
          <div className="text-xl font-black text-indigo-600 mt-0.5">{polls.length || initialStats.activePolls}</div>
        </div>

        <div
          onClick={() => setActiveTab('ledger')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'ledger' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Net Balance</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">₹{balance.toLocaleString()}</div>
        </div>

        <div
          onClick={() => setActiveTab('chanda')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'chanda' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Chanda / Dues</div>
          <div className="text-xl font-black text-emerald-600 mt-0.5">₹{income.toLocaleString()}</div>
        </div>

        <div
          onClick={() => setActiveTab('grants')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'grants' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Grants Matched</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{grants.length || 0}</div>
        </div>

        <div
          onClick={() => setActiveTab('campaigns')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'campaigns' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Petitions</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{campaigns.length || initialStats.activeCampaigns}</div>
        </div>

        <div
          onClick={() => setActiveTab('tasks')}
          className={`p-3.5 bg-white border rounded-xl shadow-2xs cursor-pointer transition-all ${
            activeTab === 'tasks' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">Action Tasks</div>
          <div className="text-xl font-black text-slate-900 mt-0.5">{tasks.length || initialStats.pendingTasks}</div>
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

      {/* 4. Tab 1: Proposals & Democratic Resolutions */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          <ProposalManager proposals={proposals} />
        </div>
      )}

      {/* 5. Tab 2: Voting & Ballots */}
      {activeTab === 'voting' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHindi ? 'मतदान या प्रस्ताव खोजें...' : 'Search ballots or polls...'}
                className="pl-9 text-xs bg-white text-slate-900 h-9 font-medium"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs">
                <Link href={`/${lang}/dashboard/polls/new`}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {isHindi ? 'नया गुप्त मतदान बनाएं' : 'Create New Ballot'}
                </Link>
              </Button>
            </div>
          </div>

          {polls.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <Vote className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {isHindi ? 'कोई सक्रिय मतदान नहीं' : 'No active ballots or elections'}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto mb-6">
                {isHindi
                  ? 'प्रस्तावों या प्रतिनिधि चुनाव के लिए क्रिप्टोग्राफ़िक गुप्त मतदान शुरू करें।'
                  : 'Launch encrypted secret ballots, AGM resolutions, or representative elections.'}
              </p>
              <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs">
                <Link href={`/${lang}/dashboard/polls/new`}>
                  <Plus className="w-4 h-4 mr-1.5" />
                  {isHindi ? 'पहला मतदान सत्र बनाएं' : 'Create First Ballot'}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {polls.map((poll) => (
                <div key={poll.id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {poll.status || 'Active'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{new Date(poll.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{poll.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{poll.description}</p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600">{poll.votes_count || 0} Votes Cast</span>
                    <Button asChild variant="outline" size="sm" className="text-xs font-bold border-slate-200">
                      <Link href={`/${lang}/dashboard/polls/${poll.id}`}>
                        {isHindi ? 'वोट देखें / मतदान करें' : 'View & Vote'}
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. Tab 3: Financial Ledger & Accounts */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-xs font-extrabold text-emerald-800 uppercase tracking-wide">
                <span>Total Inflow (Income)</span>
                <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-950 mt-1">₹{income.toLocaleString()}</div>
              <p className="text-[11px] text-emerald-700 mt-1">Verified chanda, dues & grants</p>
            </div>

            <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-xs font-extrabold text-rose-800 uppercase tracking-wide">
                <span>Total Outflow (Expenses)</span>
                <ArrowUpRight className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-rose-950 mt-1">₹{expenses.toLocaleString()}</div>
              <p className="text-[11px] text-rose-700 mt-1">Ground actions, parcha print & aid</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-700 uppercase tracking-wide">
                <span>Net Treasury Balance</span>
                <Landmark className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">₹{balance.toLocaleString()}</div>
              <p className="text-[11px] text-slate-600 mt-1">Live ledger reconciliation</p>
            </div>
          </div>

          {/* Transactions Feed */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                {isHindi ? 'हालिया लेनदेन व बहीखाता प्रविष्टियां' : 'Recent Transactions Ledger'}
              </h3>
              <Button asChild variant="outline" size="sm" className="text-xs font-bold border-slate-200">
                <Link href={`/${lang}/dashboard/financials/new`}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {isHindi ? 'प्रविष्टि जोड़ें' : 'Add Entry'}
                </Link>
              </Button>
            </div>

            {transactions.length === 0 ? (
              <p className="text-xs text-slate-600 py-6 text-center">No recorded transactions in ledger.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {transactions.slice(0, 10).map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {tx.type === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{tx.description || 'General Transaction'}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{new Date(tx.created_at).toLocaleDateString()} • {tx.category || 'General'}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-black ${tx.type === 'income' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. Tab 4: Chanda & Donation Receipts */}
      {activeTab === 'chanda' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isHindi ? 'चंदा व दान रसीद डेस्क' : 'Chanda & Donation Receipts Desk'}
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {isHindi
                  ? 'सहयोग राशि की रसीदें जारी करें और QR कोड साझा करें। 80G लिखें सिर्फ तभी जब आपकी संस्था के पास खुद 80G पंजीकरण हो।'
                  : 'Issue donation receipts and share UPI QR codes. Mention 80G only if your org holds its own 80G registration.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs">
                <Link href={`/${lang}/dashboard/donations`}>
                  <HandCoins className="w-3.5 h-3.5 mr-1" />
                  {isHindi ? 'नया चंदा दर्ज करें' : 'Record Chanda / Donation'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Tab 5: Grants & CSR Matcher */}
      {activeTab === 'grants' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isHindi ? 'सरकारी योजनाएं व CSR अनुदान मैचिंग' : 'AI Grant Discovery & CSR Matcher'}
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {isHindi
                  ? 'अपने संगठन के प्रकार और कार्यक्षेत्र के अनुसार प्रासंगिक अनुदान खोजें और स्वतः आवेदन ड्राफ्ट करें।'
                  : 'Discover eligible institutional grants and CSR schemes tailored to your organization.'}
              </p>
            </div>
            <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs">
              <Link href={`/${lang}/dashboard/grants`}>
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                {isHindi ? 'अनुदान खोजें' : 'Explore Grants'}
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* 9. Tab 6: Campaigns & Petitions */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isHindi ? 'जन-अभियान, हस्ताक्षर याचिकाएं व संयुक्त मोर्चा' : 'Public Campaigns, Petitions & Coalition Alliances'}
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {isHindi
                  ? 'जनता को संगठित करने के लिए ऑनलाइन याचिकाएं शुरू करें और अन्य संगठनों के साथ मोर्चा बनाएं।'
                  : 'Mobilize ground support with verifiable digital petitions and joint-action alliances.'}
              </p>
            </div>
            <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs">
              <Link href={`/${lang}/dashboard/campaigns/new`}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                {isHindi ? 'नया अभियान शुरू करें' : 'Start Campaign'}
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* 10. Tab 7: Program Tasks & Dispatch */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isHindi ? 'कार्यक्रम कार्यभार व फील्ड टास्क बोर्ड' : 'Program & Field Action Tasks'}
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {isHindi
                  ? 'काडर सदस्यों व स्वयंसेवकों को विशिष्ट कार्य सौंपें और प्रगति ट्रैक करें।'
                  : 'Assign, coordinate, and track field operational tasks and volunteer assignments.'}
              </p>
            </div>
            <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs">
              <Link href={`/${lang}/dashboard/tasks/new`}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                {isHindi ? 'नया कार्य जोड़ें' : 'Create Task'}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
