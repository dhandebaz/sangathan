'use client'

import { useState } from 'react'
import { Check, Sparkles, Building2, ShieldCheck, HeartHandshake, Coins, Users, Plus } from 'lucide-react'
import { CheckoutButton } from '@/components/pricing/checkout-button'
import { 
  PLAN_TIERS, 
  WHITE_LABEL_ADDON, 
  PlanName, 
  COMMUNITY_CONTRIBUTION_PRESETS,
  BASE_SUSTAINER_MEMBERS,
  ADDITIONAL_MEMBER_PRICE_PER_MONTH,
  calculateSustainerPricing 
} from '@/lib/plans/config'

interface BillingPlanSelectorProps {
  currentPlanName: PlanName
  whitelabelEnabled: boolean
  orgId: string
  lang: string
  isHindi: boolean
}

export function BillingPlanSelector({
  currentPlanName,
  whitelabelEnabled,
  orgId,
  lang,
  isHindi,
}: BillingPlanSelectorProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')
  const [communityAmount, setCommunityAmount] = useState<number>(50)
  const [customCommunityAmount, setCustomCommunityAmount] = useState<string>('')
  const [isCustomCommunity, setIsCustomCommunity] = useState<boolean>(false)

  // Extra Cadres Selector
  const [extraCadreSlots, setExtraCadreSlots] = useState<number>(0)

  const isCurrentCommunity = currentPlanName === 'Community'
  const isCurrentInstitution = currentPlanName === 'Institution'

  const effectiveCommunityAmount = isCustomCommunity
    ? Math.max(1, Number(customCommunityAmount) || 1)
    : communityAmount

  const targetTotalCadres = BASE_SUSTAINER_MEMBERS + extraCadreSlots
  const sustainerCalc = calculateSustainerPricing(targetTotalCadres, billingCycle)

  return (
    <div className="space-y-8">
      {/* Sustainer Frequency Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {isHindi ? 'संरक्षक समर्थन आवधिकता' : 'Sustainer Access Contribution Period'}
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            {isHindi
              ? 'वार्षिक संदर्भ पर 2 माह निःशुल्क (₹2,000 की बचत)। आपका योगदान जमीनी नागरिक समूहों के लिए शून्य सर्वर लागत सुनिश्चित करता है।'
              : 'Save with annual solidarity (2 months free). Institutional contributions keep high-availability servers active for grassroots movements.'}
          </p>
        </div>

        <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isHindi ? 'मासिक (₹1,000/माह)' : 'Monthly (₹1k/mo)'}
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{isHindi ? 'वार्षिक (₹10,000/वर्ष)' : 'Annual (₹10k/yr)'}</span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
        {/* Community Access Card */}
        <div
          className={`rounded-xl border p-6 sm:p-8 flex flex-col justify-between ${
            isCurrentCommunity
              ? 'border-emerald-500 bg-emerald-50/20 shadow-2xs'
              : 'border-slate-200 bg-white shadow-2xs'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xl font-black text-slate-900">
                {isHindi ? PLAN_TIERS.Community.nameHi : PLAN_TIERS.Community.name}
              </h4>
              {isCurrentCommunity && (
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  {isHindi ? 'सक्रिय पहुंच' : 'Current Access'}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              {isHindi ? PLAN_TIERS.Community.descriptionHi : PLAN_TIERS.Community.descriptionEn}
            </p>

            {/* Voluntary Contribution Presets */}
            <div className="mb-6 p-4 rounded-xl bg-white border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-indigo-600" />
                  {isHindi ? 'स्वैच्छिक योगदान:' : 'Voluntary Contribution:'}
                </span>
                <span className="text-[11px] font-mono text-slate-500">{isHindi ? 'वैकल्पिक' : 'Pay what you wish'}</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {COMMUNITY_CONTRIBUTION_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setCommunityAmount(preset)
                      setIsCustomCommunity(false)
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                      !isCustomCommunity && communityAmount === preset
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ₹{preset}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomCommunity(true)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                    isCustomCommunity
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {isHindi ? 'कस्टम' : 'Custom'}
                </button>
              </div>

              {isCustomCommunity && (
                <div className="pt-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      min="1"
                      placeholder={isHindi ? 'राशि दर्ज करें' : 'Enter amount'}
                      value={customCommunityAmount}
                      onChange={(e) => setCustomCommunityAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2.5 mb-6 text-xs text-slate-700">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {isHindi ? 'शामिल लोकतांत्रिक उपकरण:' : 'Included Democratic Tools:'}
              </div>
              {(isHindi ? PLAN_TIERS.Community.featuresHi : PLAN_TIERS.Community.featuresEn).map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <CheckoutButton
            amount={effectiveCommunityAmount}
            planName="Community"
            planPeriod="one_time"
            labelEn={`Contribute ₹${effectiveCommunityAmount} & Access`}
            labelHi={`₹${effectiveCommunityAmount} योगदान दें और पहुंचें`}
            isHindi={isHindi}
            orgId={orgId}
            className="w-full py-3 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold text-center transition-colors shadow-2xs"
          />
        </div>

        {/* Sustainer Access Card with Cadre Expansion Selector */}
        <div
          className={`relative rounded-xl border-2 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xs ${
            isCurrentInstitution
              ? 'border-indigo-600 bg-indigo-50/10'
              : 'border-indigo-600 bg-white'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xl font-black text-slate-900 flex items-center gap-2">
                {isHindi ? PLAN_TIERS.Institution.nameHi : PLAN_TIERS.Institution.name}
              </h4>
              {isCurrentInstitution ? (
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-100 text-indigo-900">
                  {isHindi ? 'सक्रिय संरक्षक' : 'Active Sustainer'}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-100 text-indigo-900">
                  {isHindi ? 'नागरिक संरक्षक' : 'Civic Sustainer'}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              {isHindi ? PLAN_TIERS.Institution.descriptionHi : PLAN_TIERS.Institution.descriptionEn}
            </p>

            {/* Cadre Scale Capacity Addon Selector */}
            <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isHindi ? 'काडर क्षमता का विस्तार:' : 'Expand Cadre Capacity:'}</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-indigo-700">
                  {targetTotalCadres} slots
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {[0, 100, 250, 500].map((extra) => (
                  <button
                    key={extra}
                    type="button"
                    onClick={() => setExtraCadreSlots(extra)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                      extraCadreSlots === extra
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {extra === 0 ? '500 (Base)' : `+${extra}`}
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 font-mono text-center">
                {extraCadreSlots > 0 ? (
                  <span>500 base + {extraCadreSlots} extra slots (@ ₹11/cadre)</span>
                ) : (
                  <span>500 active cadre slots included in base plan</span>
                )}
              </div>
            </div>

            <div className="mb-6 flex items-baseline justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-3xl font-black text-slate-900 font-mono">
                  ₹{sustainerCalc.totalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 font-medium ml-1">
                  /{billingCycle === 'yearly' ? (isHindi ? 'वर्ष' : 'year') : isHindi ? 'माह' : 'month'}
                </span>
              </div>
              {billingCycle === 'yearly' && (
                <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  2 Months Free
                </span>
              )}
            </div>

            <div className="space-y-2.5 mb-6 text-xs text-slate-800">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {isHindi ? 'सामुदायिक पहुंच की सभी सुविधाएं, और:' : 'Everything in Community Access, plus:'}
              </div>
              {(isHindi ? PLAN_TIERS.Institution.featuresHi : PLAN_TIERS.Institution.featuresEn).map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                  <span className="font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <CheckoutButton
            amount={sustainerCalc.totalPrice}
            planName="Institution"
            planPeriod={billingCycle}
            additionalSlots={extraCadreSlots}
            targetMemberCount={targetTotalCadres}
            labelEn={isCurrentInstitution ? `Renew for ${targetTotalCadres} Cadres (₹${sustainerCalc.totalPrice.toLocaleString('en-IN')})` : `Activate ${targetTotalCadres} Cadres (₹${sustainerCalc.totalPrice.toLocaleString('en-IN')})`}
            labelHi={isCurrentInstitution ? `${targetTotalCadres} काडर नवीनीकृत करें (₹${sustainerCalc.totalPrice.toLocaleString('en-IN')})` : `${targetTotalCadres} काडर सक्रिय करें (₹${sustainerCalc.totalPrice.toLocaleString('en-IN')})`}
            isHindi={isHindi}
            orgId={orgId}
            className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold text-center transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* Custom Emblem Addon Card */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-5xl mx-auto shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <Building2 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900">
                {isHindi ? WHITE_LABEL_ADDON.nameHi : WHITE_LABEL_ADDON.nameEn}
              </h4>
              {whitelabelEnabled && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  {isHindi ? 'सक्रिय' : 'Active'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
              {isHindi ? WHITE_LABEL_ADDON.descriptionHi : WHITE_LABEL_ADDON.descriptionEn}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <div className="text-lg font-black text-slate-900 font-mono">₹10,000</div>
            <div className="text-[11px] text-slate-500">{isHindi ? 'एकमुश्त योगदान' : 'One-time contribution'}</div>
          </div>

          {whitelabelEnabled ? (
            <button
              disabled
              className="px-5 py-2.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold cursor-default"
            >
              {isHindi ? 'सक्रिय है' : 'Enabled'}
            </button>
          ) : (
            <CheckoutButton
              amount={10000}
              planName="White-label"
              planPeriod="lifetime"
              labelEn="Enable Custom Emblem"
              labelHi="कस्टम प्रतीक सक्रिय करें"
              isHindi={isHindi}
              orgId={orgId}
              className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center transition-colors shadow-2xs"
            />
          )}
        </div>
      </div>
    </div>
  )
}
