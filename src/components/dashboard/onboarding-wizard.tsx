'use client'

import React, { useState } from 'react'
import {
  Building2, CheckCircle2, ArrowRight, ArrowLeft, Sparkles,
  ShieldCheck, Globe, Users, DollarSign, Award, Radio
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { finalizeSignup } from '@/actions/auth'
import { ORG_TYPES, OrgType } from '@/lib/org-types'

interface OnboardingWizardProps {
  lang: string
}

const ORG_DESCRIPTIONS: Record<OrgType, string> = {
  student_union: 'Hostel & Mess audits, RTI/ATR assistant, election tallies & anti-ragging cell',
  workers_union: 'Collective bargaining (CBA), strike ballots, workplace grievances & dues',
  ngo: 'Donor CRM, 80G tax receipts, grant matcher & transparency ledger',
  rwa: 'Maintenance logs, estate operations & community voting',
  political_party: 'Campaign management, cadre tracking, party funds & internal voting',
}

export function OnboardingWizard({ lang }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Form State across 5 steps
  const [orgData, setOrgData] = useState({
    name: '',
    slug: '',
    type: 'ngo',
    registrationStatus: 'registered',
    registrationNumber: '',
    description: '',
    primaryRole: 'General Secretary',
    duesType: 'free',
    monthlyDues: '0',
    enablePublicPetitions: true,
    enableTransparencyLedger: true,
    enableEmergencySos: true,
  })

  const steps = [
    { number: 1, title: 'Identity & Slug' },
    { number: 2, title: 'Sector Blueprint' },
    { number: 3, title: 'Governance Roles' },
    { number: 4, title: 'Membership & Dues' },
    { number: 5, title: 'Launch Engine' },
  ]

  async function handleFinalSubmit() {
    if (!orgData.name) {
      toast.error('Organisation name is required.')
      return
    }

    setLoading(true)
    try {
      const res = await finalizeSignup({
        organizationName: orgData.name,
        organizationType: orgData.type,
        registrationStatus: orgData.registrationStatus,
      })

      if (res.success) {
        toast.success('Organisation initialized and live on Sangathan!')
        router.push(`/${lang}/dashboard`)
      } else {
        toast.error(res.error || 'Failed to complete setup.')
      }
    } catch {
      toast.error('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        {/* Step Progress Bar */}
        <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm">
          <div className="flex items-center justify-between">
            {steps.map((s) => (
              <div key={s.number} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                    step === s.number
                      ? 'bg-slate-900 text-white'
                      : step > s.number
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {step > s.number ? <CheckCircle2 className="w-4 h-4" /> : s.number}
                </div>
                <span
                  className={`text-xs font-semibold hidden md:inline ${
                    step === s.number ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Form Container */}
        <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm space-y-6">
          {/* STEP 1: IDENTITY & SLUG */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-xl font-bold text-slate-900">Step 1: Organisation Identity & Public Web Address</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose your organization name and reserve your unique public slug on Sangathan.
                </p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Official Collective Name *</Label>
                <Input
                  required
                  placeholder="e.g. All India Student Solidarity Front"
                  value={orgData.name}
                  onChange={(e) => {
                    const name = e.target.value
                    const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                    setOrgData({ ...orgData, name, slug: orgData.slug || generatedSlug })
                  }}
                  className="mt-1 h-10 text-sm rounded-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Unique Public URL Slug *</Label>
                <div className="flex items-center mt-1">
                  <span className="bg-slate-100 text-slate-500 text-xs px-3 h-10 flex items-center border border-r-0 border-slate-200 rounded-l-sm font-mono">
                    sangathan.org/
                  </span>
                  <Input
                    required
                    placeholder="student-front"
                    value={orgData.slug}
                    onChange={(e) => setOrgData({ ...orgData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    className="h-10 text-xs font-mono rounded-r-sm rounded-l-none"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Mission Statement / Bio</Label>
                <Textarea
                  rows={2}
                  placeholder="Brief summary of your collective demands, causes, and democratic objectives..."
                  value={orgData.description}
                  onChange={(e) => setOrgData({ ...orgData, description: e.target.value })}
                  className="mt-1 text-xs rounded-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 2: SECTOR BLUEPRINT */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-xl font-bold text-slate-900">Step 2: Collective Sector Blueprint</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your organizational archetype to auto-configure compliant workflows, modules, and governance desks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {(Object.entries(ORG_TYPES) as [OrgType, typeof ORG_TYPES[OrgType]][]).map(([id, config]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setOrgData({ ...orgData, type: id })}
                    className={`p-4 text-left border rounded-sm transition-all ${
                      orgData.type === id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-900">{config.en}</div>
                    <div className="text-xs text-slate-500 mt-1 leading-relaxed">{ORG_DESCRIPTIONS[id]}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: GOVERNANCE ROLES */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-xl font-bold text-slate-900">Step 3: Governance & Tiered Leadership</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define executive committee roles and administrative designations.
                </p>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Your Initial Designation *</Label>
                <Select
                  value={orgData.primaryRole}
                  onValueChange={(val) => setOrgData({ ...orgData, primaryRole: val })}
                >
                  <SelectTrigger className="mt-1 h-10 text-xs rounded-sm">
                    <SelectValue placeholder="Select Designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="President">President (अध्यक्ष)</SelectItem>
                    <SelectItem value="Vice President">Vice President (उपाध्यक्ष)</SelectItem>
                    <SelectItem value="General Secretary">General Secretary (महासचिव)</SelectItem>
                    <SelectItem value="Convener">Convener / Coordinator (संयोजक)</SelectItem>
                    <SelectItem value="Legal Aid Head">Legal Aid Cell In-Charge</SelectItem>
                    <SelectItem value="Treasurer">Treasurer / Finance Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Dual-Approval Security Enabled</span>
                </div>
                <p>
                  High-risk operations (such as broadcasting announcements to &gt;1000 members or ledger adjustments) require dual executive approvals.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: MEMBERSHIP & DUES */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-xl font-bold text-slate-900">Step 4: Membership Policy & Dues Structure</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure open grassroots membership or monthly dues collection.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrgData({ ...orgData, duesType: 'free' })}
                  className={`p-3.5 text-left border rounded-sm ${
                    orgData.duesType === 'free'
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">Free Open Membership</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">No mandatory fee for cadre/students</p>
                </button>

                <button
                  type="button"
                  onClick={() => setOrgData({ ...orgData, duesType: 'paid' })}
                  className={`p-3.5 text-left border rounded-sm ${
                    orgData.duesType === 'paid'
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">Monthly Contribution / Dues</div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Automated UPI subscription & receipts</p>
                </button>
              </div>

              {orgData.duesType === 'paid' && (
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Monthly Dues (INR)</Label>
                  <Input
                    type="number"
                    value={orgData.monthlyDues}
                    onChange={(e) => setOrgData({ ...orgData, monthlyDues: e.target.value })}
                    placeholder="₹ 100"
                    className="mt-1 h-9 text-xs rounded-sm"
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 5: LAUNCH ENGINE */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-xl font-bold text-slate-900">Step 5: Activate Growth & Governance Engines</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm public portals and automated field tools.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">1-Click Public Petition Studio</div>
                    <div className="text-[11px] text-slate-500">Live signature counter & volunteer conversion</div>
                  </div>
                  <span className="text-xs text-emerald-600 font-bold">Enabled</span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Public Transparency & Trust Ledger</div>
                    <div className="text-[11px] text-slate-500">SHA-256 verified real-time fund utilization</div>
                  </div>
                  <span className="text-xs text-emerald-600 font-bold">Enabled</span>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Emergency SOS & Legal Defense Network</div>
                    <div className="text-[11px] text-slate-500">1-tap protest detention broadcast & advocate dispatch</div>
                  </div>
                  <span className="text-xs text-emerald-600 font-bold">Enabled</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep((s) => s - 1)}
                className="text-xs border-slate-300"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back
              </Button>
            ) : <div />}

            {step < 5 ? (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (step === 1 && !orgData.name) {
                    toast.error('Please enter your organization name.')
                    return
                  }
                  setStep((s) => s + 1)
                }}
                className="bg-slate-900 text-white font-semibold text-xs h-9 px-4 rounded-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                disabled={loading}
                onClick={handleFinalSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-6 rounded-sm shadow-md"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                {loading ? 'Initializing Collective...' : 'Launch Sangathan OS'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
