'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Sparkles, Building2, HeartHandshake, ShieldCheck } from 'lucide-react'
import { CheckoutButton } from '@/components/pricing/checkout-button'
import { PLAN_TIERS, WHITE_LABEL_ADDON } from '@/lib/plans/config'

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
            {isHindi ? 'मासिक समर्थन' : 'Monthly Support'}
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
            <span>{isHindi ? 'वार्षिक समर्थन' : 'Annual Patronage'}</span>
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                billingCycle === 'yearly' ? 'bg-indigo-700 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isHindi ? '2 माह मुफ़्त' : '2 Months Free'}
            </span>
          </button>
        </div>
        <p className="text-xs text-slate-500">
          {isHindi
            ? 'वार्षिक योजना पर ₹2,000 की बचत करें। आपका योगदान जमीनी आंदोलनों के लिए सर्वर लागत को शून्य रखता है।'
            : 'Save ₹2,000 with annual billing. Institutional patronage keeps the platform free forever for grassroots movements.'}
        </p>
      </div>

      {/* Pricing Cards Grid (2-Tier) */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
              <span className="text-slate-500 font-medium ml-1">/{isHindi ? 'हमेशा के लिए' : 'forever'}</span>
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
            {isHindi ? 'कोई क्रेडिट कार्ड आवश्यक नहीं • 100% संप्रभु' : 'No credit card required • 100% sovereign'}
          </div>
        </div>

        {/* Institution Tier */}
        <div className="relative rounded-3xl border-2 border-indigo-600 bg-white p-8 shadow-xl flex flex-col justify-between">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white uppercase tracking-wider shadow-sm flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5" />
            {isHindi ? 'एकजुटता लागत-साझाकरण' : 'Solidarity Patronage'}
          </div>

          <div>
            <div className="mb-6 mt-2">
              <h3 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                {isHindi ? PLAN_TIERS.Institution.nameHi : PLAN_TIERS.Institution.name}
                <Sparkles className="w-5 h-5 text-indigo-500" />
              </h3>
              <p className="text-sm text-slate-500">
                {isHindi ? PLAN_TIERS.Institution.descriptionHi : PLAN_TIERS.Institution.descriptionEn}
              </p>
            </div>

            <div className="mb-6">
              <span className="text-5xl font-extrabold text-slate-900">
                ₹{billingCycle === 'yearly' ? '10,000' : '1,000'}
              </span>
              <span className="text-slate-500 font-medium ml-1">
                /{billingCycle === 'yearly' ? (isHindi ? 'वर्ष' : 'year') : isHindi ? 'माह' : 'month'}
              </span>
            </div>

            {orgId ? (
              <div className="mb-8">
                <CheckoutButton
                  amount={billingCycle === 'yearly' ? 10000 : 1000}
                  planName="Institution"
                  planPeriod={billingCycle}
                  labelEn="Upgrade to Institution"
                  labelHi="संस्थान योजना में अपग्रेड करें"
                  isHindi={isHindi}
                  orgId={orgId}
                  className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center text-sm transition-colors shadow-sm"
                />
              </div>
            ) : (
              <Link
                href={`/${lang}/login?tab=signup`}
                className="block w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center text-sm transition-colors mb-8 shadow-sm"
              >
                {isHindi ? 'संस्थान शुरू करें' : 'Get Started'}
              </Link>
            )}

            <div className="space-y-3.5 mb-8">
              <div className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                {isHindi ? 'समुदाय की सभी सुविधाएं, और:' : 'Everything in Community, plus:'}
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

          <div className="text-xs text-indigo-600 border-t border-slate-100 pt-4 font-medium">
            {isHindi ? '2 माह मुफ़्त वार्षिक बिलिंग पर' : '2 months free with annual billing'}
          </div>
        </div>
      </div>

      {/* White-Label Add-on */}
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-sm">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">
              {isHindi ? WHITE_LABEL_ADDON.nameHi : WHITE_LABEL_ADDON.nameEn}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              {isHindi ? WHITE_LABEL_ADDON.descriptionHi : WHITE_LABEL_ADDON.descriptionEn}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <div className="text-2xl font-extrabold text-slate-900">₹10,000</div>
            <div className="text-xs text-slate-500">{isHindi ? 'एक बार का शुल्क' : 'One-time fee'}</div>
          </div>

          {orgId ? (
            <CheckoutButton
              amount={10000}
              planName="White-label"
              planPeriod="lifetime"
              labelEn="Unlock Branding"
              labelHi="ब्रांडिंग अनलॉक करें"
              isHindi={isHindi}
              orgId={orgId}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors"
            />
          ) : (
            <Link
              href={`/${lang}/login?tab=signup`}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors"
            >
              {isHindi ? 'साइन अप करें' : 'Sign Up'}
            </Link>
          )}
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-900">
            {isHindi ? 'विस्तृत तुलना तालिका' : 'Detailed Plan Comparison'}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {isHindi
              ? 'पारदर्शी संरचना, बिना किसी छिपी हुई शर्तों के।'
              : 'Complete transparency on capabilities across tiers.'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold text-slate-900">{isHindi ? 'सुविधा' : 'Feature'}</th>
                <th className="p-4 font-bold text-slate-900 text-center w-1/3">
                  {isHindi ? 'समुदाय (₹0)' : 'Community (₹0)'}
                </th>
                <th className="p-4 font-bold text-indigo-900 text-center w-1/3 bg-indigo-50/50">
                  {isHindi ? 'संस्थान (₹1,000)' : 'Institution (₹1,000)'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'सदस्य क्षमता' : 'Member Capacity'}</td>
                <td className="p-4 text-center text-slate-600">Up to 20 users</td>
                <td className="p-4 text-center font-bold text-indigo-900 bg-indigo-50/20">Unlimited users</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'मतदान और चुनाव इंजन' : 'Voting & Anonymous Elections'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/20">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'महासंघ और गठबंधन उपकरण' : 'Coalition & Federation Tools'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/20">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'बैठकें, कार्य और उप-समूह' : 'Meetings, Tasks & Subgroups'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/20">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'सार्वजनिक याचिकाएं और सदस्य बैज' : 'Public Petitions & Badges'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold">✓ Included</td>
                <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/20">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'स्मार्ट AI बुद्धिमत्ता (Llama 3.3 70B)' : 'AI Intelligence Suite (Llama 3.3)'}</td>
                <td className="p-4 text-center text-slate-400">—</td>
                <td className="p-4 text-center font-bold text-indigo-900 bg-indigo-50/20">1,000 requests/mo</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'उन्नत एनालिटिक्स और डेटा निर्यात' : 'Advanced Analytics & Data Export'}</td>
                <td className="p-4 text-center text-slate-400">—</td>
                <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/20">✓ Included</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'सहायता स्तर' : 'Support SLA'}</td>
                <td className="p-4 text-center text-slate-600">Community Support</td>
                <td className="p-4 text-center font-bold text-indigo-900 bg-indigo-50/20">Priority Email & Chat</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
