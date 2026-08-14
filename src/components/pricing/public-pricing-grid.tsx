'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Sparkles, Building2, HeartHandshake, ShieldCheck, Coins, Users, ArrowRight, Calculator } from 'lucide-react'
import { CheckoutButton } from '@/components/pricing/checkout-button'
import { 
  PLAN_TIERS, 
  WHITE_LABEL_ADDON, 
  COMMUNITY_CONTRIBUTION_PRESETS,
  BASE_SUSTAINER_MEMBERS,
  ADDITIONAL_MEMBER_PRICE_PER_MONTH,
  calculateSustainerPricing
} from '@/lib/plans/config'

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

  // Interactive Cadre Scale Calculator State
  const [calcCadreCount, setCalcCadreCount] = useState<number>(500)
  const [calcBillingCycle, setCalcBillingCycle] = useState<'monthly' | 'yearly'>('yearly')

  const effectiveCommunityAmount = isCustomSelected
    ? Math.max(1, Number(customCommunityAmount) || 1)
    : selectedCommunityAmount

  const isCommunitySized = calcCadreCount <= 20
  const isBaseSustainer = calcCadreCount > 20 && calcCadreCount <= BASE_SUSTAINER_MEMBERS
  const sustainerCalculation = calculateSustainerPricing(calcCadreCount, calcBillingCycle)

  return (
    <div className="space-y-16">
      {/* 1. Base Access Cards Grid (2-Tier: Community Access & Sustainer Access) */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
        
        {/* Tier 1: Community Access */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                {isHindi ? 'जमीनी नागरिक समूह' : 'Grassroots Collectives'}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {isHindi ? 'स्वैच्छिक योगदान' : 'Voluntary Contribution'}
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

            {/* Voluntary One-Time Contribution Selector */}
            <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-indigo-600" />
                  {isHindi ? 'स्वैच्छिक एकमुश्त योगदान:' : 'Voluntary One-time Contribution:'}
                </span>
                <span className="text-xs text-slate-500 font-mono">{isHindi ? 'वैकल्पिक' : 'Pay what you wish'}</span>
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
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                      !isCustomSelected && selectedCommunityAmount === preset
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomSelected(true)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                    isCustomSelected
                      ? 'bg-slate-900 text-white shadow-xs'
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
                      className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
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
                  className="w-full py-3.5 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-center text-xs sm:text-sm transition-colors shadow-xs"
                />
              </div>
            ) : (
              <Link
                href={`/${lang}/login?tab=signup&plan=community&amount=${effectiveCommunityAmount}`}
                className="block w-full py-3.5 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-center text-xs sm:text-sm transition-colors mb-6 shadow-xs"
              >
                {isHindi ? `₹${effectiveCommunityAmount} योगदान दें और शुरू करें` : `Contribute ₹${effectiveCommunityAmount} & Access`}
              </Link>
            )}

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

        {/* Tier 2: Sustainer Access (500 Cadres Base + ₹11/Cadre Scale) */}
        <div className="rounded-xl border-2 border-indigo-600 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono font-bold text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
                {isHindi ? 'संस्थागत संरक्षक' : 'Institutional Sustainer'}
              </span>
              <span className="text-xs font-semibold text-indigo-600">
                {isHindi ? '500 सदस्य शामिल • स्केलेबल' : '500 Cadres Base • Scalable'}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-2xl font-black text-slate-900 mb-1 flex items-center gap-2">
                {isHindi ? PLAN_TIERS.Institution.nameHi : PLAN_TIERS.Institution.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {isHindi ? PLAN_TIERS.Institution.descriptionHi : PLAN_TIERS.Institution.descriptionEn}
              </p>
            </div>

            {/* Billing Cycle Switcher for Sustainer */}
            <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
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
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                    billingCycle === 'monthly'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div>₹1,000 / {isHindi ? 'माह' : 'month'}</div>
                  <div className="text-[10px] opacity-80 font-normal">{isHindi ? 'मासिक समर्थन' : 'Monthly Support'}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                    billingCycle === 'yearly'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div>₹10,000 / {isHindi ? 'वर्ष' : 'year'}</div>
                  <div className="text-[10px] opacity-80 font-normal">{isHindi ? 'वार्षिक (2 माह रियायती)' : 'Annual (2 Months Free)'}</div>
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
                  className="w-full py-3.5 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-center text-xs sm:text-sm transition-colors shadow-xs"
                />
              </div>
            ) : (
              <Link
                href={`/${lang}/login?tab=signup&plan=institution&cycle=${billingCycle}`}
                className="block w-full py-3.5 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-center text-xs sm:text-sm transition-colors mb-6 shadow-xs"
              >
                {billingCycle === 'yearly'
                  ? (isHindi ? '₹10,000/वर्ष योगदान दें और समर्थन करें' : 'Contribute ₹10,000/yr & Sustain')
                  : (isHindi ? '₹1,000/माह योगदान दें और समर्थन करें' : 'Contribute ₹1,000/mo & Sustain')}
              </Link>
            )}

            {/* Features List */}
            <div className="space-y-2.5 mb-6">
              <div className="text-xs font-bold text-slate-900">
                {isHindi ? 'सामुदायिक पहुंच की सभी सुविधाएं, और:' : 'Everything in Community Access, plus:'}
              </div>
              {(isHindi ? PLAN_TIERS.Institution.featuresHi : PLAN_TIERS.Institution.featuresEn).map((feature, idx) => (
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
            <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isHindi ? 'छोटे नागरिक समूहों के लिए सर्वर लागत को शून्य रखता है' : 'Cross-subsidizes secure servers for grassroots movements'}</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Cadre Scale & Cost Modeling Calculator */}
      <div className="max-w-5xl mx-auto rounded-xl border border-slate-200 bg-slate-50/70 p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {isHindi ? 'काडर आकार व लागत कैलकुलेटर' : 'Cadre Scale & Contribution Calculator'}
              </h3>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isHindi
                ? 'अपने आंदोलनकारी काडर का आकार चुनें। 500 सदस्यों तक बेस ₹1,000/माह में शामिल हैं, और 500 से अधिक सदस्यों के लिए केवल ₹11/सदस्य/माह का पारदर्शी परिचालन शुल्क लगता है।'
                : 'Model your collective’s capacity. 500 active cadres are included in the base ₹1,000/mo Sustainer plan. Additional capacity scales transparently at ₹11/cadre/month.'}
            </p>

            {/* Slider & Input */}
            <div className="pt-2 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span>{isHindi ? 'सक्रिय सदस्य / काडर संख्या:' : 'Active Cadres & Volunteer Slots:'}</span>
                </label>
                <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1">
                  <input
                    type="number"
                    min="1"
                    max="50000"
                    value={calcCadreCount}
                    onChange={(e) => setCalcCadreCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-right text-sm font-mono font-bold text-slate-900 focus:outline-none"
                  />
                  <span className="text-xs text-slate-500 font-mono">cadres</span>
                </div>
              </div>

              <input
                type="range"
                min="10"
                max="3000"
                step="10"
                value={calcCadreCount}
                onChange={(e) => setCalcCadreCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />

              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>20 (Free)</span>
                <span>500 (Base Tier)</span>
                <span>1,000 (Scale)</span>
                <span>2,000</span>
                <span>3,000+</span>
              </div>
            </div>
          </div>

          {/* Real-time Calculation Summary Box */}
          <div className="w-full lg:w-80 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <span className="text-xs font-bold text-slate-700">{isHindi ? 'बिलिंग चक्र:' : 'Billing Cycle:'}</span>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-md text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setCalcBillingCycle('monthly')}
                    className={`px-2 py-0.5 rounded ${calcBillingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcBillingCycle('yearly')}
                    className={`px-2 py-0.5 rounded ${calcBillingCycle === 'yearly' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'}`}
                  >
                    Yearly
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>{isHindi ? 'बेस योजना (500 सदस्य):' : 'Base Sustainer (500 slots):'}</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {isCommunitySized ? '₹0' : calcBillingCycle === 'yearly' ? '₹10,000/yr' : '₹1,000/mo'}
                  </span>
                </div>
                
                {calcCadreCount > BASE_SUSTAINER_MEMBERS && (
                  <div className="flex justify-between text-indigo-900 font-medium">
                    <span>+ {calcCadreCount - BASE_SUSTAINER_MEMBERS} {isHindi ? 'अतिरिक्त सदस्य (@ ₹11):' : 'extra slots (@ ₹11):'}</span>
                    <span className="font-mono font-bold">
                      ₹{sustainerCalculation.extraPrice.toLocaleString('en-IN')}/{calcBillingCycle === 'yearly' ? 'yr' : 'mo'}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 mt-4 pt-3 flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">{isHindi ? 'कुल योगदान:' : 'Total Contribution:'}</div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {isCommunitySized ? '₹0 / Free' : `₹${sustainerCalculation.totalPrice.toLocaleString('en-IN')}`}
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono">
                  {isCommunitySized 
                    ? 'Voluntary' 
                    : calcBillingCycle === 'yearly' 
                      ? `≈ ₹${sustainerCalculation.monthlyEquivalent}/mo` 
                      : 'per month'}
                </div>
              </div>
            </div>

            {/* Direct Activate Button */}
            {isCommunitySized ? (
              <Link
                href={`/${lang}/login?tab=signup&plan=community`}
                className="block w-full py-3 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-center text-xs transition-colors shadow-xs"
              >
                {isHindi ? 'निःशुल्क शुरू करें (20 सदस्य)' : 'Start Free (Up to 20 Cadres)'}
              </Link>
            ) : orgId ? (
              <CheckoutButton
                amount={sustainerCalculation.totalPrice}
                planName="Institution"
                planPeriod={calcBillingCycle}
                additionalSlots={sustainerCalculation.extraMembers}
                targetMemberCount={calcCadreCount}
                labelEn={`Activate ${calcCadreCount} Cadres (₹${sustainerCalculation.totalPrice.toLocaleString('en-IN')})`}
                labelHi={`${calcCadreCount} काडर सक्रिय करें (₹${sustainerCalculation.totalPrice.toLocaleString('en-IN')})`}
                isHindi={isHindi}
                orgId={orgId}
                className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-center text-xs transition-colors shadow-xs"
              />
            ) : (
              <Link
                href={`/${lang}/login?tab=signup&plan=institution&cycle=${calcBillingCycle}&members=${calcCadreCount}`}
                className="block w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-center text-xs transition-colors shadow-xs"
              >
                {isHindi 
                  ? `${calcCadreCount} काडर के साथ शुरू करें →` 
                  : `Activate for ${calcCadreCount} Cadres →`}
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* 3. Custom Emblem Add-on */}
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
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">₹10,000</div>
            <div className="text-[11px] text-slate-500">{isHindi ? 'एकमुश्त संस्थान ऐड-ऑन' : 'One-time Institution Add-on'}</div>
          </div>

          {orgId ? (
            <CheckoutButton
              amount={10000}
              planName="White-label"
              planPeriod="one_time"
              labelEn="Enable Custom Emblem"
              labelHi="कस्टम प्रतीक सक्रिय करें"
              isHindi={isHindi}
              orgId={orgId}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
            />
          ) : (
            <Link
              href={`/${lang}/login?tab=signup&addon=custom-emblem`}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
            >
              {isHindi ? 'शुरू करें' : 'Get Started'}
            </Link>
          )}
        </div>
      </div>

      {/* 4. Comprehensive Feature Comparison Matrix */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-black text-slate-900">
            {isHindi ? 'विस्तृत पहुंच और सुविधा तुलना' : 'Comprehensive Access & Feature Comparison'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isHindi
              ? 'पारदर्शी नागरिक अवसंरचना, बिना किसी छिपी हुई व्यावसायिक शर्तों के।'
              : 'Complete transparency on civic capabilities across all access tiers.'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold text-slate-900">{isHindi ? 'नागरिक क्षमता' : 'Civic Capability'}</th>
                <th className="p-4 font-bold text-slate-900 text-center w-1/3">
                  {isHindi ? 'सामुदायिक पहुंच (Community)' : 'Community Access (Voluntary)'}
                </th>
                <th className="p-4 font-bold text-indigo-900 text-center w-1/3 bg-indigo-50/40">
                  {isHindi ? 'संरक्षक पहुंच (Sustainer)' : 'Sustainer Access (₹1,000/mo Base)'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 font-bold text-slate-900">{isHindi ? 'सदस्य और काडर क्षमता' : 'Active Member & Cadre Slots'}</td>
                <td className="p-4 text-center font-mono text-slate-700">{isHindi ? '20 सक्रिय स्लॉट' : '20 active slots included'}</td>
                <td className="p-4 text-center font-mono font-bold text-indigo-900 bg-indigo-50/20">
                  {isHindi ? '500 स्लॉट शामिल (₹11/अतिरिक्त स्लॉट)' : '500 slots included (+₹11/cadre scale)'}
                </td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'मतदान इंजन और गोपनीय गुप्त मतदान' : 'Voting Engine & Secret Ballots'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold">{isHindi ? '✓ शामिल है' : '✓ Included'}</td>
                <td className="p-4 text-center text-emerald-600 font-bold bg-indigo-50/20">{isHindi ? '✓ शामिल है' : '✓ Included'}</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700">{isHindi ? 'महासंघ और गठबंधन उपकरण (संयुक्त मोर्चा)' : 'Coalition & Federation Tools (Joint Front)'}</td>
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
                <td className="p-4 text-center font-bold text-indigo-900 bg-indigo-50/20">{isHindi ? 'शामिल (कार्यवृत्त, अनुदान, ट्राइएज)' : 'Included (Minutes, Grants, Triage)'}</td>
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
