import Link from 'next/link'
import { ArrowRight, ShieldCheck, Video, Banknote, Activity, Globe, Vote, Megaphone, Lock, Users, Fingerprint, Layers, Cpu, Check, FileText } from 'lucide-react'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'नागरिक समूहों के लिए ऑपरेटिंग सिस्टम | संगठन' : 'The Operating System for Civic Collectives | Sangathan',
    description: isHindi
      ? 'एनजीओ, छात्र संघों और सामुदायिक समूहों के लिए सदस्यों, निधियों और शासन का प्रबंधन करने के लिए डिजिटल बुनियादी ढांचा।'
      : 'Digital infrastructure for NGOs, student unions, and community groups to manage members, funds, and governance.',
  }
}

export default async function LandingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'
  
  return (
    <div className="bg-white min-h-screen relative font-sans text-slate-900 selection:bg-indigo-100">
      
      {/* Background Dot Pattern (Technical Aesthetic) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #0f172a 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="relative z-10">
        
        {/* 1. HERO SECTION - Premium Minimalist */}
        <section className="pt-32 pb-24 sm:pt-40 sm:pb-32 px-4 max-w-7xl mx-auto flex flex-col items-center text-center border-b border-slate-200">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-mono uppercase tracking-widest mb-8">
            <span className="w-2 h-2 bg-indigo-500 rounded-none animate-pulse" />
            {isHindi ? 'नागरिक बुनियादी ढांचा v2.0' : 'Civic Infrastructure v2.0'}
          </div>

          <h1 className="text-6xl sm:text-8xl lg:text-[7.5rem] font-black tracking-tighter mb-8 text-slate-900 leading-[0.95]">
            {isHindi ? 'नागरिक समूहों के लिए' : 'The operating system'} <br className="hidden sm:block" />
            <span className="text-indigo-600">
              {isHindi ? 'ऑपरेटिंग सिस्टम' : 'for civic collectives.'}
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 leading-snug tracking-tight font-medium">
            {isHindi
              ? 'एनजीओ और यूनियनों के लिए सुरक्षित बुनियादी ढांचा। सदस्यों, धन और शासन का प्रबंधन करें बिना अराजकता के।'
              : 'Secure infrastructure for NGOs and Unions. Manage members, funds, and governance without the chaos.'}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link 
              href={`/${lang}/login?tab=signup`} 
              className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 font-bold text-sm tracking-widest uppercase transition-all hover:bg-indigo-600 flex items-center justify-center gap-3 border border-slate-900"
            >
              {isHindi ? 'संगठन बनाएं' : 'Start your Organisation'} <ArrowRight size={16} />
            </Link>
            <Link 
              href={`/${lang}/docs`} 
              className="w-full sm:w-auto bg-transparent text-slate-900 px-8 py-4 font-bold text-sm tracking-widest uppercase border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all text-center"
            >
              {isHindi ? 'दस्तावेज़ पढ़ें' : 'Read the Docs'}
            </Link>
          </div>
        </section>

        {/* 2. BENTO BOX FEATURES - Sharp Technical Grid */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
           <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
              <div>
                 <p className="text-indigo-600 font-mono text-xs uppercase tracking-widest mb-3">{isHindi ? 'मूल प्रणाली' : 'Core System'}</p>
                 <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">{isHindi ? 'शासन बुनियादी ढांचा' : 'Governance Infrastructure'}</h2>
              </div>
              <p className="text-slate-500 max-w-md text-sm leading-relaxed">
                {isHindi ? 'अनौपचारिक समूहों को संरचित संस्थानों में बदलें।' : 'Everything you need to transform informal groups into structured, transparent institutions. Built for absolute accountability.'}
              </p>
           </div>

           {/* Technical CSS Grid */}
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
              
              {/* Box 1 */}
              <div className="lg:col-span-2 bg-white border border-slate-200 p-10 lg:p-14 group hover:border-indigo-300 transition-colors relative overflow-hidden flex flex-col justify-between min-h-[360px]">
                 <div className="relative z-10">
                   <div className="flex items-center gap-4 mb-6">
                     <Users className="text-indigo-600" size={28} strokeWidth={1.5} />
                     <h3 className="text-2xl font-bold tracking-tight text-slate-900">Role-based Registry</h3>
                   </div>
                   <p className="text-slate-500 max-w-md text-lg leading-relaxed mb-8">
                     Secure member directories with granular access controls and identity verification. Isolate internal data silos securely.
                   </p>
                 </div>
                 {/* Technical wireframe decoration */}
                 <div className="absolute -bottom-8 -right-8 w-64 h-64 border border-slate-100 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute -bottom-16 -right-16 w-96 h-96 border border-slate-100 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-1000 delay-75" />
                 
                 <div className="mt-auto">
                    <div className="w-full flex border-t border-slate-100 pt-4 gap-8">
                      <div>
                        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-sm font-bold text-slate-700">Encrypted</p>
                      </div>
                      <div>
                        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Access</p>
                        <p className="text-sm font-bold text-slate-700">Granular (RBAC)</p>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Box 2 */}
              <div className="bg-white border border-slate-200 p-10 lg:p-14 group hover:border-indigo-300 transition-colors relative overflow-hidden flex flex-col min-h-[360px]">
                 <div className="mb-auto">
                   <Vote className="text-indigo-600 mb-6" size={28} strokeWidth={1.5} />
                   <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">Resolutions</h3>
                   <p className="text-slate-500 text-lg leading-relaxed">
                     Cryptographically verifiable voting and polls for decisive governance.
                   </p>
                 </div>
              </div>

              {/* Box 3 */}
              <div className="bg-white border border-slate-200 p-10 lg:p-14 group hover:border-indigo-300 transition-colors relative overflow-hidden flex flex-col min-h-[360px]">
                 <div className="mb-auto">
                   <Banknote className="text-indigo-600 mb-6" size={28} strokeWidth={1.5} />
                   <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">Ledgers</h3>
                   <p className="text-slate-500 text-lg leading-relaxed">
                     Automated financial logging and transparent receipt tracking.
                   </p>
                 </div>
              </div>

              {/* Box 4 */}
              <div className="lg:col-span-2 bg-white border border-slate-200 p-10 lg:p-14 group hover:border-indigo-300 transition-colors relative overflow-hidden flex flex-col min-h-[360px]">
                 <div className="flex items-center gap-4 mb-6">
                   <ShieldCheck className="text-indigo-600" size={28} strokeWidth={1.5} />
                   <h3 className="text-2xl font-bold tracking-tight text-slate-900">Immutable Audit Logs</h3>
                 </div>
                 <p className="text-slate-500 max-w-xl text-lg leading-relaxed mb-8">
                   Every administrative action is securely logged to prevent abuse of power and ensure absolute accountability across your collective.
                 </p>
                 <div className="mt-auto">
                    <div className="w-full flex border-t border-slate-100 pt-4 gap-8">
                      <div>
                        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Integrity</p>
                        <p className="text-sm font-bold text-slate-700">WORM Storage</p>
                      </div>
                      <div>
                        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Retention</p>
                        <p className="text-sm font-bold text-slate-700">Permanent</p>
                      </div>
                    </div>
                 </div>
              </div>

           </div>
        </section>

        {/* 3. CAPABILITIES GRID (Data Grid Style) */}
        <section className="py-24 border-t border-b border-slate-200 bg-slate-50/50">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="mb-16">
                <p className="text-indigo-600 font-mono text-xs uppercase tracking-widest mb-3">{isHindi ? 'प्लेटफ़ॉर्म मॉड्यूल' : 'Platform Modules'}</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">{isHindi ? 'मुख्य क्षमताएं' : 'Capabilities'}</h2>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-l border-t border-slate-200">
                {[
                  { icon: Users, title: 'Membership', desc: 'Secure Registry & CRM' },
                  { icon: Video, title: 'Events', desc: 'RSVP & Attendance' },
                  { icon: Check, title: 'Tasks', desc: 'Volunteer Management' },
                  { icon: Megaphone, title: 'Broadcast', desc: 'Mass Announcements' },
                  { icon: Vote, title: 'Elections', desc: 'Secure Polling' },
                  { icon: Activity, title: 'Analytics', desc: 'Growth Insights' },
                  { icon: Layers, title: 'Transparency', desc: 'Public Mode Data' },
                  { icon: Globe, title: 'Federation', desc: 'Network Connectivity' },
                ].map((item, idx) => (
                  <div key={idx} className="p-8 border-r border-b border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                     <item.icon className="text-slate-400 mb-6" size={24} strokeWidth={1.5} />
                     <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">{item.title}</h3>
                     <p className="text-slate-500 text-sm font-medium">{item.desc}</p>
                  </div>
                ))}
             </div>
           </div>
        </section>

        {/* 4. PRIVACY & SECURITY - Redesigned as Technical Lines instead of Blob */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                 <p className="text-indigo-600 font-mono text-xs uppercase tracking-widest mb-3">{isHindi ? 'डेटा संप्रभुता' : 'Data Sovereignty'}</p>
                 <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-6">
                    {isHindi ? 'तटस्थ बुनियादी ढांचा' : 'Privacy & Neutrality First'}
                 </h2>
                 <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                    {isHindi 
                      ? 'हम डेटा नहीं बेचते हैं। हम विज्ञापन नहीं चलाते हैं। आपका सदस्य डेटा आपका है।' 
                      : 'Sangathan is a platform, not a publisher. We provide the structure, you provide the ideology. We do not sell data or run ads.'}
                 </p>
                 <Link href={`/${lang}/transparency`} className="text-sm font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 flex items-center gap-2">
                   {isHindi ? 'हमारी डेटा नीति पढ़ें' : 'Read our data policy'} <ArrowRight size={16} />
                 </Link>
              </div>

              <div className="space-y-6">
                 {/* Minimalist Data Cards */}
                 <div className="border border-slate-200 p-6 bg-white flex items-start gap-4 hover:border-indigo-300 transition-colors">
                    <Lock className="text-slate-400 shrink-0" size={24} strokeWidth={1.5} />
                    <div>
                       <h4 className="text-slate-900 font-bold tracking-tight mb-2">End-to-End Isolation</h4>
                       <p className="text-slate-500 text-sm leading-relaxed">Tenant data is strictly separated at the database level with RLS (Row Level Security) policies.</p>
                    </div>
                 </div>
                 <div className="border border-slate-200 p-6 bg-white flex items-start gap-4 hover:border-indigo-300 transition-colors">
                    <Fingerprint className="text-slate-400 shrink-0" size={24} strokeWidth={1.5} />
                    <div>
                       <h4 className="text-slate-900 font-bold tracking-tight mb-2">Zero Tracking</h4>
                       <p className="text-slate-500 text-sm leading-relaxed">No tracking pixels. No cross-site profiling. Your members are not targeted for behavioral advertising.</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* 5. FINAL CTA - Minimalist & Sharp */}
        <section className="border-t border-slate-200 bg-white relative overflow-hidden">
           <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]"
                style={{ backgroundImage: 'linear-gradient(slate-900 1px, transparent 1px), linear-gradient(90deg, slate-900 1px, transparent 1px)', backgroundSize: '40px 40px' }}
           />
           <div className="py-32 px-4 text-center max-w-4xl mx-auto relative z-10">
             <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-900 mb-6">
                {isHindi ? 'एक स्थायी संस्थान बनाएं।' : 'Build a lasting institution.'}
             </h2>
             <p className="text-xl text-slate-500 mb-12 font-medium">
                {isHindi
                  ? 'संगठन के साथ शक्ति बनाने वाले एनजीओ, यूनियनों और समूहों के समुदाय में शामिल हों।'
                  : 'Join the community of NGOs, unions, and collectives building power with Sangathan.'}
             </p>
             <Link 
                href="/signup" 
                className="inline-flex items-center gap-3 bg-slate-900 hover:bg-indigo-600 text-white px-10 py-5 font-bold text-sm tracking-widest uppercase transition-colors border border-slate-900"
             >
                {isHindi ? 'अभी शुरू करें' : 'Deploy Infrastructure'} <ArrowRight size={16} />
             </Link>
           </div>
        </section>
        
      </div>
    </div>
  )
}
