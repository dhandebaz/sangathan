import Link from 'next/link'
import { ArrowRight, ShieldCheck, Video, Banknote, Activity, Globe, Vote, Megaphone, Lock, Users, Fingerprint, Layers, Cpu, Check } from 'lucide-react'
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
    <div className="overflow-hidden bg-transparent">
      {/* 1. HERO SECTION - Premium Minimalist */}
      <section className="relative pt-20 pb-32 sm:pt-32 sm:pb-40 px-4 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Dynamic glowing mesh behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 animate-fade-up" style={{ animationDuration: '1s' }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-semibold mb-8 border border-slate-200 dark:border-white/10 shadow-sm transition-transform hover:scale-105">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {isHindi ? 'भारत में संचालित' : 'Designed & Built in India'}
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6 text-slate-900 dark:text-white leading-[1.05]">
            {isHindi ? 'नागरिक समूहों के लिए' : 'The operating system'} <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500 dark:from-indigo-400 dark:to-cyan-300">
              {isHindi ? 'ऑपरेटिंग सिस्टम' : 'for civic collectives.'}
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            {isHindi
              ? 'एनजीओ और यूनियनों के लिए सुरक्षित बुनियादी ढांचा। सदस्यों, धन और शासन का प्रबंधन करें बिना अराजकता के।'
              : 'Secure infrastructure for NGOs and Unions. Manage members, funds, and governance without the chaos.'}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href={`/${lang}/login?tab=signup`} 
              className="group relative w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgb(99,102,241,0.3)] flex items-center justify-center gap-2 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isHindi ? 'संगठन बनाएं' : 'Start your Organisation'} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link 
              href={`/${lang}/docs`} 
              className="w-full sm:w-auto bg-white dark:bg-white/5 text-slate-900 dark:text-white px-8 py-4 rounded-2xl font-bold text-lg border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all text-center"
            >
              {isHindi ? 'दस्तावेज़ पढ़ें' : 'Read the Docs'}
            </Link>
          </div>
        </div>
      </section>

      {/* 2. BENTO BOX FEATURES - Premium Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
         <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">{isHindi ? 'शासन बुनियादी ढांचा' : 'Governance Infrastructure'}</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {isHindi ? 'अनौपचारिक समूहों को संरचित संस्थानों में बदलें।' : 'Everything you need to transform informal groups into structured, transparent institutions.'}
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Bento 1: Large Span */}
            <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-8 group hover:border-indigo-500/50 transition-colors">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               <div className="relative z-10 h-full flex flex-col justify-between">
                 <div>
                   <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm">
                     <Users className="text-indigo-500 dark:text-indigo-400" size={24} />
                   </div>
                   <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Role-based Registry</h3>
                   <p className="text-slate-500 dark:text-slate-400 max-w-sm">Secure member directories with granular access controls and identity verification.</p>
                 </div>
               </div>
               {/* Decorative UI element */}
               <div className="absolute bottom-[-20%] right-[-10%] w-3/4 h-2/3 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-t-3xl shadow-2xl p-4 opacity-50 group-hover:translate-y-[-10px] transition-transform duration-500">
                  <div className="w-full h-8 bg-slate-100 dark:bg-white/5 rounded-lg mb-2" />
                  <div className="w-2/3 h-8 bg-slate-100 dark:bg-white/5 rounded-lg mb-2" />
                  <div className="w-5/6 h-8 bg-slate-100 dark:bg-white/5 rounded-lg" />
               </div>
            </div>

            {/* Bento 2: Standard */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-8 group hover:border-cyan-500/50 transition-colors">
               <div className="relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm">
                   <Vote className="text-cyan-500 dark:text-cyan-400" size={24} />
                 </div>
                 <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Resolutions</h3>
                 <p className="text-slate-500 dark:text-slate-400">Cryptographically verifiable voting and polls for decisive governance.</p>
               </div>
            </div>

            {/* Bento 3: Standard */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-8 group hover:border-emerald-500/50 transition-colors">
               <div className="relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm">
                   <Banknote className="text-emerald-500 dark:text-emerald-400" size={24} />
                 </div>
                 <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Ledgers</h3>
                 <p className="text-slate-500 dark:text-slate-400">Automated financial logging and transparent receipt tracking.</p>
               </div>
            </div>

            {/* Bento 4: Large Span */}
            <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 p-8 group hover:border-purple-500/50 transition-colors">
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
               <div className="relative z-10 h-full flex flex-col justify-between">
                 <div>
                   <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm">
                     <ShieldCheck className="text-purple-500 dark:text-purple-400" size={24} />
                   </div>
                   <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Immutable Audit Logs</h3>
                   <p className="text-slate-500 dark:text-slate-400 max-w-sm">Every administrative action is securely logged to prevent abuse of power and ensure absolute accountability.</p>
                 </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. CAPABILITIES GRID (Sleek List) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/10">
         <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
               <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">{isHindi ? 'मुख्य क्षमताएं' : 'Platform Capabilities'}</h2>
               <p className="text-slate-500 dark:text-slate-400 max-w-xl">
                  {isHindi ? 'आधुनिक नागरिक बुनियादी ढांचे के लिए उपकरण।' : 'A comprehensive suite of tools built for civic coordination.'}
               </p>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
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
              <div key={idx} className="group cursor-default">
                 <div className="flex items-center gap-4 mb-3">
                    <div className="bg-slate-100 dark:bg-white/5 p-2 rounded-lg text-slate-600 dark:text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
                       <item.icon size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                 </div>
                 <p className="text-slate-500 dark:text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* 4. PRIVACY & SECURITY */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
         <div className="relative rounded-[2.5rem] bg-slate-900 dark:bg-[#111] overflow-hidden p-10 sm:p-16 border border-slate-800 dark:border-white/10 shadow-2xl">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/20 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />
            
            <div className="relative z-10">
               <Fingerprint className="text-emerald-400 mb-6" size={48} />
               <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-6">
                  {isHindi ? 'तटस्थ बुनियादी ढांचा' : 'Privacy & Neutrality First'}
               </h2>
               <p className="text-lg text-slate-300 mb-10 max-w-2xl leading-relaxed">
                  {isHindi 
                    ? 'हम डेटा नहीं बेचते हैं। हम विज्ञापन नहीं चलाते हैं। आपका सदस्य डेटा आपका है।' 
                    : 'Sangathan is a platform, not a publisher. We provide the structure, you provide the ideology. We do not sell data or run ads.'}
               </p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-slate-700/50">
                  <div className="flex items-start gap-3">
                     <Lock className="text-emerald-400 mt-1" size={20} />
                     <div>
                        <h4 className="text-white font-semibold mb-1">End-to-End Isolation</h4>
                        <p className="text-slate-400 text-sm">Tenant data is strictly separated at the database level.</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-3">
                     <Cpu className="text-indigo-400 mt-1" size={20} />
                     <div>
                        <h4 className="text-white font-semibold mb-1">No Ad Profiling</h4>
                        <p className="text-slate-400 text-sm">Zero tracking pixels or third-party marketing analytics.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-32 px-4 text-center max-w-3xl mx-auto">
         <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            {isHindi ? 'एक स्थायी संस्थान बनाएं।' : 'Build a lasting institution.'}
         </h2>
         <p className="text-lg text-slate-500 dark:text-slate-400 mb-10">
            {isHindi
              ? 'संगठन के साथ शक्ति बनाने वाले एनजीओ, यूनियनों और समूहों के समुदाय में शामिल हों।'
              : 'Join the community of NGOs, unions, and collectives building power with Sangathan.'}
         </p>
         <Link 
            href="/signup" 
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgb(79,70,229,0.4)]"
         >
            {isHindi ? 'अभी शुरू करें' : 'Get Started for Free'} <ArrowRight size={18} />
         </Link>
      </section>
    </div>
  )
}
