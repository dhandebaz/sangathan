import Link from 'next/link'
import { ArrowRight, Check, ShieldCheck, Video, Banknote, Activity, Globe, Vote, Megaphone, Lock, Users } from 'lucide-react'
import { Metadata } from 'next'
import { NeutralInfrastructureFeatures } from '@/components/public/neutral-infrastructure'

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
    <div className="overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* 1. HERO SECTION - Dark Default, Structured */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[var(--border-subtle)]">
        {/* Background Animation */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Dot Grid */}
          <div 
            className="absolute inset-0 opacity-[0.15] dark:opacity-[0.1]" 
            style={{ 
              backgroundImage: `radial-gradient(circle, var(--text-secondary) 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
              maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
            }} 
          />
          {/* Subtle Moving Glows */}
          <div 
            className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[var(--accent)] opacity-[0.05] blur-[120px] animate-pulse"
            style={{ animationDuration: '10s' }}
          />
          <div 
            className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[var(--success)] opacity-[0.03] blur-[100px] animate-pulse"
            style={{ animationDuration: '15s', animationDelay: '2s' }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
           {/* Left Content */}
           <div className="lg:col-span-7 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm font-medium mb-8 border border-[var(--border-subtle)]">
                <span className="w-2 h-2 rounded-full bg-[var(--success)]"></span>
                {isHindi ? 'भारत में संचालित' : 'Operational in India'}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-[var(--text-primary)] leading-[1.1]">
                {isHindi ? 'नागरिक समूहों के लिए' : 'The operating system for'} <br />
                <span className="text-[var(--accent)]">{isHindi ? 'ऑपरेटिंग सिस्टम' : 'civic collectives'}</span>.
              </h1>
              <p className="text-xl text-[var(--text-secondary)] max-w-xl mb-10 leading-relaxed">
                {isHindi
                  ? 'एनजीओ और यूनियनों के लिए सुरक्षित बुनियादी ढांचा। सदस्यों, धन और शासन का प्रबंधन करें बिना अराजकता के।'
                  : 'Secure infrastructure for NGOs and Unions. Manage members, funds, and governance without the chaos.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/signup" 
                  className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  {isHindi ? 'संगठन बनाएं' : 'Create Organisation'} <ArrowRight size={18} />
                </Link>
                <Link 
                  href={`/${lang}/docs`} 
                  className="bg-[var(--surface)] text-[var(--text-primary)] px-8 py-4 rounded-lg font-bold text-lg border border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] transition-colors text-center"
                >
                  {isHindi ? 'दस्तावेज़ पढ़ें' : 'Read Documentation'}
                </Link>
              </div>
              <div className="mt-8 text-sm text-[var(--text-secondary)] flex items-center gap-6">
                <span className="flex items-center gap-2"><Check size={14} className="text-[var(--success)]" /> {isHindi ? 'मुफ़्त कोर' : 'Free Core'}</span>
                <span className="flex items-center gap-2"><Check size={14} className="text-[var(--success)]" /> {isHindi ? 'ओपन सोर्स' : 'Open Source'}</span>
                <span className="flex items-center gap-2"><Check size={14} className="text-[var(--success)]" /> {isHindi ? 'कोई विज्ञापन नहीं' : 'No Ads'}</span>
              </div>
           </div>

           {/* Right Visual - Abstract Governance Grid */}
           <div className="lg:col-span-5 hidden lg:block opacity-80">
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border-subtle)] aspect-square flex flex-col justify-end">
                    <Users className="text-[var(--accent)] mb-2" size={32} />
                    <div className="font-bold text-lg">Members</div>
                    <div className="text-sm text-[var(--text-secondary)]">Role-based registry</div>
                 </div>
                 <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-subtle)] aspect-square flex flex-col justify-end translate-y-8">
                    <Vote className="text-[var(--text-primary)] mb-2" size={32} />
                    <div className="font-bold text-lg">Decisions</div>
                    <div className="text-sm text-[var(--text-secondary)]">Verifiable voting</div>
                 </div>
                 <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-subtle)] aspect-square flex flex-col justify-end -translate-y-8">
                    <Banknote className="text-[var(--text-primary)] mb-2" size={32} />
                    <div className="font-bold text-lg">Funds</div>
                    <div className="text-sm text-[var(--text-secondary)]">Transparent ledger</div>
                 </div>
                 <div className="bg-[var(--surface)] p-6 rounded-xl border border-[var(--border-subtle)] aspect-square flex flex-col justify-end">
                    <ShieldCheck className="text-[var(--accent)] mb-2" size={32} />
                    <div className="font-bold text-lg">Trust</div>
                    <div className="text-sm text-[var(--text-secondary)]">Audit logging</div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 2. WHAT SANGATHAN IS - 4 Column Grid */}
      <section className="py-20 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <div>
                  <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">{isHindi ? 'शासन बुनियादी ढांचा' : 'Governance Infrastructure'}</h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    {isHindi ? 'अनौपचारिक समूहों को संरचित संस्थानों में बदलें।' : 'Transform informal groups into structured institutions with proper roles and rules.'}
                  </p>
               </div>
               <div>
                  <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">{isHindi ? 'भागीदारी इंजन' : 'Participation Engine'}</h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    {isHindi ? 'बैठकों, चुनावों और कार्यों के माध्यम से सदस्यों को सक्रिय करें।' : 'Activate members through meetings, polls, and task assignments.'}
                  </p>
               </div>
               <div>
                  <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">{isHindi ? 'पारदर्शिता परत' : 'Transparency Layer'}</h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    {isHindi ? 'वित्तीय और निर्णय लेने में विश्वास का निर्माण करें।' : 'Build trust with automated financial logging and decision tracking.'}
                  </p>
               </div>
               <div>
                  <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">{isHindi ? 'जोखिम और जवाबदेही' : 'Risk & Accountability'}</h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                    {isHindi ? 'सुरक्षित ऑडिट लॉग और गोपनीयता-प्रथम डिजाइन।' : 'Protect your organisation with secure audit logs and privacy-first design.'}
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 3. CORE CAPABILITIES GRID */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">{isHindi ? 'मुख्य क्षमताएं' : 'Core Capabilities'}</h2>
            <p className="text-[var(--text-secondary)] max-w-xl">
               {isHindi ? 'आधुनिक नागरिक बुनियादी ढांचे के लिए उपकरण।' : 'Tools for modern civic infrastructure.'}
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'Membership', desc: 'Secure Registry' },
              { icon: Video, title: 'Events & RSVP', desc: 'Attendance Tracking' },
              { icon: Check, title: 'Volunteers', desc: 'Task Management' },
              { icon: Megaphone, title: 'Announcements', desc: 'Broadcast System' },
              { icon: Vote, title: 'Voting', desc: 'Resolutions & Polls' },
              { icon: Activity, title: 'Analytics', desc: 'Growth Insights' },
              { icon: Eye, title: 'Transparency', desc: 'Public Mode' },
              { icon: Globe, title: 'Federation', desc: 'Network Ready' },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors group">
                 <item.icon className="text-[var(--text-secondary)] group-hover:text-[var(--accent)] mb-4" size={28} />
                 <h3 className="text-lg font-bold mb-1 text-[var(--text-primary)]">{item.title}</h3>
                 <p className="text-[var(--text-secondary)] text-sm">{item.desc}</p>
              </div>
            ))}
         </div>
      </section>

      <section className="py-24 bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
               <div>
                  <h2 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">{isHindi ? 'तटस्थ बुनियादी ढांचा' : 'Neutral Infrastructure'}</h2>
                  <p className="text-[var(--text-secondary)] mb-8 text-lg">
                     {isHindi 
                       ? 'संगठन एक मंच है, प्रकाशक नहीं। हम संरचना प्रदान करते हैं, विचारधारा नहीं।' 
                       : 'Sangathan is a platform, not a publisher. We provide the structure, you provide the ideology.'}
                  </p>
                  <NeutralInfrastructureFeatures />
               </div>
               <div className="relative bg-[var(--surface)] p-8 rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
                  <div className="pointer-events-none absolute inset-0 opacity-10">
                     <div
                        className="absolute -inset-24 rounded-full bg-[var(--success)] blur-3xl animate-pulse"
                        style={{ animationDuration: '8s' }}
                     />
                  </div>
                  <h3 className="relative font-bold text-xl mb-4 text-[var(--text-primary)]">Privacy First</h3>
                  <p className="relative text-[var(--text-secondary)] mb-6 leading-relaxed">
                     {isHindi 
                       ? 'हम डेटा नहीं बेचते हैं। हम विज्ञापन नहीं चलाते हैं। आपका सदस्य डेटा आपका है।' 
                       : 'We do not sell data. We do not run ads. Your member data belongs to you, and only you.'}
                  </p>
                  <div className="relative flex items-center gap-4 pt-6 border-t border-[var(--border-subtle)]">
                     <Lock className="text-[var(--success)]" size={24} />
                     <span className="text-sm font-medium text-[var(--text-secondary)]">End-to-End Logic Isolation</span>
                  </div>
                  <div className="relative mt-6 grid grid-cols-2 gap-3 text-xs text-[var(--text-secondary)]">
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-ping" />
                        <span>{isHindi ? 'कोई विज्ञापन प्रोफाइलिंग नहीं' : 'No ad profiling'}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
                        <span>{isHindi ? 'न्यूनतम डेटा प्रतिधारण' : 'Minimal data retention'}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-ping" />
                        <span>{isHindi ? 'एन्क्रिप्टेड परिवहन' : 'Encrypted in transit'}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
                        <span>{isHindi ? 'संरचनात्मक लॉगिंग' : 'Structural logging only'}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. USE CASE BLOCKS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <h2 className="text-2xl font-bold mb-12 text-center text-[var(--text-primary)]">{isHindi ? 'इनके लिए निर्मित' : 'Built For'}</h2>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: 'Campus Groups', desc: 'Student Unions, Clubs' },
              { title: 'NGOs', desc: 'Non-Profits, Charities' },
              { title: 'Movements', desc: 'Volunteer Networks' },
              { title: 'Coalitions', desc: 'Civic Alliances' },
            ].map((useCase, idx) => (
              <div key={idx} className="p-6 bg-[var(--surface)] rounded-lg border border-[var(--border-subtle)] text-center">
                 <h3 className="font-bold text-[var(--text-primary)] mb-1">{useCase.title}</h3>
                 <p className="text-sm text-[var(--text-secondary)]">{useCase.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* 6. HOW IT WORKS - 3 Steps */}
      <section className="py-24 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-16 text-[var(--text-primary)]">{isHindi ? 'यह काम किस प्रकार करता है' : 'How It Works'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-sm">1</div>
                  <h3 className="text-xl font-bold mb-2">{isHindi ? 'संगठन बनाएं' : 'Create Organisation'}</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Verify identity & set up profile.</p>
               </div>
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-sm">2</div>
                  <h3 className="text-xl font-bold mb-2">{isHindi ? 'शासन संरचना' : 'Structure Governance'}</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Define roles, rules & permissions.</p>
               </div>
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-[var(--surface)] border border-[var(--border-subtle)] rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-sm">3</div>
                  <h3 className="text-xl font-bold mb-2">{isHindi ? 'सक्रिय करें' : 'Activate'}</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Start recruiting & managing.</p>
               </div>
            </div>
         </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-32 text-center px-4 bg-[var(--surface)] border-t border-[var(--border-subtle)]">
         <h2 className="text-4xl font-bold mb-6 text-[var(--text-primary)]">{isHindi ? 'एक स्थायी संस्थान बनाएं।' : 'Build a lasting institution.'}</h2>
         <p className="text-[var(--text-secondary)] mb-10 max-w-xl mx-auto text-lg">
            {isHindi
              ? 'संगठन के साथ शक्ति बनाने वाले एनजीओ, यूनियनों और समूहों के समुदाय में शामिल हों।'
              : 'Join the community of NGOs, unions, and collectives building power with Sangathan.'}
         </p>
         <Link 
            href="/signup" 
            className="inline-block bg-[var(--accent)] text-white px-10 py-5 rounded-lg font-bold text-xl hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20"
         >
            {isHindi ? 'अभी शुरू करें' : 'Get Started Now'}
         </Link>
      </section>
    </div>
  )
}

function Eye({ size = 16, className = "" }: { size?: number, className?: string }) {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
      >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    )
}
