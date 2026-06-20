import { 
  Building2, 
  GraduationCap, 
  HardHat, 
  Home, 
  Users, 
  Vote, 
  Receipt, 
  Megaphone,
  Briefcase,
  AlertTriangle,
  Scale,
  Calendar,
  Lock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader } from '@/components/public/page-header'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'सुविधाएं | संगठन' : 'Features | Sangathan',
    description: isHindi
      ? 'विभिन्न प्रकार के नागरिक समूहों के लिए तैयार की गई हमारी विशेषताएं।'
      : 'Purpose-built features tailored for every type of civic collective.',
  }
}

export default async function FeaturesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const orgs = [
    {
      id: 'ngo',
      title: isHindi ? 'गैर सरकारी संगठन (NGO)' : 'Non-Governmental Organisations',
      icon: Building2,
      color: 'indigo',
      description: isHindi 
        ? 'अपने स्वयंसेवकों को प्रबंधित करें, पारदर्शी रूप से धन जुटाएं, और अपने दान दाताओं के साथ विश्वास बनाएं।'
        : 'Manage your volunteer base, raise funds transparently, and build unshakeable trust with your donors.',
      features: [
        { icon: Users, title: 'Volunteer Registry', desc: 'Secure database of volunteers with skills tracking.' },
        { icon: Receipt, title: 'Donation Ledger', desc: 'Transparent bookkeeping with automated receipts.' },
        { icon: Megaphone, title: 'Public Campaigns', desc: 'Launch and track awareness drives and campaigns.' },
        { icon: ShieldCheck, title: 'Transparency Reports', desc: 'Auto-generate reports for compliance.' }
      ]
    },
    {
      id: 'student-union',
      title: isHindi ? 'छात्र संघ' : 'Student Unions',
      icon: GraduationCap,
      color: 'emerald',
      description: isHindi 
        ? 'छात्रों की आवाज़ को संगठित करें। सुरक्षित चुनाव कराएं और कैंपस की समस्याओं को ट्रैक करें।'
        : 'Organise the student voice. Conduct secure elections, track campus grievances, and manage events.',
      features: [
        { icon: Vote, title: 'Secure Elections', desc: 'Cryptographically verifiable voting for representatives.' },
        { icon: AlertTriangle, title: 'Grievance Redressal', desc: 'Track and resolve student complaints systematically.' },
        { icon: Calendar, title: 'Event Management', desc: 'RSVPs and attendance tracking for campus events.' },
        { icon: Lock, title: 'Digital IDs', desc: 'Generate verifiable digital student union ID cards.' }
      ]
    },
    {
      id: 'worker-union',
      title: isHindi ? 'श्रमिक संघ' : 'Workers Unions',
      icon: HardHat,
      color: 'orange',
      description: isHindi 
        ? 'मज़दूरों के अधिकारों की रक्षा करें। सामूहिक सौदेबाजी (CBA) और हड़तालों का समन्वय करें।'
        : 'Protect worker rights with power. Coordinate collective bargaining, track dues, and organise actions.',
      features: [
        { icon: Briefcase, title: 'CBA Tracking', desc: 'Manage Collective Bargaining Agreements and clauses.' },
        { icon: Scale, title: 'Legal & Disputes', desc: 'Log workplace disputes and legal support requests.' },
        { icon: Megaphone, title: 'Action Coordination', desc: 'Organise strikes, protests, and mass communications.' },
        { icon: Receipt, title: 'Dues Collection', desc: 'Automated tracking of union membership dues.' }
      ]
    },
    {
      id: 'rwa',
      title: isHindi ? 'रेजिडेंट वेलफेयर एसोसिएशन' : 'Resident Welfare Associations',
      icon: Home,
      color: 'cyan',
      description: isHindi 
        ? 'अपने पड़ोस को बेहतर बनाएं। रखरखाव, आगंतुक और सामुदायिक मतदान प्रबंधित करें।'
        : 'Modernise your neighbourhood. Manage maintenance, visitors, and democratic community polling.',
      features: [
        { icon: Receipt, title: 'Maintenance Dues', desc: 'Automate flat-wise maintenance billing and collection.' },
        { icon: Users, title: 'Visitor Log', desc: 'Secure entry tracking for guests and staff.' },
        { icon: Vote, title: 'Community Polls', desc: 'Quick polls for neighborhood decisions and upgrades.' },
        { icon: Calendar, title: 'Facility Booking', desc: 'Manage bookings for clubhouses and common areas.' }
      ]
    }
  ]

  const colorStyles = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', hover: 'hover:border-indigo-400', glow: 'bg-indigo-500/10' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', hover: 'hover:border-emerald-400', glow: 'bg-emerald-500/10' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', hover: 'hover:border-orange-400', glow: 'bg-orange-500/10' },
    cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', border: 'border-cyan-200', hover: 'hover:border-cyan-400', glow: 'bg-cyan-500/10' },
  }

  return (
    <div className="bg-white min-h-screen">
      <PageHeader 
        title={isHindi ? 'हर प्रकार के समूह के लिए' : 'Built for every collective'}
        description={isHindi 
          ? 'संगठन एक आकार-फिट-सभी उपकरण नहीं है। यह विशेष रूप से आपकी संरचना के अनुसार ढल जाता है।'
          : 'Sangathan is not a one-size-fits-all tool. It intelligently adapts to the specific operational model of your organisation.'}
        badge={isHindi ? 'विशेषताएं' : 'Platform Features'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        <div className="space-y-32">
          {orgs.map((org, index) => {
            const isEven = index % 2 === 0
            const style = colorStyles[org.color as keyof typeof colorStyles]
            const OrgIcon = org.icon

            return (
              <div key={org.id} id={org.id} className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Left/Right Text Content */}
                <div className="flex-1 space-y-6 relative">
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${style.glow} rounded-full blur-3xl -z-10`} />
                  
                  <div className={`inline-flex items-center justify-center p-4 rounded-2xl ${style.bg} ${style.border} border shadow-sm`}>
                    <OrgIcon className={style.text} size={32} />
                  </div>
                  
                  <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    {org.title}
                  </h2>
                  
                  <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                    {org.description}
                  </p>

                  <div className="pt-4">
                    <Link 
                      href={`/${lang}/login?tab=signup`}
                      className="group inline-flex items-center gap-2 text-slate-900 font-bold hover:text-slate-700 transition-colors"
                    >
                      {isHindi ? 'अपना संगठन शुरू करें' : `Start your ${org.title.replace(/s$/, '')}`}
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

                {/* Right/Left Interactive Grid */}
                <div className="flex-1 w-full relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {org.features.map((feature, fIndex) => {
                      const FeatureIcon = feature.icon
                      // Add slight staggered animation delays via tailwind classes (can simulate with translate)
                      const translateClass = fIndex % 2 === 0 ? 'sm:translate-y-6' : ''
                      
                      return (
                        <div 
                          key={fIndex}
                          className={`bg-white border ${style.border} rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group ${translateClass} ${style.hover}`}
                        >
                          <div className={`w-12 h-12 rounded-xl ${style.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                            <FeatureIcon className={style.text} size={24} />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {feature.title}
                          </h3>
                          <p className="text-slate-500 text-sm leading-relaxed">
                            {feature.desc}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Unified Platform Banner */}
        <div className="mt-40 relative rounded-[2.5rem] bg-slate-900 overflow-hidden p-10 sm:p-16 border border-slate-800 shadow-2xl text-center max-w-5xl mx-auto">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/20 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />
          
          <div className="relative z-10">
             <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
                {isHindi ? 'एक ही बुनियादी ढांचा। अनंत संभावनाएं।' : 'One infrastructure. Infinite possibilities.'}
             </h2>
             <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                {isHindi 
                  ? 'चाहे आप 10 लोगों का स्वयंसेवक समूह हों या 10,000 सदस्यों वाला राष्ट्रव्यापी संघ, हमारा सिस्टम आपके साथ बढ़ता है।' 
                  : 'Whether you are a 10-person volunteer group or a 10,000-member nationwide union, our system scales with you.'}
             </p>
             
             <Link 
                href={`/${lang}/pricing`} 
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgb(255,255,255,0.3)]"
             >
                {isHindi ? 'मूल्य निर्धारण देखें' : 'View Pricing Plans'} <ArrowRight size={18} />
             </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
