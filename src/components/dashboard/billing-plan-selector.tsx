'use client'

import { Check, Building2 } from 'lucide-react'
import { CheckoutButton } from '@/components/pricing/checkout-button'
import { SubscribeButton } from '@/components/dashboard/subscribe-button'
import {
  PLAN_TIERS,
  WHITE_LABEL_ADDON,
  PlanName,
  FREE_MEMBER_ALLOWANCE,
  METERED_PRICE_PER_ACTIVE,
  WHITELABEL_ONE_TIME_PRICE,
  calculateMeteredBill,
} from '@/lib/plans/config'

interface BillingPlanSelectorProps {
  currentPlanName: PlanName
  whitelabelEnabled: boolean
  orgId: string
  lang: string
  isHindi: boolean
}

const METER_PREVIEW_SIZES = [10, 30, 100]

export function BillingPlanSelector({
  currentPlanName,
  whitelabelEnabled,
  orgId,
  lang,
  isHindi,
}: BillingPlanSelectorProps) {
  const isCurrentCommunity = currentPlanName === 'Community'
  const isCurrentMetered = currentPlanName === 'Metered'
  const isLegacyInstitution = currentPlanName === 'Institution'

  return (
    <div className="space-y-8">
      {/* Legacy grandfathered banner (existing Sustainer orgs only) */}
      {isLegacyInstitution && (
        <div className="p-5 rounded-sm bg-indigo-50 border border-indigo-200">
          <h3 className="text-sm font-bold text-indigo-900">
            {isHindi ? 'संरक्षक पहुंच (पुरानी सुरक्षित श्रेणी)' : 'Sustainer Access (grandfathered)'}
          </h3>
          <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
            {isHindi
              ? 'आपकी ₹1,000/माह फ्लट श्रेणी 500 सदस्यों सहित जारी रहेगी जब तक सदस्यता निरंतर है। मीटर बिलिंग पर जाने के लिए support@sangathan.space पर लिखें।'
              : 'Your ₹1,000/mo flat tier with 500 included continues while subscribed. Email support@sangathan.space to move to metered billing.'}
          </p>
        </div>
      )}

      {/* Plan Cards Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
        {/* Community Free Card */}
        <div
          className={`rounded-sm border p-6 sm:p-8 flex flex-col justify-between ${
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
                  {isHindi ? 'वर्तमान' : 'Current'}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              {isHindi ? PLAN_TIERS.Community.descriptionHi : PLAN_TIERS.Community.descriptionEn}
            </p>

            <div className="mb-6 flex items-end gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono">₹0</span>
              <span className="text-xs text-slate-500 pb-1">
                {isHindi ? 'हमेशा · 5 प्रोफाइल तक' : 'forever · up to 5 profiles'}
              </span>
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

          <a
            href={`/${lang}/pricing`}
            className="block w-full py-3 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold text-center transition-colors"
          >
            {isHindi ? 'मूल्य निर्धारण देखो' : 'See full pricing'}
          </a>
        </div>

        {/* Metered Card */}
        <div
          className={`relative rounded-sm border-2 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-2xs ${
            isCurrentMetered
              ? 'border-indigo-600 bg-indigo-50/10'
              : 'border-indigo-600 bg-white'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xl font-black text-slate-900">
                {isHindi ? PLAN_TIERS.Metered.nameHi : PLAN_TIERS.Metered.name}
              </h4>
              {isCurrentMetered ? (
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-100 text-indigo-900">
                  {isHindi ? 'सक्रिय मीटर' : 'Meter Active'}
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-indigo-100 text-indigo-900">
                  {isHindi ? 'कोई बेस फीस नहीं' : 'No base fee'}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              {isHindi ? PLAN_TIERS.Metered.descriptionHi : PLAN_TIERS.Metered.descriptionEn}
            </p>

            <div className="mb-5 p-4 rounded-sm bg-slate-50 border border-slate-200 space-y-2">
              {METER_PREVIEW_SIZES.map((n) => {
                const calc = calculateMeteredBill(n)
                return (
                  <div key={n} className="flex justify-between text-xs text-slate-700">
                    <span className="font-mono">{n} {isHindi ? 'सक्रिय' : 'actives'}</span>
                    <span className="font-mono font-bold text-slate-900">
                      {calc.monthlyTotal === 0 ? (isHindi ? '₹0' : '₹0') : `₹${calc.monthlyTotal.toLocaleString('en-IN')}/mo`}
                    </span>
                  </div>
                )
              })}
              <p className="text-[11px] text-slate-500 pt-1">
                {isHindi
                  ? `पहले ${FREE_MEMBER_ALLOWANCE} हमेशा मुफ्त · माह-अंत गणना · कभी भी रोको`
                  : `First ${FREE_MEMBER_ALLOWANCE} always free · month-end count · pause anytime`}
              </p>
            </div>

            <div className="space-y-2.5 mb-6 text-xs text-slate-800">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {isHindi ? 'सामुदायिक पहुंच की सभी सुविधाएं, और:' : 'Everything in Community Access, plus:'}
              </div>
              {(isHindi ? PLAN_TIERS.Metered.featuresHi : PLAN_TIERS.Metered.featuresEn).map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Check className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                  <span className="font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {isCurrentMetered ? (
            <a
              href={`/${lang}/dashboard/billing`}
              className="block w-full py-3 px-4 rounded-lg bg-indigo-600 text-white text-xs sm:text-sm font-bold text-center"
            >
              {isHindi ? 'लाइव मीटर देखो' : 'View live meter'}
            </a>
          ) : (
            <SubscribeButton orgId={orgId} lang={lang} isHindi={isHindi} />
          )}
        </div>
      </div>

      {/* Whitelabel one-time Card (₹999 lifetime) */}
      <div className="rounded-sm border border-slate-200 bg-slate-50/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-5xl mx-auto shadow-2xs">
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
            <div className="text-lg font-black text-slate-900 font-mono">₹{WHITELABEL_ONE_TIME_PRICE}</div>
            <div className="text-[11px] text-slate-500">{isHindi ? 'एकमुश्त, हमेशा' : 'One-time, forever'}</div>
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
              amount={WHITELABEL_ONE_TIME_PRICE}
              planName="White-label"
              planPeriod="one_time"
              labelEn="Remove Branding"
              labelHi="ब्रांडिंग हटाएं"
              isHindi={isHindi}
              orgId={orgId}
              className="px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-white text-xs font-bold text-center transition-colors shadow-2xs"
            />
          )}
        </div>
      </div>

      <p className="text-center text-[11px] text-slate-400 font-mono">
        {isHindi
          ? `मासिक बिलिंग ही · कोई वार्षिक बंधन नहीं · प्रति सक्रिय साथी ₹${METERED_PRICE_PER_ACTIVE}`
          : `Monthly billing only · no annual lock-in · ₹${METERED_PRICE_PER_ACTIVE} per active member`}
      </p>
    </div>
  )
}
