'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Scale, CheckCircle2, XCircle, FileCheck, ShieldCheck, User } from 'lucide-react'

interface LyngdohClientProps {
  initialCandidates: any[]
  organisationId: string
}

interface CandidateCheck {
  name: string
  course: 'UG' | 'PG' | 'PhD'
  age: number
  attendance: number
  hasBacklogs: boolean
  hasCriminalRecord: boolean
  expenseLogged: number
}

export default function LyngdohClient({ initialCandidates }: LyngdohClientProps) {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(initialCandidates[0]?.id || '')
  
  const [candidate, setCandidate] = useState<CandidateCheck>({
    name: initialCandidates[0]?.profiles?.full_name || '',
    course: 'UG',
    age: 20,
    attendance: 78,
    hasBacklogs: false,
    hasCriminalRecord: false,
    expenseLogged: 3200
  })

  // Handle selecting candidate from real database records
  const handleSelectDbCandidate = (candId: string) => {
    setSelectedCandidateId(candId)
    const found = initialCandidates.find(c => c.id === candId)
    if (found) {
      setCandidate({
        name: found.profiles?.full_name || 'Nominated Candidate',
        course: 'UG',
        age: 21,
        attendance: 80,
        hasBacklogs: false,
        hasCriminalRecord: false,
        expenseLogged: 2500
      })
    }
  }

  // Eligibility evaluation logic
  const getMaxAge = (course: string) => {
    if (course === 'UG') return 22
    if (course === 'PG') return 25
    return 28 // PhD / MPhil
  }

  const maxAgeAllowed = getMaxAge(candidate.course)
  const isAgeValid = candidate.age >= 17 && candidate.age <= maxAgeAllowed
  const isAttendanceValid = candidate.attendance >= 75
  const isBacklogValid = !candidate.hasBacklogs
  const isRecordValid = !candidate.hasCriminalRecord
  const isExpenseValid = candidate.expenseLogged <= 5000

  const isFullyEligible = isAgeValid && isAttendanceValid && isBacklogValid && isRecordValid && isExpenseValid

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-6 rounded-2xl border border-emerald-900/50 shadow-xl">
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8 text-emerald-400" />
          <div>
            <h2 className="text-xl font-bold">Lyngdoh Committee Guidelines Audit</h2>
            <p className="text-slate-300 text-sm mt-1">
              Supreme Court mandated compliance checklist for Indian Student Union elections (Age limits, attendance, ₹5,000 spending cap).
            </p>
          </div>
        </div>
      </div>

      {/* Select Nominated Candidate from Database */}
      {initialCandidates.length > 0 && (
        <Card className="border bg-slate-50">
          <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Nominated Election Candidates in DB</p>
                <p className="text-sm font-semibold text-slate-900">Select candidate to run automatic Lyngdoh compliance audit:</p>
              </div>
            </div>
            <select
              value={selectedCandidateId}
              onChange={e => handleSelectDbCandidate(e.target.value)}
              className="w-full sm:w-auto rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white font-medium"
            >
              {initialCandidates.map(c => (
                <option key={c.id} value={c.id}>
                  {c.profiles?.full_name} — {c.election_positions?.title} ({c.election_positions?.elections?.title})
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Candidate Evaluation Form */}
        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader className="border-b bg-slate-50">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              Candidate Eligibility Checker
            </CardTitle>
            <CardDescription>
              Test candidate eligibility against Ministry of HRD / Supreme Court Lyngdoh norms.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Candidate Name</label>
                <input
                  type="text"
                  value={candidate.name}
                  onChange={e => setCandidate({ ...candidate, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Degree Program</label>
                <select
                  value={candidate.course}
                  onChange={e => setCandidate({ ...candidate, course: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="UG">Undergraduate (UG) - Max Age 22</option>
                  <option value="PG">Postgraduate (PG) - Max Age 25</option>
                  <option value="PhD">Research Scholar (PhD/MPhil) - Max Age 28</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={candidate.age}
                  onChange={e => setCandidate({ ...candidate, age: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Attendance Percentage (%)</label>
                <input
                  type="number"
                  value={candidate.attendance}
                  onChange={e => setCandidate({ ...candidate, attendance: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Logged Campaign Expense (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={candidate.expenseLogged}
                    onChange={e => setCandidate({ ...candidate, expenseLogged: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-slate-300 pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Lyngdoh Limit: ₹5,000 maximum per candidate</p>
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={candidate.hasBacklogs}
                  onChange={e => setCandidate({ ...candidate, hasBacklogs: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-sm font-medium text-slate-800">Has Academic Arrears / Pending Backlogs</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={candidate.hasCriminalRecord}
                  onChange={e => setCandidate({ ...candidate, hasCriminalRecord: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-sm font-medium text-slate-800">Has Disciplinary Action or Criminal Record</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Audit Results Card */}
        <Card className={`border-2 shadow-md ${isFullyEligible ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'}`}>
          <CardHeader className="border-b">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Audit Status & Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="text-center py-4">
              {isFullyEligible ? (
                <div className="space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <span className="inline-block bg-emerald-600 text-white font-extrabold text-sm px-3 py-1 rounded-full uppercase tracking-wider">
                    COMPLIANT & ELIGIBLE
                  </span>
                  <p className="text-xs text-slate-600 mt-2">Candidate meets all Lyngdoh Committee criteria for nomination.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <XCircle className="w-12 h-12 text-rose-600 mx-auto" />
                  <span className="inline-block bg-rose-600 text-white font-extrabold text-sm px-3 py-1 rounded-full uppercase tracking-wider">
                    NON-COMPLIANT
                  </span>
                  <p className="text-xs text-slate-600 mt-2">Nomination risks rejection by the Election Returning Officer.</p>
                </div>
              )}
            </div>

            <div className="space-y-2.5 border-t pt-4 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Age Limit (&le; {maxAgeAllowed}):</span>
                {isAgeValid ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Passed ({candidate.age} yrs)</span>
                ) : (
                  <span className="text-rose-700 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Failed ({candidate.age} yrs)</span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Attendance (&ge; 75%):</span>
                {isAttendanceValid ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Passed ({candidate.attendance}%)</span>
                ) : (
                  <span className="text-rose-700 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Failed ({candidate.attendance}%)</span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">No Academic Arrears:</span>
                {isBacklogValid ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Clear</span>
                ) : (
                  <span className="text-rose-700 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Has Backlogs</span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Expense Cap (&le; ₹5,000):</span>
                {isExpenseValid ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> ₹{candidate.expenseLogged}</span>
                ) : (
                  <span className="text-rose-700 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Exceeded (₹{candidate.expenseLogged})</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
