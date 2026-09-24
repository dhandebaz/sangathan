'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Users, Calculator, Building2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react'
import { CheckoutButton } from '@/components/pricing/checkout-button'
import {
  PLAN_TIERS,
  WHITE_LABEL_ADDON,
  FREE_MEMBER_ALLOWANCE,
  METERED_PRICE_PER_ACTIVE,
  WHITELABEL_ONE_TIME_PRICE,
  calculateMeteredBill,
} from '@/lib/plans/config'

interface PublicPricingGridProps {
  orgId?: string
  lang: string
  isHindi: boolean
}

const METER_EXAMPLES = [10, 30, 100, 500]

export function PublicPricingGrid({ orgId = '', lang, isHindi }: PublicPricingGridProps) {
  // Interactive meter calculator state (actives slider)
  const [calcActives, setCalcActives] = useState<number>(30)
  const meterCalc = calculateMeteredBill(calcActives)

  return (
    <div className="space-y-16">
      {/* 1. Two cards: Community Free + Metered (no base, no slabs, no annual) */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">

        {/* Tier 1: Community Free */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                {isHindi ? 'जमीनी नागरिक समूह' : 'Grassroots Collectives'}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {isHindi ? '₹0 हमेशा' : '₹0 forever'}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-2xl font-black text-slate-900 mb-1">
                {isHindi ? PLAN_TIERS.Community.nameHi : PLAN_TIERS.Community.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isHindi ? PLAN_TIERS.Community.descriptionHi : PLAN_TIERS.Community.descriptionEn}
              </p>
            </div>

            <div className="mb-6 flex items-end gap-2">
              <span className="text-4xl font-black text-slate-900 font-mono">₹0</span>
              <span className="text-xs text-slate-500 pb-1.5">
                {isHindi ? `· ${FREE_MEMBER_ALLOWANCE} प्रोफाइल तक` : `· up to ${FREE_MEMBER_ALLOWANCE} profiles`}
              </span>
            </div>

            <div className="mb-6">
              <Link
                href={`/${lang}/login?tab=signup&plan=community`}
                className="block w-full py-3.5 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-center text-xs sm:text-sm transition-colors shadow-xs"
              >
                {isHindi ? 'मुफ्त शुरू करें' : 'Start Free'}
              </Link>
            </div>

            {/* Features List */}
            <div className="space-y-2.5 mb-6">
              <div className="text-xs font-bold text-slate-900">
                {isHindi ? 'शामिल लोकतांत्रिक उपकरण:' : 'Included Democratic Capabilities:'}
              </div>
              {(isHindi ? PLAN_TIERS.Community.featuresHi : PLAN_TIERS.Community.featuresEn).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="mt-0.5 bg-emerald-100 text-emerald-700 rounded p-0.5 shrink-0">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <span className="text-xs text-slate-700 leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-4 flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHindi ? '100% संप्रभु • बहुजन क्वीर फाउंडेशन' : '100% Sovereign • Bahujan Queer Foundation'}</span>
          </div>
        </div>

        {/* Tier 2: Metered (no base fee, no slabs, monthly only) */}
        <div className="rounded-xl border-2 border-indigo-600 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono font-bold text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
                {isHindi ? 'बढ़ते संगठन' : 'Growing Organisations'}
              </span>
              <span className="text-xs font-semibold text-indigo-600">
                {isHindi ? 'कोई बेस फीस नहीं' : 'No base fee'}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-2xl font-black text-slate-900 mb-1 flex items-center gap-2">
                {isHindi ? PLAN_TIERS.Metered.nameHi : PLAN_TIERS.Metered.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isHindi ? PLAN_TIERS.Metered.descriptionHi : PLAN_TIERS.Metered.descriptionEn}
              </p>
            </div>

            <div className="mb-6 flex items-end gap-2">
              <span className="text-4xl font-black text-slate-900 font-mono">₹{METERED_PRICE_PER_ACTIVE}</span>
              <span className="text-xs text-slate-500 pb-1.5">
                {isHindi
                  ? `/ सक्रिय साथी / माह (5 मुफ्त के बाद)`
                  : `/ active member / month (after 5 free)`}
              </span>
            </div>

            <div className="mb-6">
              <Link
                href={orgId ? `/${lang}/dashboard/billing` : `/${lang}/login?tab=signup&plan=metered`}
                className="block w-full py-3.5 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-center text-xs sm:text-sm transition-colors mb-6 shadow-xs"
              >
                {isHindi ? 'UPI ऑटोपे जोड़ें और बढ़ें' : 'Add UPI Autopay & Grow'}
              </Link>
            </div>

            {/* Features List */}
            <div className="space-y-2.5 mb-6">
              <div className="text-xs font-bold text-slate-900">
                {isHindi ? 'सामुदायिक पहुंच की सभी सुविधाएं, और:' : 'Everything in Community Access, plus:'}
              </div>
              {(isHindi ? PLAN_TIERS.Metered.featuresHi : PLAN_TIERS.Metered.featuresEn).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="mt-0.5 bg-indigo-100 text-indigo-700 rounded p-0.5 shrink-0">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <span className="text-xs text-slate-800 font-medium leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-indigo-700 border-t border-indigo-100 pt-4 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isHindi ? 'मीटर कभी भी रोको — डेटा रहेगा' : 'Pause the meter anytime — data stays'}</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive meter calculator: (actives − 5) × ₹11 */}
      <div className="max-w-5xl mx-auto rounded-xl border border-slate-200 bg-slate-50/70 p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {isHindi ? 'मासिक बिल कैलकुलेटर' : 'Monthly Bill Calculator'}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isHindi
                ? `पहले ${FREE_MEMBER_ALLOWANCE} सक्रिय साथी हमेशा मुफ्त। उसके बाद हर साथी ₹${METERED_PRICE_PER_ACTIVE}/माह। कोई बेस फीस, कोई स्लैब, कोई वार्षिक बंधन नहीं — माह-अंत गणना।`
                : `First ${FREE_MEMBER_ALLOWANCE} active members always free. Then ₹${METERED_PRICE_PER_ACTIVE}/month per member. No base fee, no slabs, no annual lock-in — counted month-end.`}
            </p>

            {/* Slider & Input */}
            <div className="pt-2 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span>{isHindi ? 'सक्रिय सदस्य संख्या:' : 'Active members:'}</span>
                </label>
                <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1">
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={calcActives}
                    onChange={(e) => setCalcActives(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-right text-sm font-mono font-bold text-slate-900 focus:outline-none"
                  />
                  <span className="text-xs text-slate-500 font-mono">members</span>
                </div>
              </div>

              <input
                type="range"
                min={1}
                max={1000}
                step={1}
                value={Math.min(calcActives, 1000)}
                onChange={(e) => setCalcActives(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />

              <div className="flex flex-wrap gap-2">
                {METER_EXAMPLES.map((n) => {
                  const calc = calculateMeteredBill(n)
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setCalcActives(n)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        calcActives === n
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {n} → ₹{calc.monthlyTotal.toLocaleString('en-IN')}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Real-time Calculation Summary Box */}
          <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>{isHindi ? 'सक्रिय सदस्य:' : 'Active members:'}</span>
                  <span className="font-mono font-semibold text-slate-900">{calcActives}</span>
                </div>
                <div className="flex justify-between">
                  <span>{isHindi ? `मुफ्त (${FREE_MEMBER_ALLOWANCE}):` : `Free (${FREE_MEMBER_ALLOWANCE}):`}</span>
                  <span className="font-mono font-semibold text-slate-900">
                    −{Math.min(calcActives, FREE_MEMBER_ALLOWANCE)}
                  </span>
                </div>
                <div className="flex justify-between text-indigo-900 font-medium">
                  <span>{isHindi ? `बिल योग्य (@ ₹${METERED_PRICE_PER_ACTIVE}):` : `Billable (@ ₹${METERED_PRICE_PER_ACTIVE}):`}</span>
                  <span className="font-mono font-bold">{meterCalc.billableMembers}</span>
                </div>
              </div>

              <div className="border-t border-slate-200 mt-4 pt-3 flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">{isHindi ? 'मासिक बिल:' : 'Monthly bill:'}</div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {meterCalc.monthlyTotal === 0 ? (isHindi ? '₹0 / मुफ्त' : '₹0 / Free') : `₹${meterCalc.monthlyTotal.toLocaleString('en-IN')}`}
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono">per month</div>
              </div>
            </div>

            <Link
              href={orgId ? `/${lang}/dashboard/billing` : `/${lang}/login?tab=signup&plan=metered`}
              className="block w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-center text-xs transition-colors shadow-xs"
            >
              {isHindi ? 'शुरू करें →' : 'Get Started →'}
            </Link>
          </div>

        </div>
      </div>

      {/* 3. Whitelabel one-time addon (₹999 lifetime) */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <Building2 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              {isHindi ? WHITE_LABEL_ADDON.nameHi : WHITE_LABEL_ADDON.nameEn}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
              {isHindi ? WHITE_LABEL_ADDON.descriptionHi : WHITE_LABEL_ADDON.descriptionEn}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">₹{WHITELABEL_ONE_TIME_PRICE}</div>
            <div className="text-[11px] text-slate-500">{isHindi ? 'एकमुश्त, हमेशा के लिए' : 'One-time, forever'}</div>
          </div>

          {orgId ? (
            <CheckoutButton
              amount={WHITELABEL_ONE_TIME_PRICE}
              planName="White-label"
              planPeriod="one_time"
              labelEn="Remove Branding"
              labelHi="ब्रांडिंग हटाएं"
              isHindi={isHindi}
              orgId={orgId}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
            />
          ) : (
            <Link
              href={`/${lang}/login?tab=signup&addon=whitelabel`}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
            >
              {isHindi ? 'शुरू करें' : 'Get Started'}
            </Link>
          )}
        </div>
      </div>

      {/* 4. Feature comparison matrix: Community vs Metered */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-black text-slate-900">
            {isHindi ? 'विस्तृत तुलना' : 'Detailed Comparison'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isHindi
              ? 'फीचर्स पर कोई रोक नहीं — सिर्फ सर-गिनती पर मीटर।'
              : 'No feature gates — only headcount is metered.'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold text-slate-900">{isHindi ? 'क्षमता' : 'Capability'}</th>
                <th className="p-4 font-bold text-slate-900 text-center w-1/3">
                  {isHindi ? 'सामुदायिक (₹0)' : 'Community (₹0)'}
                </th>
                <th className="p-4 font-bold text-indigo-900 text-center w-1/3 bg-indigo-50/40">
                  {isHindi ? 'मीटर (₹11/साथी)' : 'Metered (₹11/member)'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 font-bold text-slate-900">{isHindi ? 'सदस्य प्रोफाइल' : 'Member profiles'}</td>
                <td className="p-4 text-center font-mono text-slate-700">{isHindi ? '5 शामिल' : '5 included'}</td>
                <td className="p-4 text-center font-mono font-bold text-indigo-900 bg-indigo-50/20">
                  {isHindi ? '(सक्रिय − 5) × ₹11/माह' : '(actives − 5) × ₹11/mo'}
                </td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'मतदान, याचिकाएं, पर्चा, रजिस्टर, रसीदें, कार्यक्रम, कार्यवृत्त' : 'Voting, petitions, parcha, registers, receipts, events, minutes'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold">{isHindi ? '✓ शामिल है' : '✓ Included'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/20">{isHindi ? '✓ शामिल है' : '✓ Included'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'सर्वेक्षण व फील्ड-डेटा' : 'Surveys & field-data tools'}</td>
                <td className="p-4 text-center text-slate-700">{isHindi ? '3 सक्रिय + 500 प्रत्युत्तर/माह' : '3 active + 500 responses/mo'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/20">{isHindi ? '50 सक्रिय + 50,000/माह' : '50 active + 50k/mo'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'सार्वजनिक समर्थक, मतदाता, हस्ताक्षरकर्ता' : 'Public supporters, voters & signers'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold">{isHindi ? '✓ उचित उपयोग सहित' : '✓ Fair-use included'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/20">{isHindi ? '✓ उचित उपयोग सहित' : '✓ Fair-use included'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'संगठन AI सुइट' : 'Sangathan AI Suite'}</td>
                <td className="p-4 text-center text-slate-400">-</td>
                <td className="p-4 text-center font-bold text-indigo-900 bg-indigo-50/20">{isHindi ? 'शामिल (कोटा सहित)' : 'Included (quota-bound)'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'प्लगइन्स व इंटीग्रेशन' : 'Plugins & integrations'}</td>
                <td className="p-4 text-center text-slate-400">-</td>
                <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/20">{isHindi ? 'अनलॉक (जल्द आ रहा)' : 'Unlocked (rolling out)'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'एनालिटिक्स व डेटा निर्यात' : 'Analytics & data export'}</td>
                <td className="p-4 text-center text-slate-600">{isHindi ? 'बुनियादी + CSV' : 'Basic + CSV'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/20">{isHindi ? 'उन्नत + पूर्ण निर्यात' : 'Advanced + full export'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'सहायता स्तर' : 'Assistance & Support'}</td>
                <td className="p-4 text-center text-slate-600">{isHindi ? 'सामुदायिक + दस्तावेज़' : 'Community + docs'}</td>
                <td className="p-4 text-center font-bold text-indigo-900 bg-indigo-50/20">{isHindi ? 'प्राथमिकता ईमेल सहायता' : 'Priority email support'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-center">
          <Link
            href={`/${lang}/dashboard/billing`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-700 hover:text-indigo-900 hover:underline"
          >
            {isHindi ? 'अपना लाइव मीटर देखो' : 'See your live meter'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
