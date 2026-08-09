'use client'

import { useState } from 'react'
import { Check, Sparkles, Building2, ShieldCheck, Zap } from 'lucide-react'
import { CheckoutButton } from '@/components/pricing/checkout-button'
import { PLAN_TIERS, WHITE_LABEL_ADDON, PlanName } from '@/lib/plans/limits'

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

  const isCurrentCommunity = currentPlanName === 'Community'
  const isCurrentInstitution = currentPlanName === 'Institution'
  const isCurrentFederation = currentPlanName === 'Federation'

  return (
    <div className="space-y-8">
      {/* Billing Cycle Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {isHindi ? 'बिलिंग चक्र चुनें' : 'Select Billing Frequency'}
          </h3>
          <p className="text-xs text-slate-500">
            {isHindi
              ? 'वार्षिक बिलिंग पर 2 महीने मुफ्त प्राप्त करें (₹2,000 की बचत)'
              : 'Get 2 months free with annual billing (Save ₹2,000 on Institution)'}
          </p>
        </div>

        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isHindi ? 'मासिक' : 'Monthly'}
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{isHindi ? 'वार्षिक (2 माह मुफ़्त)' : 'Annual (2 Months Free)'}</span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Community Card */}
        <div
          className={`rounded-2xl border p-6 flex flex-col justify-between ${
            isCurrentCommunity
              ? 'border-emerald-500 bg-emerald-50/20 shadow-sm'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-slate-900">
                {isHindi ? PLAN_TIERS.Community.nameHi : PLAN_TIERS.Community.name}
              </h4>
              {isCurrentCommunity && (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  {isHindi ? 'सक्रिय योजना' : 'Current Plan'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-4">
              {isHindi ? PLAN_TIERS.Community.descriptionHi : PLAN_TIERS.Community.descriptionEn}
            </p>
            <div className="mb-6">
              <span className="text-3xl font-extrabold text-slate-900">₹0</span>
              <span className="text-xs text-slate-500 font-medium">/{isHindi ? 'हमेशा' : 'forever'}</span>
            </div>

            <div className="space-y-2.5 mb-6 text-xs text-slate-700">
              {(isHindi ? PLAN_TIERS.Community.featuresHi : PLAN_TIERS.Community.featuresEn).map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            disabled
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold text-center cursor-not-allowed"
          >
            {isCurrentCommunity ? (isHindi ? 'सक्रिय' : 'Active Plan') : isHindi ? 'शामिल' : 'Free Tier'}
          </button>
        </div>

        {/* Institution Card */}
        <div
          className={`relative rounded-2xl border-2 p-6 flex flex-col justify-between overflow-hidden ${
            isCurrentInstitution
              ? 'border-indigo-600 bg-indigo-50/10 shadow-md'
              : 'border-indigo-500 bg-white shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                {isHindi ? PLAN_TIERS.Institution.nameHi : PLAN_TIERS.Institution.name}
                <Sparkles className="text-indigo-500 w-4 h-4" />
              </h4>
              {isCurrentInstitution && (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-100 text-indigo-800">
                  {isHindi ? 'सक्रिय योजना' : 'Current Plan'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-4">
              {isHindi ? PLAN_TIERS.Institution.descriptionHi : PLAN_TIERS.Institution.descriptionEn}
            </p>
            <div className="mb-6">
              <span className="text-3xl font-extrabold text-slate-900">
                ₹{billingCycle === 'yearly' ? '10,000' : '1,000'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                /{billingCycle === 'yearly' ? (isHindi ? 'वर्ष' : 'year') : isHindi ? 'माह' : 'month'}
              </span>
            </div>

            <div className="space-y-2.5 mb-6 text-xs text-slate-700">
              {(isHindi ? PLAN_TIERS.Institution.featuresHi : PLAN_TIERS.Institution.featuresEn).map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                  <span className="font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <CheckoutButton
            amount={billingCycle === 'yearly' ? 10000 : 1000}
            planName="Institution"
            planPeriod={billingCycle}
            labelEn={isCurrentInstitution ? 'Renew / Extend Institution' : 'Upgrade to Institution'}
            labelHi={isCurrentInstitution ? 'नवीनीकृत करें' : 'संस्थान में अपग्रेड करें'}
            isHindi={isHindi}
            orgId={orgId}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold text-center transition-colors shadow-sm"
          />
        </div>

        {/* Federation / Enterprise Card */}
        <div
          className={`rounded-2xl border p-6 flex flex-col justify-between ${
            isCurrentFederation
              ? 'border-indigo-600 bg-indigo-50/20 shadow-md'
              : 'border-slate-200 bg-white'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                {isHindi ? PLAN_TIERS.Federation.nameHi : PLAN_TIERS.Federation.name}
                <Zap className="text-amber-500 w-4 h-4" />
              </h4>
              {isCurrentFederation && (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-100 text-indigo-800">
                  {isHindi ? 'सक्रिय योजना' : 'Current Plan'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mb-4">
              {isHindi ? PLAN_TIERS.Federation.descriptionHi : PLAN_TIERS.Federation.descriptionEn}
            </p>
            <div className="mb-6">
              <span className="text-3xl font-extrabold text-slate-900">
                ₹{billingCycle === 'yearly' ? '49,999' : '4,999'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                /{billingCycle === 'yearly' ? (isHindi ? 'वर्ष' : 'year') : isHindi ? 'माह' : 'month'}
              </span>
            </div>

            <div className="space-y-2.5 mb-6 text-xs text-slate-700">
              {(isHindi ? PLAN_TIERS.Federation.featuresHi : PLAN_TIERS.Federation.featuresEn).map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-slate-900 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <CheckoutButton
            amount={billingCycle === 'yearly' ? 49999 : 4999}
            planName="Federation"
            planPeriod={billingCycle}
            labelEn={isCurrentFederation ? 'Renew Federation' : 'Upgrade to Federation'}
            labelHi={isCurrentFederation ? 'नवीनीकृत करें' : 'महासंघ में अपग्रेड करें'}
            isHindi={isHindi}
            orgId={orgId}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* White Label Addon Card */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                {isHindi ? WHITE_LABEL_ADDON.nameHi : WHITE_LABEL_ADDON.nameEn}
              </h4>
              {whitelabelEnabled && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {isHindi ? 'सक्रिय' : 'Unlocked'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
              {isHindi ? WHITE_LABEL_ADDON.descriptionHi : WHITE_LABEL_ADDON.descriptionEn}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right">
            <div className="text-base font-extrabold text-slate-900">₹10,000</div>
            <div className="text-[10px] text-slate-500">{isHindi ? 'एक बार का शुल्क' : 'One-time fee'}</div>
          </div>

          {whitelabelEnabled ? (
            <button
              disabled
              className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold cursor-default"
            >
              {isHindi ? 'सक्रिय है' : 'Enabled'}
            </button>
          ) : (
            <CheckoutButton
              amount={10000}
              planName="White-label"
              planPeriod="lifetime"
              labelEn="Unlock Branding"
              labelHi="ब्रांडिंग अनलॉक करें"
              isHindi={isHindi}
              orgId={orgId}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center transition-colors shadow-sm"
            />
          )}
        </div>
      </div>
    </div>
  )
}
