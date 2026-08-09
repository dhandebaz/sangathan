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
} from 'lucide-react'
import { getOrgPlanUsage, PLAN_TIERS } from '@/lib/plans/limits'
import { BillingPlanSelector } from '@/components/dashboard/billing-plan-selector'

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
              {isHindi ? 'सदस्यता और बिलिंग प्रबंधन' : 'Subscription & Capacity Management'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {isHindi
                ? 'अपनी योजना क्षमता, संसाधन उपयोग और सदस्यता विवरण प्रबंधित करें।'
                : 'Manage your organization plan tier, resource limits, and payment history.'}
            </p>
          </div>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Plan Status */}
          <div className="space-y-1 md:border-r md:border-slate-100 pr-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'वर्तमान योजना' : 'Current Tier'}
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
              <span>{isHindi ? 'सदस्य स्लॉट' : 'Member Slots'}</span>
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

          {/* AI Intelligence */}
          <div className="space-y-1 md:border-r md:border-slate-100 pr-4">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'AI बुद्धिमत्ता' : 'AI Intelligence'}
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {usage.planTier.aiEnabled ? (isHindi ? 'सक्षम' : 'Active') : isHindi ? 'लॉक' : 'Locked'}
            </div>
            <div className="text-xs text-slate-500">
              {usage.planTier.aiEnabled
                ? isHindi
                  ? 'Llama 3.3 70B द्वारा संचालित'
                  : 'Llama 3.3 70B Unlocked'
                : isHindi
                  ? 'संस्थान योजना में उपलब्ध'
                  : 'Upgrade to Institution'}
            </div>
          </div>

          {/* White-label */}
          <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'व्हाइट-लेबल' : 'White-Label Branding'}
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {usage.whitelabelEnabled ? (isHindi ? 'सक्रिय' : 'Enabled') : isHindi ? 'अक्षम' : 'Standard'}
            </div>
            <div className="text-xs text-slate-500">
              {usage.whitelabelEnabled
                ? isHindi
                  ? 'कस्टम ब्रांडिंग सक्रिय है'
                  : 'Custom Branding Active'
                : isHindi
                  ? '₹10,000 ऐड-ऑन उपलब्ध'
                  : 'Add-on Available'}
            </div>
          </div>
        </div>
      </div>

      {/* Plan Selection Matrix */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {isHindi ? 'योजनाएं और उन्नयन' : 'Available Plans & Upgrades'}
          </h2>
          <p className="text-xs text-slate-500">
            {isHindi
              ? 'अपनी संस्था की वृद्धि के अनुसार सही योजना चुनें।'
              : 'Scale your civic group with transparent, predictable pricing.'}
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

      {/* Payment & Receipt History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Receipt className="w-5 h-5 text-slate-700" />
              {isHindi ? 'भुगतान और रसीद इतिहास' : 'Billing & Payment History'}
            </h2>
            <p className="text-xs text-slate-500">
              {isHindi
                ? 'रेज़रपे द्वारा संसाधित सभी लेनदेन रिकॉर्ड।'
                : 'All payment receipts processed via Razorpay.'}
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
                    <th className="py-3 px-4">{isHindi ? 'योजना' : 'Plan'}</th>
                    <th className="py-3 px-4">{isHindi ? 'अवधि' : 'Period'}</th>
                    <th className="py-3 px-4">{isHindi ? 'राशि' : 'Amount'}</th>
                    <th className="py-3 px-4">{isHindi ? 'लेनदेन आईडी' : 'Payment ID'}</th>
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
                        {tx.razorpay_payment_id || tx.razorpay_order_id || '—'}
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
              <p>{isHindi ? 'कोई पिछला भुगतान रिकॉर्ड नहीं मिला।' : 'No payment records found yet.'}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isHindi
                  ? 'जब आप अपग्रेड करेंगे, तो आपकी कर रसीदें यहाँ दिखाई देंगी।'
                  : 'Receipts and invoices will automatically appear here once you upgrade.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
