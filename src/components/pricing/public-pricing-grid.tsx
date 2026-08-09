'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Sparkles, Building2, Zap } from 'lucide-react'
import { CheckoutButton } from '@/components/pricing/checkout-button'
import { PLAN_TIERS, WHITE_LABEL_ADDON } from '@/lib/plans/limits'

interface PublicPricingGridProps {
  orgId: string
  lang: string
  isHindi: boolean
}

export function PublicPricingGrid({ orgId, lang, isHindi }: PublicPricingGridProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')

  return (
    <div className="space-y-16">
      {/* Billing Cycle Switcher */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-100 border border-slate-200 shadow-inner">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isHindi ? 'मासिक बिलिंग' : 'Monthly Billing'}
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              billingCycle === 'yearly'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{isHindi ? 'वार्षिक बिलिंग' : 'Annual Billing'}</span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
              billingCycle === 'yearly' ? 'bg-indigo-700 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isHindi ? '2 माह मुफ़्त' : '2 Months Free'}
            </span>
          </button>
        </div>
        <p className="text-xs text-slate-500">
          {isHindi
            ? 'वार्षिक योजना पर ₹2,000 की बचत करें। कोई छिपा हुआ शुल्क नहीं।'
            : 'Save ₹2,000 per year on Institution with annual billing. No hidden fees.'}
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free / Community Tier */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                {isHindi ? PLAN_TIERS.Community.nameHi : PLAN_TIERS.Community.name}
              </h3>
              <p className="text-sm text-slate-500">
                {isHindi ? PLAN_TIERS.Community.descriptionHi : PLAN_TIERS.Community.descriptionEn}
              </p>
            </div>

            <div className="mb-6">
              <span className="text-5xl font-extrabold text-slate-900">₹0</span>
              <span className="text-slate-500 font-medium ml-1">/{isHindi ? 'हमेशा' : 'forever'}</span>
            </div>

            <Link
              href={`/${lang}/login?tab=signup`}
              className="block w-full py-3.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-center text-sm transition-colors mb-8"
            >
              {isHindi ? 'मुफ़्त शुरू करें' : 'Start for Free'}
            </Link>

            <div className="space-y-3.5 mb-8">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {isHindi ? 'शामिल विशेषताएं:' : 'Included features:'}
              </div>
              {(isHindi ? PLAN_TIERS.Community.featuresHi : PLAN_TIERS.Community.featuresEn).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="mt-0.5 bg-emerald-100 text-emerald-600 rounded-full p-0.5 shrink-0">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-100 pt-4">
            {isHindi ? 'कोई क्रेडिट कार्ड आवश्यक नहीं' : 'No credit card required to start'}
          </div>
        </div>

        {/* Institution / Paid Tier (Featured) */}
        <div className="relative rounded-3xl border-2 border-indigo-500 bg-white p-8 shadow-xl flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div>
            <div className="mb-6 relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                  {isHindi ? PLAN_TIERS.Institution.nameHi : PLAN_TIERS.Institution.name}
                  <Sparkles className="text-indigo-500" size={20} />
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800">
                  {isHindi ? 'सबसे लोकप्रिय' : 'Most Popular'}
                </span>
              </div>
              <p className="text-sm text-slate-500">
                {isHindi ? PLAN_TIERS.Institution.descriptionHi : PLAN_TIERS.Institution.descriptionEn}
              </p>
            </div>

            <div className="mb-6 relative z-10">
              <span className="text-5xl font-extrabold text-slate-900">
                ₹{billingCycle === 'yearly' ? '10,000' : '1,000'}
              </span>
              <span className="text-slate-500 font-medium ml-1">
                /{billingCycle === 'yearly' ? (isHindi ? 'वर्ष' : 'year') : isHindi ? 'माह' : 'month'}
              </span>
            </div>

            {!orgId ? (
              <Link
                href={`/${lang}/login`}
                className="relative block w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center text-sm transition-colors mb-8 shadow-sm"
              >
                {isHindi ? 'लॉग इन करके अपग्रेड करें' : 'Log in to Upgrade'}
              </Link>
            ) : (
              <CheckoutButton
                amount={billingCycle === 'yearly' ? 10000 : 1000}
                planName="Institution"
                planPeriod={billingCycle}
                labelEn="Upgrade to Institution"
                labelHi="संस्थान में अपग्रेड करें"
                isHindi={isHindi}
                orgId={orgId}
                className="relative w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center text-sm transition-colors mb-8 shadow-sm"
              />
            )}

            <div className="space-y-3.5 mb-8 relative z-10">
              <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                {isHindi ? 'समुदाय में सब कुछ, और:' : 'Everything in Community, plus:'}
              </div>
              {(isHindi ? PLAN_TIERS.Institution.featuresHi : PLAN_TIERS.Institution.featuresEn).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="mt-0.5 bg-indigo-100 text-indigo-600 rounded-full p-0.5 shrink-0">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-800 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-indigo-600 font-medium border-t border-slate-100 pt-4">
            {isHindi ? '14-दिन की पूर्ण धनवापसी गारंटी' : '14-day 100% money-back guarantee'}
          </div>
        </div>

        {/* Federation / Enterprise Tier */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                  {isHindi ? PLAN_TIERS.Federation.nameHi : PLAN_TIERS.Federation.name}
                  <Zap className="text-amber-500" size={20} />
                </h3>
              </div>
              <p className="text-sm text-slate-500">
                {isHindi ? PLAN_TIERS.Federation.descriptionHi : PLAN_TIERS.Federation.descriptionEn}
              </p>
            </div>

            <div className="mb-6">
              <span className="text-5xl font-extrabold text-slate-900">
                ₹{billingCycle === 'yearly' ? '49,999' : '4,999'}
              </span>
              <span className="text-slate-500 font-medium ml-1">
                /{billingCycle === 'yearly' ? (isHindi ? 'वर्ष' : 'year') : isHindi ? 'माह' : 'month'}
              </span>
            </div>

            {!orgId ? (
              <Link
                href={`/${lang}/contact`}
                className="block w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-center text-sm transition-colors mb-8"
              >
                {isHindi ? 'संपर्क करें / शुरू करें' : 'Contact Federation Team'}
              </Link>
            ) : (
              <CheckoutButton
                amount={billingCycle === 'yearly' ? 49999 : 4999}
                planName="Federation"
                planPeriod={billingCycle}
                labelEn="Upgrade to Federation"
                labelHi="महासंघ में अपग्रेड करें"
                isHindi={isHindi}
                orgId={orgId}
                className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-center text-sm transition-colors mb-8"
              />
            )}

            <div className="space-y-3.5 mb-8">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {isHindi ? 'संस्थान में सब कुछ, और:' : 'Everything in Institution, plus:'}
              </div>
              {(isHindi ? PLAN_TIERS.Federation.featuresHi : PLAN_TIERS.Federation.featuresEn).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="mt-0.5 bg-slate-900 text-white rounded-full p-0.5 shrink-0">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-400 border-t border-slate-100 pt-4">
            {isHindi ? 'समर्पित ऑनबोर्डिंग और SLA शामिल' : 'Dedicated onboarding & custom SLA'}
          </div>
        </div>
      </div>

      {/* White Label Branding Addon */}
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 shrink-0 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 text-slate-700">
              <Building2 size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {isHindi ? WHITE_LABEL_ADDON.nameHi : WHITE_LABEL_ADDON.nameEn}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                {isHindi ? WHITE_LABEL_ADDON.descriptionHi : WHITE_LABEL_ADDON.descriptionEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <div className="text-2xl font-extrabold text-slate-900">₹10,000</div>
              <div className="text-xs text-slate-500">{isHindi ? 'एक बार का शुल्क' : 'One-time fee'}</div>
            </div>

            {!orgId ? (
              <Link
                href={`/${lang}/login`}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl text-center transition-colors"
              >
                {isHindi ? 'लॉग इन करें' : 'Log in to Buy'}
              </Link>
            ) : (
              <CheckoutButton
                amount={10000}
                planName="White-label"
                planPeriod="lifetime"
                labelEn="Buy Addon"
                labelHi="ऐड-ऑन खरीदें"
                isHindi={isHindi}
                orgId={orgId}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl text-center transition-colors"
              />
            )}
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="max-w-5xl mx-auto pt-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            {isHindi ? 'विस्तृत योजना तुलना' : 'Detailed Plan Comparison'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {isHindi
              ? 'प्रत्येक योजना में शामिल सुविधाओं का विस्तृत अवलोकन।'
              : 'A full breakdown of capabilities across all tiers.'}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">{isHindi ? 'सुविधा' : 'Feature'}</th>
                  <th className="py-4 px-4 text-center">{isHindi ? 'समुदाय' : 'Community'}</th>
                  <th className="py-4 px-4 text-center text-indigo-700 bg-indigo-50/50">{isHindi ? 'संस्थान' : 'Institution'}</th>
                  <th className="py-4 px-4 text-center">{isHindi ? 'महासंघ' : 'Federation'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3.5 px-6 font-medium text-slate-900">Member & Volunteer Slots</td>
                  <td className="py-3.5 px-4 text-center font-bold">20 Max</td>
                  <td className="py-3.5 px-4 text-center font-bold text-indigo-700 bg-indigo-50/20">Up to 1,000</td>
                  <td className="py-3.5 px-4 text-center font-bold">1,000+ Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium text-slate-900">Core Democratic Governance (Voting, Tasks, Meetings)</td>
                  <td className="py-3.5 px-4 text-center text-emerald-600 font-bold">✓ Included</td>
                  <td className="py-3.5 px-4 text-center text-emerald-600 font-bold bg-indigo-50/20">✓ Included</td>
                  <td className="py-3.5 px-4 text-center text-emerald-600 font-bold">✓ Included</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium text-slate-900">AI Intelligence (Llama 3.3 70B Minutes & Triage)</td>
                  <td className="py-3.5 px-4 text-center text-slate-400">—</td>
                  <td className="py-3.5 px-4 text-center text-indigo-700 font-bold bg-indigo-50/20">✓ 1,000 req/mo</td>
                  <td className="py-3.5 px-4 text-center text-indigo-700 font-bold">✓ 5,000 req/mo</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium text-slate-900">Multi-Organisation Admin Management</td>
                  <td className="py-3.5 px-4 text-center text-slate-400">1 Org</td>
                  <td className="py-3.5 px-4 text-center font-bold text-indigo-700 bg-indigo-50/20">✓ Multiple Orgs</td>
                  <td className="py-3.5 px-4 text-center font-bold">✓ Coalition Federation</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium text-slate-900">Advanced Analytics & Data Export</td>
                  <td className="py-3.5 px-4 text-center text-slate-400">Standard</td>
                  <td className="py-3.5 px-4 text-center text-emerald-600 font-bold bg-indigo-50/20">✓ Full Export</td>
                  <td className="py-3.5 px-4 text-center text-emerald-600 font-bold">✓ Full Export + API</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium text-slate-900">White-label Branding (Remove Sangathan badge)</td>
                  <td className="py-3.5 px-4 text-center text-slate-400">₹10,000 Addon</td>
                  <td className="py-3.5 px-4 text-center text-slate-400 bg-indigo-50/20">₹10,000 Addon</td>
                  <td className="py-3.5 px-4 text-center text-emerald-600 font-bold">✓ Included Free</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium text-slate-900">Support & SLA</td>
                  <td className="py-3.5 px-4 text-center">Community Support</td>
                  <td className="py-3.5 px-4 text-center font-medium text-indigo-700 bg-indigo-50/20">Priority Email & Chat</td>
                  <td className="py-3.5 px-4 text-center font-bold">24/7 Dedicated Account Manager</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
