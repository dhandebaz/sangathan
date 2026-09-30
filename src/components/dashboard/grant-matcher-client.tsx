'use client'

import React, { useState } from 'react'
import {
  Sparkles, DollarSign, Building2, CheckCircle2, Download,
  ExternalLink, ArrowRight, FileText, Filter, Award, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  MatchResult,
  GeneratedProposalDraft,
  generateGrantProposalDraftAction
} from '@/actions/ai/grant-matcher'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog'

interface GrantMatcherClientProps {
  matches: MatchResult[]
  orgName: string
}

export function GrantMatcherClient({ matches, orgName }: GrantMatcherClientProps) {
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeProposal, setActiveProposal] = useState<GeneratedProposalDraft | null>(null)
  const [filterType, setFilterType] = useState<string>('all')

  const filteredMatches = matches.filter((m) => {
    if (filterType === 'all') return true
    return m.opportunity.funderType === filterType
  })

  async function handleGenerateDraft(match: MatchResult) {
    setSelectedMatch(match)
    setIsGenerating(true)

    try {
      const res = await generateGrantProposalDraftAction(match.opportunity.id)
      if (res.success && res.proposal) {
        setActiveProposal(res.proposal)
        toast.success('AI Proposal Draft generated successfully!')
      } else {
        toast.error(res.error || 'Failed to generate grant proposal.')
      }
    } catch {
      toast.error('An error occurred generating the proposal draft.')
    } finally {
      setIsGenerating(false)
    }
  }

  function handleDownloadProposalMarkdown() {
    if (!activeProposal) return
    const md = `# GRANT PROPOSAL DRAFT
## ${activeProposal.projectTitle}
**Target Opportunity:** ${activeProposal.opportunityTitle}
**Funder:** ${activeProposal.funderName}
**Requested Budget:** INR ${activeProposal.requestedAmount.toLocaleString()}

---
### 1. Executive Summary
${activeProposal.executiveSummary}

### 2. Problem Statement
${activeProposal.problemStatement}

### 3. Core Objectives
${activeProposal.objectives.map((o) => `- ${o}`).join('\n')}

### 4. Field Methodology & Workplan
${activeProposal.methodology}

### 5. Itemized Budget
${activeProposal.itemizedBudget.map((b) => `- **${b.item}:** INR ${b.amount.toLocaleString()}`).join('\n')}

### 6. Key Performance Indicators (KPIs)
${activeProposal.impactKpis.map((k) => `- ${k}`).join('\n')}

---
*Draft generated via Sangathan AI Grant Matcher Engine*
`
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Proposal_${activeProposal.projectTitle.replace(/\s+/g, '_')}.md`
    a.click()
    toast.success('Proposal downloaded as Markdown!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span>AI Grant & CSR Opportunity Matcher</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated scanning of open government schemes & CSR funds matched to {orgName} with 1-click proposal generator.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-sm text-xs">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-sm font-semibold transition-colors ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            All Schemes ({matches.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('government')}
            className={`px-3 py-1 rounded-sm font-semibold transition-colors ${
              filterType === 'government' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Govt Schemes
          </button>
          <button
            type="button"
            onClick={() => setFilterType('csr_corporate')}
            className={`px-3 py-1 rounded-sm font-semibold transition-colors ${
              filterType === 'csr_corporate' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Corporate CSR
          </button>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMatches.map((m) => {
          const opp = m.opportunity
          return (
            <div
              key={opp.id}
              className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold uppercase rounded-sm border border-indigo-100">
                      {opp.funderType.replace('_', ' ')}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
                      {opp.title}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs text-slate-400 font-medium">Match Score</div>
                    <div className="text-base font-extrabold text-emerald-600">
                      {m.matchScore}%
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{opp.guidelinesSummary}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opp.focusAreas.map((area, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-sm text-xs text-slate-700 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max Grant Amount:</span>
                    <strong className="text-slate-900">₹{opp.maxFundingAmount.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Application Deadline:</span>
                    <span className="font-mono text-slate-700">{opp.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <Button
                  onClick={() => handleGenerateDraft(m)}
                  disabled={isGenerating && selectedMatch?.opportunity.id === opp.id}
                  className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-white font-semibold text-xs h-9 rounded-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                  {isGenerating && selectedMatch?.opportunity.id === opp.id
                    ? 'Synthesizing...'
                    : 'Generate AI Proposal'}
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="text-xs border-slate-300 h-9"
                >
                  <a href={opp.portalUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                    Portal
                  </a>
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* PROPOSAL DRAFT MODAL */}
      <Dialog open={!!activeProposal} onOpenChange={(open) => !open && setActiveProposal(null)}>
        <DialogContent className="max-w-3xl bg-white border border-slate-200 p-6 rounded-sm max-h-[85vh] overflow-y-auto">
          {activeProposal && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI Synthesized Grant Proposal Draft</span>
                </div>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  {activeProposal.projectTitle}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Submitted for: {activeProposal.opportunityTitle} • Requested Amount: ₹
                  {activeProposal.requestedAmount.toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-xs text-slate-700 leading-relaxed divide-y divide-slate-100">
                <div className="space-y-1.5 pt-2">
                  <h4 className="font-bold text-slate-900 text-sm">1. Executive Summary</h4>
                  <p>{activeProposal.executiveSummary}</p>
                </div>

                <div className="space-y-1.5 pt-4">
                  <h4 className="font-bold text-slate-900 text-sm">2. Local Problem Statement</h4>
                  <p>{activeProposal.problemStatement}</p>
                </div>

                <div className="space-y-1.5 pt-4">
                  <h4 className="font-bold text-slate-900 text-sm">3. Specific Objectives</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {activeProposal.objectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5 pt-4">
                  <h4 className="font-bold text-slate-900 text-sm">4. Itemized Budget Breakdown</h4>
                  <div className="bg-slate-50 p-3 rounded-sm border border-slate-200 space-y-2">
                    {activeProposal.itemizedBudget.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{item.item}</span>
                        <strong className="text-slate-900 font-mono">₹{item.amount.toLocaleString()}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-4">
                  <h4 className="font-bold text-slate-900 text-sm">5. Measurable Impact KPIs</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {activeProposal.impactKpis.map((kpi, i) => (
                      <li key={i}>{kpi}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setActiveProposal(null)}
                  className="text-xs"
                >
                  Close
                </Button>
                <Button
                  onClick={handleDownloadProposalMarkdown}
                  className="bg-white text-slate-900 border border-slate-200 text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download Proposal Markdown
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
