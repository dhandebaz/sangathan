'use client'

import { useState } from 'react'
import { createSubscription, toggleBranding } from '@/actions/supporter/actions'
import { Check, Star, ShieldCheck, Zap } from 'lucide-react'

export function SupporterDashboard({ subscription, organisation }: { subscription: any, organisation: any }) {
  const [loading, setLoading] = useState(false)
  const [toggleLoading, setToggleLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const result = await createSubscription({})
      if (result.shortUrl) {
        window.location.href = result.shortUrl
      }
    } catch (err: any) {
      alert(err.message)
      setLoading(false)
    }
  }

  const handleToggleBranding = async () => {
    setToggleLoading(true)
    try {
      await toggleBranding({ removeBranding: !organisation.remove_branding })
      // Optimistic or refresh needed? Server action revalidates.
    } catch (err: any) {
      alert(err.message)
    }
    setToggleLoading(false)
  }

  const isActive = subscription?.status === 'active'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
         <h1 className="text-3xl font-bold tracking-tight mb-2">Supporter Plan</h1>
         <p className="text-gray-500">Support the platform and unlock premium branding options.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Status Card */}
         <div className="content-card rounded-xl p-8 flex flex-col items-center text-center border-2 border-orange-100 bg-orange-50/30">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isActive ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
               <Star size={40} fill={isActive ? "currentColor" : "none"} />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">
               {isActive ? 'Active Supporter' : 'Free Plan'}
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-xs">
               {isActive 
                 ? `Thank you for your support! Your subscription is active until ${new Date(subscription.current_period_end).toLocaleDateString()}.`
                 : 'Upgrade to remove branding and support the development of Sangathan.'
               }
            </p>

            {isActive ? (
               <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium opacity-80 cursor-default">
                  Subscription Active
               </button>
            ) : (
               <button 
                  onClick={handleSubscribe} 
                  disabled={loading}
                  className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
               >
                  {loading ? 'Processing...' : 'Become a Supporter (₹99/mo)'}
               </button>
            )}
            
            {!isActive && (
               <p className="text-xs text-gray-400 mt-4">Secured by Razorpay. Cancel anytime.</p>
            )}
         </div>

         {/* Features & Settings */}
         <div className="space-y-6">
            <div className="content-card rounded-lg p-6">
               <h3 className="font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-green-600" />
                  Supporter Benefits
               </h3>
               <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                     <Check size={18} className="text-orange-500 mt-0.5" />
                     <span className="text-sm text-gray-600">Verified Supporter Badge on your Organisation profile.</span>
                  </li>
                  <li className="flex items-start gap-3">
                     <Check size={18} className="text-orange-500 mt-0.5" />
                     <span className="text-sm text-gray-600">Remove "Powered by Sangathan" branding from public forms.</span>
                  </li>
                  <li className="flex items-start gap-3">
                     <Check size={18} className="text-orange-500 mt-0.5" />
                     <span className="text-sm text-gray-600">Priority support via email.</span>
                  </li>
               </ul>
            </div>

            {isActive && (
               <div className="content-card rounded-lg p-6 border-l-4 border-orange-500">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                     <Zap size={18} className="text-orange-500" />
                     Premium Settings
                  </h3>
                  
                  <div className="flex items-center justify-between">
                     <div>
                        <div className="font-medium text-sm">Remove Branding</div>
                        <div className="text-xs text-gray-500">Hide platform logo on public pages</div>
                     </div>
                     <button 
                        onClick={handleToggleBranding}
                        disabled={toggleLoading}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${organisation.remove_branding ? 'bg-orange-600' : 'bg-gray-200'}`}
                     >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${organisation.remove_branding ? 'translate-x-6' : 'translate-x-1'}`} />
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  )
}
