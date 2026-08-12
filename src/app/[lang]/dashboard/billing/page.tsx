import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Users,
  BrainCircuit,
  HardDrive,
  ShieldCheck,
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Building2,
  Sparkles,
} from 'lucide-react'
import { getOrgPlanUsage, PLAN_TIERS } from '@/lib/plans/limits'
import { BillingPlanSelector } from '@/components/dashboard/billing-plan-selector'
import { SangathanAiModal } from '@/components/ai/sangathan-ai-modal'

export const dynamic = 'force-dynamic'

interface BillingPageProps {
  params: Promise<{ lang: string }>
}

export default async function BillingDashboardPage({ params }: BillingPageProps) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${lang}/login`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  if (!profile || !profile.organisation_id) {
    redirect(`/${lang}/onboarding`)
  }

  const orgId = profile.organisation_id
  const usage = await getOrgPlanUsage(orgId)

  // Fetch billing transactions
  const supabaseAdmin = createServiceClient()
  const { data: transactions } = await supabaseAdmin
    .from('billing_transactions')
    .select('*')
    .eq('organisation_id', orgId)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/${lang}/dashboard/settings`}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isHindi ? 'नागरिक पहुंच और स्थिरता प्रबंधन' : 'Civic Access & Sustainability Management'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {isHindi
                ? 'अपनी संगठनात्मक पहुंच, सदस्य क्षमता, AI सहायता और योगदान इतिहास प्रबंधित करें।'
                : 'Manage your organization access model, member capacity, Sangathan AI, and contribution history.'}
            </p>
          </div>
        </div>

        <Link
          href={`/${lang}/pricing`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
        >
          <span>{isHindi ? 'सार्वजनिक Pay & Price देखें' : 'View Public Pay & Price'}</span>
        </Link>
      </div>

      {/* Hero Overview Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Plan Status */}
          <div className="space-y-1 md:border-r md:border-slate-100 pr-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'वर्तमान पहुंच मॉडल' : 'Current Access Model'}
            </div>
            <div className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              {isHindi ? usage.planTier.nameHi : usage.planTier.name}
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-3 h-3" /> {usage.planStatus.toUpperCase()}
              </span>
              {usage.planExpiresAt && (
                <span className="text-[11px] text-slate-500">
                  {isHindi ? 'नवीनीकरण:' : 'Renews:'}{' '}
                  {new Date(usage.planExpiresAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Member Capacity */}
          <div className="space-y-1 md:border-r md:border-slate-100 pr-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>{isHindi ? 'सक्रिय सदस्य स्लॉट' : 'Active Member Slots'}</span>
              <span className="text-slate-900 font-bold">{usage.memberUsagePercentage}%</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {usage.memberCount}{' '}
              <span className="text-sm font-medium text-slate-400">/ {usage.maxMembers}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all ${
                  usage.isAtMemberLimit
                    ? 'bg-rose-600'
                    : usage.isNearMemberLimit
                      ? 'bg-amber-500'
                      : 'bg-indigo-600'
                }`}
                style={{ width: `${Math.min(100, usage.memberUsagePercentage)}%` }}
              />
            </div>
          </div>

          {/* Sangathan AI */}
          <div className="space-y-1 md:border-r md:border-slate-100 pr-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Sangathan AI</span>
              <SangathanAiModal lang={lang} isHindi={isHindi}>
                <button type="button" className="text-[10px] text-indigo-600 hover:underline">Info</button>
              </SangathanAiModal>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 flex items-center gap-1.5">
              {usage.planTier.aiEnabled ? (
                <span className="text-emerald-700">{isHindi ? 'सक्रिय' : 'Active'}</span>
              ) : (
                <span className="text-slate-500">{isHindi ? 'संरक्षक स्तर' : 'Sustainer'}</span>
              )}
            </div>
            <div className="text-xs text-slate-500">
              {usage.planTier.aiEnabled
                ? isHindi
                  ? 'संप्रभु व निजी सहायता उपलब्ध'
                  : 'Sovereign AI Suite Unlocked'
                : isHindi
                  ? 'संरक्षक पहुंच में उपलब्ध'
                  : 'Included in Sustainer Access'}
            </div>
          </div>

          {/* Custom Emblem */}
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'कस्टम प्रतीक' : 'Custom Emblem'}
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {usage.whitelabelEnabled ? (isHindi ? 'सक्रिय' : 'Enabled') : isHindi ? 'मानक' : 'Standard'}
            </div>
            <div className="text-xs text-slate-500">
              {usage.whitelabelEnabled
                ? isHindi
                  ? 'कस्टम पहचान सक्रिय है'
                  : 'Custom Emblem Active'
                : isHindi
                  ? '₹10,000 ऐड-ऑन उपलब्ध'
                  : 'Add-on Available'}
            </div>
          </div>
        </div>
      </div>

      {/* Access Selection Matrix */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {isHindi ? 'पहुंच मॉडल और योगदान' : 'Access Models & Contributions'}
          </h2>
          <p className="text-xs text-slate-500">
            {isHindi
              ? 'स्वैच्छिक योगदान दें या नागरिक बुनियादी ढांचे को बनाए रखने के लिए संरक्षक बनें।'
              : 'Support democratic civic infrastructure with voluntary contributions or sustained institutional patronage.'}
          </p>
        </div>

        <BillingPlanSelector
          currentPlanName={usage.planName}
          whitelabelEnabled={usage.whitelabelEnabled}
          orgId={orgId}
          lang={lang}
          isHindi={isHindi}
        />
      </div>

      {/* Contribution & Receipt History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Receipt className="w-5 h-5 text-slate-700" />
              {isHindi ? 'योगदान और रसीद इतिहास' : 'Contribution & Receipt History'}
            </h2>
            <p className="text-xs text-slate-500">
              {isHindi
                ? 'रेज़रपे द्वारा सुरक्षित रूप से संसाधित सभी योगदान और रसीदें।'
                : 'All contributions processed securely via Razorpay for Bahujan Queer Foundation.'}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          {transactions && transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">{isHindi ? 'दिनांक' : 'Date'}</th>
                    <th className="py-3 px-4">{isHindi ? 'पहुंच प्रकार' : 'Access Tier'}</th>
                    <th className="py-3 px-4">{isHindi ? 'अवधि' : 'Period'}</th>
                    <th className="py-3 px-4">{isHindi ? 'योगदान राशि' : 'Amount'}</th>
                    <th className="py-3 px-4">{isHindi ? 'लेनदेन संदर्भ' : 'Payment ID'}</th>
                    <th className="py-3 px-4">{isHindi ? 'स्थिति' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-medium">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{tx.plan_name}</td>
                      <td className="py-3.5 px-4 capitalize">{tx.plan_period}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">₹{Number(tx.amount).toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {tx.razorpay_payment_id || tx.razorpay_order_id || '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p>{isHindi ? 'कोई पिछला योगदान रिकॉर्ड नहीं मिला।' : 'No contribution records found yet.'}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isHindi
                  ? 'जब आप स्वैच्छिक योगदान देंगे, तो आपकी रसीदें यहाँ दिखाई देंगी।'
                  : 'Receipts will automatically appear here once a voluntary contribution is completed.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
