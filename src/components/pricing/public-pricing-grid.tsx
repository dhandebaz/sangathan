'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Sparkles, Building2, HeartHandshake, ShieldCheck, Coins } from 'lucide-react'
import { CheckoutButton } from '@/components/pricing/checkout-button'
import { PLAN_TIERS, WHITE_LABEL_ADDON, COMMUNITY_CONTRIBUTION_PRESETS } from '@/lib/plans/config'

interface PublicPricingGridProps {
  orgId?: string
  lang: string
  isHindi: boolean
}

export function PublicPricingGrid({ orgId = '', lang, isHindi }: PublicPricingGridProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')
  const [selectedCommunityAmount, setSelectedCommunityAmount] = useState<number>(50)
  const [customCommunityAmount, setCustomCommunityAmount] = useState<string>('')
  const [isCustomSelected, setIsCustomSelected] = useState<boolean>(false)

  const effectiveCommunityAmount = isCustomSelected
    ? Math.max(1, Number(customCommunityAmount) || 1)
    : selectedCommunityAmount

  return (
    <div className="space-y-16">
      {/* Access Cards Grid (2-Tier: Community Access & Sustainer Access) */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
        
        {/* Tier 1: Community Access */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                {isHindi ? 'जमीनी समूह और नागरिक आंदोलन' : 'Grassroots & Civic Collectives'}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                {isHindi ? PLAN_TIERS.Community.nameHi : PLAN_TIERS.Community.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {isHindi ? PLAN_TIERS.Community.descriptionHi : PLAN_TIERS.Community.descriptionEn}
              </p>
            </div>

            {/* Voluntary One-Time Contribution Selector */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-indigo-600" />
                  {isHindi ? 'स्वैच्छिक एकमुश्त योगदान:' : 'Voluntary One-time Contribution:'}
                </span>
                <span className="text-xs text-slate-500">{isHindi ? 'वैकल्पिक' : 'Pay what you wish'}</span>
              </div>

              {/* Preset Chips */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {COMMUNITY_CONTRIBUTION_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setSelectedCommunityAmount(preset)
                      setIsCustomSelected(false)
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                      !isCustomSelected && selectedCommunityAmount === preset
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomSelected(true)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    isCustomSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isHindi ? 'कस्टम' : 'Custom'}
                </button>
              </div>

              {isCustomSelected && (
                <div className="pt-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      min="1"
                      placeholder={isHindi ? 'राशि दर्ज करें (जैसे ₹250)' : 'Enter amount (e.g. 250)'}
                      value={customCommunityAmount}
                      onChange={(e) => setCustomCommunityAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            {orgId ? (
              <div className="mb-6">
                <CheckoutButton
                  amount={effectiveCommunityAmount}
                  planName="Community"
                  planPeriod="one_time"
                  labelEn={`Contribute ₹${effectiveCommunityAmount} & Access`}
                  labelHi={`₹${effectiveCommunityAmount} योगदान दें और पहुंचें`}
                  isHindi={isHindi}
                  orgId={orgId}
                  className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-center text-xs sm:text-sm transition-colors shadow-sm"
                />
              </div>
            ) : (
              <Link
                href={`/${lang}/login?tab=signup`}
                className="block w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-center text-xs sm:text-sm transition-colors mb-6 shadow-sm"
              >
                {isHindi ? 'योगदान और पहुंच शुरू करें' : 'Contribute & Access Workspace'}
              </Link>
            )}

            {/* Features List */}
            <div className="space-y-2.5 mb-6">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {isHindi ? 'शामिल लोकतांत्रिक उपकरण:' : 'Included Democratic Capabilities:'}
              </div>
              {(isHindi ? PLAN_TIERS.Community.featuresHi : PLAN_TIERS.Community.featuresEn).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="mt-0.5 bg-emerald-100 text-emerald-600 rounded-full p-0.5 shrink-0">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <span className="text-xs text-slate-700 leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-4 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHindi ? '100% संप्रभु • बहुजन क्वीर फाउंडेशन' : '100% sovereign • Bahujan Queer Foundation'}</span>
          </div>
        </div>

        {/* Tier 2: Sustainer Access */}
        <div className="relative rounded-3xl border-2 border-indigo-600 bg-white p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold bg-indigo-600 text-white uppercase tracking-wider shadow-sm flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5" />
            {isHindi ? 'नागरिक अवसंरचना संरक्षक' : 'Civic Infrastructure Sustainer'}
          </div>

          <div>
            <div className="mb-4 mt-2">
              <h3 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                {isHindi ? PLAN_TIERS.Institution.nameHi : PLAN_TIERS.Institution.name}
                <Sparkles className="w-5 h-5 text-indigo-500" />
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {isHindi ? PLAN_TIERS.Institution.descriptionHi : PLAN_TIERS.Institution.descriptionEn}
              </p>
            </div>

            {/* Billing Cycle Switcher for Sustainer */}
            <div className="mb-6 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950">
                  {isHindi ? 'सुझाया गया संदर्भ योगदान:' : 'Suggested Contribution:'}
                </span>
                <span className="text-xs text-indigo-700 font-semibold">
                  {isHindi ? 'क्षमता अनुसार योगदान' : 'Pay what you can'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                    billingCycle === 'monthly'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-indigo-200 text-indigo-900 hover:bg-indigo-50'
                  }`}
                >
                  <div>₹1,000 / {isHindi ? 'माह' : 'month'}</div>
                  <div className="text-[10px] opacity-80 font-normal">{isHindi ? 'मासिक समर्थन' : 'Monthly Support'}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                    billingCycle === 'yearly'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-indigo-200 text-indigo-900 hover:bg-indigo-50'
                  }`}
                >
                  <div>₹10,000 / {isHindi ? 'वर्ष' : 'year'}</div>
                  <div className="text-[10px] opacity-80 font-normal">{isHindi ? 'वार्षिक (2 माह रियायती)' : 'Annual (Subsidized)'}</div>
                </button>
              </div>
            </div>

            {/* Action Button */}
            {orgId ? (
              <div className="mb-6">
                <CheckoutButton
                  amount={billingCycle === 'yearly' ? 10000 : 1000}
                  planName="Institution"
                  planPeriod={billingCycle}
                  labelEn={billingCycle === 'yearly' ? 'Contribute ₹10,000/yr & Sustain' : 'Contribute ₹1,000/mo & Sustain'}
                  labelHi={billingCycle === 'yearly' ? '₹10,000/वर्ष योगदान दें और समर्थन करें' : '₹1,000/माह योगदान दें और समर्थन करें'}
                  isHindi={isHindi}
                  orgId={orgId}
                  className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center text-xs sm:text-sm transition-colors shadow-sm"
                />
              </div>
            ) : (
              <Link
                href={`/${lang}/login?tab=signup`}
                className="block w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center text-xs sm:text-sm transition-colors mb-6 shadow-sm"
              >
                {isHindi ? 'संरक्षक पहुंच शुरू करें' : 'Support & Access Workspace'}
              </Link>
            )}

            {/* Features List */}
            <div className="space-y-2.5 mb-6">
              <div className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                {isHindi ? 'सामुदायिक पहुंच की सभी सुविधाएं, और:' : 'Everything in Community Access, plus:'}
              </div>
              {(isHindi ? PLAN_TIERS.Institution.featuresHi : PLAN_TIERS.Institution.featuresEn).map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="mt-0.5 bg-indigo-100 text-indigo-600 rounded-full p-0.5 shrink-0">
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <span className="text-xs text-slate-800 font-medium leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-indigo-700 border-t border-indigo-100 pt-4 font-medium flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isHindi ? 'छोटे नागरिक समूहों के लिए सर्वर लागत को शून्य रखता है' : 'Cross-subsidizes secure servers for grassroots collectives'}</span>
          </div>
        </div>
      </div>

      {/* Custom Emblem Add-on */}
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-sm">
            <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              {isHindi ? WHITE_LABEL_ADDON.nameHi : WHITE_LABEL_ADDON.nameEn}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              {isHindi ? WHITE_LABEL_ADDON.descriptionHi : WHITE_LABEL_ADDON.descriptionEn}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0 w-full md:w-auto justify-between md:justify-end">
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900">₹10,000</div>
            <div className="text-[11px] text-slate-500">{isHindi ? 'एकमुश्त योगदान' : 'One-time contribution'}</div>
          </div>

          {orgId ? (
            <CheckoutButton
              amount={10000}
              planName="White-label"
              planPeriod="lifetime"
              labelEn="Enable Custom Emblem"
              labelHi="कस्टम प्रतीक सक्रिय करें"
              isHindi={isHindi}
              orgId={orgId}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors"
            />
          ) : (
            <Link
              href={`/${lang}/login?tab=signup`}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors"
            >
              {isHindi ? 'शुरू करें' : 'Get Started'}
            </Link>
          )}
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isHindi ? 'विस्तृत पहुंच और सुविधा तुलना' : 'Comprehensive Access & Feature Comparison'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isHindi
              ? 'पारदर्शी नागरिक अवसंरचना, बिना किसी छिपी हुई व्यावसायिक शर्तों के।'
              : 'Complete transparency on civic capabilities across all access tiers.'}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold text-slate-900">{isHindi ? 'नागरिक क्षमता' : 'Civic Capability'}</th>
                <th className="p-4 font-bold text-slate-900 text-center w-1/3">
                  {isHindi ? 'सामुदायिक पहुंच (Community)' : 'Community Access (Voluntary)'}
                </th>
                <th className="p-4 font-bold text-indigo-900 text-center w-1/3 bg-indigo-50/50">
                  {isHindi ? 'संरक्षक पहुंच (Sustainer)' : 'Sustainer Access (Suggested ₹1k)'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'सदस्य और काडर क्षमता' : 'Active Member & Volunteer Slots'}</td>
                <td className="p-4 text-center text-slate-600">{isHindi ? '20 सक्रिय स्लॉट' : 'Up to 20 active slots'}</td>
                <td className="p-4 text-center font-bold text-indigo-900 bg-indigo-50/20">{isHindi ? 'असीमित क्षमता' : 'Unlimited capacity'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'मतदान इंजन और गोपनीय गुप्त मतदान' : 'Voting Engine & Secret Ballots'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold">{isHindi ? '✓ शामिल है' : '✓ Included'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/20">{isHindi ? '✓ शामिल है' : '✓ Included'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'महासंघ और गठबंधन उपकरण (संयुक्त मोर्चा)' : 'Coalition & Federation Tools (संयुक्त मोर्चा)'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold">{isHindi ? '✓ शामिल है' : '✓ Included'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/20">{isHindi ? '✓ शामिल है' : '✓ Included'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'बैठकें, कार्य और उप-समूह मॉड्यूल' : 'Meetings, Tasks & Subgroup Desks'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold">{isHindi ? '✓ शामिल है' : '✓ Included'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/20">{isHindi ? '✓ शामिल है' : '✓ Included'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'सार्वजनिक याचिकाएं और सत्यापित बैज' : 'Public Petitions & Verified Badges'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold">{isHindi ? '✓ शामिल है' : '✓ Included'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/20">{isHindi ? '✓ शामिल है' : '✓ Included'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'संगठन AI बुद्धिमत्ता सुइट' : 'Sangathan AI Intelligence Suite'}</td>
                <td className="p-4 text-center text-slate-400">-</td>
                <td className="p-4 text-center font-bold text-indigo-900 bg-indigo-50/20">{isHindi ? 'शामिल (कार्यवृत्त, अनुदान, विश्लेषण)' : 'Included (Minutes, Grants, Triage)'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'बहु-शाखा / बहु-सामूहिक प्रबंधन' : 'Multi-Chapter / Federation Management'}</td>
                <td className="p-4 text-center text-slate-400">-</td>
                <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/20">{isHindi ? '✓ शामिल है' : '✓ Included'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'उन्नत एनालिटिक्स और डेटा संप्रभुता निर्यात' : 'Advanced Analytics & Data Sovereign Export'}</td>
                <td className="p-4 text-center text-slate-400">-</td>
                <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/20">{isHindi ? '✓ शामिल है' : '✓ Included'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'सहायता स्तर' : 'Assistance & Support'}</td>
                <td className="p-4 text-center text-slate-600">{isHindi ? 'प्रत्यक्ष सामुदायिक सहकर्मी सहायता' : 'Community Peer Support'}</td>
                <td className="p-4 text-center font-bold text-indigo-900 bg-indigo-50/20">{isHindi ? 'प्राथमिकता संगठनात्मक सहायता' : 'Priority Onboarding & Email Support'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
