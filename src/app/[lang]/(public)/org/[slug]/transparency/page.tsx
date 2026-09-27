import { createServiceClient } from '@/lib/supabase/service'
import { notFound } from 'next/navigation'
import {
  ShieldCheck, BarChart3, Lock, CheckCircle2, FileText,
  DollarSign, ArrowUpRight, Scale, Download, Award
} from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string; lang: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, lang } = await params
  return {
    title: lang === 'hi' ? 'पारदर्शिता एवं सार्वजनिक वित्तीय बहीखाता | संगठन' : `Public Transparency & Trust Ledger | Sangathan`,
    description: 'Verified real-time fund utilization and SHA-256 cryptographically audited expense ledger.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/org/${slug}/transparency`,
      languages: {
        en: `https://sangathan.space/en/org/${slug}/transparency`,
        hi: `https://sangathan.space/hi/org/${slug}/transparency`,
      },
    },
  }
}

export default async function PublicTransparencyPage({ params }: PageProps) {
  const { slug, lang } = await params
  const adminClient = createServiceClient()

  const { data: org, error } = await adminClient
    .from('organisations')
    .select('id, name, created_at, slug, public_transparency_enabled, status, org_type')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !org) {
    notFound()
  }

  // Fetch metrics & ledger entries
  const [entriesRes, membersCount, donationsRes] = await Promise.all([
    adminClient
      .from('transparency_ledger_entries')
      .select('*')
      .eq('organisation_id', org.id)
      .eq('is_publicly_visible', true)
      .order('expense_date', { ascending: false }),
    adminClient
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', org.id)
      .eq('status', 'active'),
    adminClient
      .from('donations')
      .select('amount')
      .eq('organisation_id', org.id),
  ])

  const entries = entriesRes.data || []
  const totalFundsRaised = (donationsRes.data || []).reduce((acc, curr) => acc + (curr.amount || 0), 0)
  const totalExpenditure = entries.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)

  const categoryTotals: Record<string, number> = {
    programs: 0,
    legal_aid: 0,
    student_welfare: 0,
    labor_relief: 0,
    community_action: 0,
    operations: 0,
    campaigns: 0,
  }

  entries.forEach((e) => {
    if (categoryTotals[e.category] !== undefined) {
      categoryTotals[e.category] += Number(e.amount || 0)
    }
  })

  const programmaticSpending =
    categoryTotals.programs +
    categoryTotals.legal_aid +
    categoryTotals.student_welfare +
    categoryTotals.labor_relief +
    categoryTotals.community_action

  const programmaticRatio = totalExpenditure > 0
    ? Math.round((programmaticSpending / totalExpenditure) * 100)
    : null

  const hashVerifiedCount = entries.filter((e) => e.receipt_sha256_hash).length
  const activeMembers = membersCount.count ?? 0

  const categoryPercent = (value: number) =>
    totalExpenditure > 0 ? Math.min(100, Math.round((value / totalExpenditure) * 100)) : 0

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Technical Header */}
      <header className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Public Transparency Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{org.name}</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Operating with open democratic accountability on Sangathan since {new Date(org.created_at).getFullYear()}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm text-right">
              <div className="text-xs text-slate-600 font-bold">Active Members</div>
              <div className="text-xl font-extrabold text-slate-900">{activeMembers.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Core Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Total Inflow / Raised
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              ₹{totalFundsRaised.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Recorded contributions & dues</p>
          </div>

          <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Programmatic Allocation
            </div>
            <div className="text-2xl font-extrabold text-indigo-600">
              {programmaticRatio !== null ? `${programmaticRatio}%` : '—'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {programmaticRatio !== null ? 'Direct field advocacy & legal defense' : 'No public expenditure entries yet'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-sm border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Verified Audit Trail
            </div>
            <div className="text-2xl font-extrabold text-emerald-700">
              {entries.length > 0 ? `${hashVerifiedCount}/${entries.length}` : '—'}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Public entries with SHA-256 receipt hashes</p>
          </div>
        </div>

        {/* Categorical Utilization Breakdown */}
        <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Real-Time Fund Utilization Breakdown</span>
            </h2>
            <span className="text-xs text-slate-500">Total: ₹{totalExpenditure.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Direct Programs & Student/Worker Welfare</span>
                  <span>₹{(categoryTotals.programs + categoryTotals.student_welfare + categoryTotals.labor_relief).toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{ width: `${categoryPercent(categoryTotals.programs + categoryTotals.student_welfare + categoryTotals.labor_relief)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Legal Aid & Rapid Response Defense</span>
                  <span>₹{categoryTotals.legal_aid.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full" style={{ width: `${categoryPercent(categoryTotals.legal_aid)}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Operations, Printouts & Admin</span>
                  <span>₹{categoryTotals.operations.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-slate-500 h-full" style={{ width: `${categoryPercent(categoryTotals.operations)}%` }} />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Audited Financial Standing</span>
              </div>
              <p>
                All expenditures listed above are published from the organisation's own transparency ledger. Members can cross-verify each entry against internal records at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Verified Itemized Expense Ledger */}
        <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" />
              <span>Verified Itemized Expense Entries ({entries.length})</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Immutable Hash Chain</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-bold text-slate-700">Date</th>
                  <th className="py-2.5 px-3 font-bold text-slate-700">Expense Title</th>
                  <th className="py-2.5 px-3 font-bold text-slate-700">Category</th>
                  <th className="py-2.5 px-3 font-bold text-slate-700">Vendor / Payee</th>
                  <th className="py-2.5 px-3 font-bold text-slate-700">Amount</th>
                  <th className="py-2.5 px-3 font-bold text-slate-700">SHA-256 Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {item.expense_date}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{item.title}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold uppercase">
                        {item.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{item.recipient_vendor}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                      ₹{Number(item.amount).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                      {item.receipt_sha256_hash ? item.receipt_sha256_hash.slice(0, 16) + '...' : '—'}
                    </td>
                  </tr>
                ))}

                {entries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No public expense ledger entries published for this fiscal period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
