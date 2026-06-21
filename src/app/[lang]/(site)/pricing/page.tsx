import { Check, X, Info, Zap, ShieldCheck, Sparkles, Building2 } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { CheckoutButton } from '@/components/pricing/checkout-button'
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'मूल्य निर्धारण | संगठन' : 'Pricing | Sangathan',
    description: isHindi
      ? 'पारदर्शी मूल्य निर्धारण। जमीनी स्तर के समूहों के लिए हमेशा के लिए मुफ्त।'
      : 'Transparent pricing. Free forever for grassroots collectives.',
  }
}

export default async function PricingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  return (
    <div className="bg-white min-h-screen">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          
          {/* Free Tier */}
          <div className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{isHindi ? 'समुदाय' : 'Community'}</h3>
              <p className="text-slate-500">{isHindi ? 'छोटे, अनौपचारिक समूहों के लिए।' : 'For small, informal collectives just getting started.'}</p>
            </div>
            
            <div className="mb-6">
              <span className="text-5xl font-extrabold text-slate-900">₹0</span>
              <span className="text-slate-500 font-medium">/{isHindi ? 'हमेशा के लिए' : 'forever'}</span>
            </div>

            <Link 
              href={`/${lang}/login?tab=signup`}
              className="w-full py-4 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-center transition-colors mb-8"
            >
              {isHindi ? 'मुफ्त शुरू करें' : 'Start for free'}
            </Link>

            <div className="space-y-4 flex-grow">
              {[
                isHindi ? '1 संगठन' : '1 Organisation limit',
                isHindi ? 'कुल 20 उपयोगकर्ता (सदस्य + स्वयंसेवक)' : 'Up to 20 users total (Members + Volunteers)',
                isHindi ? 'सभी मुख्य शासन सुविधाएँ' : 'All core governance features',
                isHindi ? 'हमेशा के लिए मुफ़्त' : 'Free to Use',
                isHindi ? 'मानक समर्थन' : 'Standard community support',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1 bg-emerald-100 rounded-full p-0.5">
                    <Check size={14} className="text-emerald-600 stroke-[3]" />
                  </div>
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tier */}
          <div className="relative rounded-3xl border-2 border-indigo-500 bg-white p-8 shadow-xl flex flex-col overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="mb-6 relative z-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                {isHindi ? 'संस्थान' : 'Institution'} <Sparkles className="text-indigo-500" size={20} />
              </h3>
              <p className="text-slate-500">{isHindi ? 'बड़े संघों और बढ़ते एनजीओ के लिए।' : 'For large unions and scaling NGOs that need more power.'}</p>
            </div>
            
            <div className="mb-6 relative z-10">
              <span className="text-5xl font-extrabold text-slate-900">₹1,000</span>
              <span className="text-slate-500 font-medium">/{isHindi ? 'महीना' : 'month'}</span>
            </div>

            <CheckoutButton 
              amount={1000}
              planName="Institution"
              labelEn="Upgrade to Institution"
              labelHi="अपग्रेड करें"
              isHindi={isHindi}
              className="relative w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center transition-colors mb-8 group overflow-hidden"
            >
              <span className="relative z-10">{isHindi ? 'अपग्रेड करें' : 'Upgrade to Institution'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-white/20 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </CheckoutButton>

            <div className="space-y-4 flex-grow relative z-10">
              <div className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">
                {isHindi ? 'समुदाय में सब कुछ, और:' : 'Everything in Community, plus:'}
              </div>
              {[
                isHindi ? 'असीमित उपयोगकर्ता और सदस्य' : 'Unlimited users (Members + Volunteers)',
                isHindi ? '1 संगठन' : '1 Organisation',
                isHindi ? 'कई संगठनों का प्रबंधन (व्यवस्थापक के रूप में)' : 'Manage multiple orgs (Admin access)',
                isHindi ? 'BYOK (Bring Your Own Key) AI सुविधाएँ' : 'BYOK (Bring Your Own Key) AI Features',
                isHindi ? 'उन्नत विश्लेषिकी और रिपोर्ट' : 'Advanced analytics & export',
                isHindi ? 'प्राथमिकता समर्थन' : 'Priority email support',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 rounded-full p-0.5">
                    <Check size={14} className="text-indigo-600 stroke-[3]" />
                  </div>
                  <span className="text-slate-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* White Label Addon */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-10 relative overflow-hidden group hover:border-slate-300 transition-colors">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent to-slate-200/50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
              <div className="w-20 h-20 shrink-0 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-200">
                <Building2 size={36} className="text-slate-700" />
              </div>
              
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{isHindi ? 'व्हाइट-लेबल' : 'White-label Branding'}</h3>
                <p className="text-slate-600 mb-4 max-w-lg">
                  {isHindi 
                    ? 'सभी "Powered by Sangathan" ब्रांडिंग हटाएं।' 
                    : 'Remove all "Powered by Sangathan" branding across the platform.'}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-900 font-semibold">
                  <span className="text-3xl font-extrabold">₹10,000</span>
                  <span className="text-slate-500 font-normal">({isHindi ? 'एक बार का शुल्क' : 'One-time fee'})</span>
                </div>
              </div>
              
              <div className="shrink-0 w-full sm:w-auto">
                <CheckoutButton 
                  amount={10000}
                  planName="White-label"
                  labelEn="Buy Now"
                  labelHi="अभी खरीदें"
                  isHindi={isHindi}
                  className="block w-full sm:w-auto px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-center transition-colors shadow-[0_0_20px_rgb(0,0,0,0.1)] hover:shadow-[0_0_30px_rgb(0,0,0,0.15)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ or Assurance */}
        <div className="mt-24 max-w-3xl mx-auto text-center">
          <ShieldCheck size={48} className="mx-auto text-emerald-500 mb-6" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            {isHindi ? 'मुफ़्त और सुरक्षित' : 'Free & Secure'}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {isHindi 
              ? 'हम न तो डेटा बेचते हैं और न ही विज्ञापन चलाते हैं। संस्थागत योजना से प्राप्त आय इस प्लेटफ़ॉर्म को छोटे नागरिक समूहों के लिए हमेशा के लिए मुफ़्त रखने के लिए सर्वर लागत को निधि देती है।' 
              : 'We do not sell data or run ads. The revenue from the Institution plan funds server costs to keep this platform free forever for small civic groups.'}
          </p>
        </div>

      </div>
    </div>
  )
}
