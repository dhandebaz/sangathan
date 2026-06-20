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
  ShieldCheck,
  ClipboardList,
  CheckSquare,
  Network,
  Headphones,
  BadgeAlert,
  FileText,
  Bell,
  Wallet,
  LineChart,
  Database,
  Ticket
} from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'


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
        { icon: Database, title: 'Donor CRM Database', desc: 'Centralized profiles, giving history, and engagement tracking.' },
        { icon: Wallet, title: 'Donation Ledger', desc: 'Process one-time, recurring, and offline contributions.' },
        { icon: Receipt, title: 'Tax Receipts Automation', desc: 'Auto-generate 80G/501c3 compliant tax receipts for donors.' },
        { icon: Briefcase, title: 'Grant Tracking', desc: 'Manage grant applications and monitor fund utilization.' },
        { icon: ShieldCheck, title: 'Audit-Ready Ledgers', desc: 'Automated cash books and government compliance reporting.' },
        { icon: Users, title: 'Volunteer Registry', desc: 'Onboard volunteers, track skills, and log service hours.' },
        { icon: CheckSquare, title: 'Task & Workflow', desc: 'Assign field tasks and track project milestones.' },
        { icon: LineChart, title: 'Impact Analytics', desc: 'Dashboards measuring outcomes and ROI for funders.' },
        { icon: Megaphone, title: 'Campaign Management', desc: 'Goal-based peer-to-peer and public fundraising drives.' },
        { icon: ClipboardList, title: 'Field Forms & Surveys', desc: 'Offline-capable data collection for field workers.' },
        { icon: Network, title: 'Chapters & Subgroups', desc: 'Organise large NGOs by city chapters or wings.' },
        { icon: Headphones, title: 'Helpdesk Support', desc: 'Centralized inbox for public and beneficiary inquiries.' }
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
        { icon: Database, title: 'Central Student DB', desc: 'A verified database syncing with university enrollment.' },
        { icon: Lock, title: 'Digital ID Cards', desc: 'Cryptographically secure digital IDs with QR access.' },
        { icon: Users, title: 'Role-Based Governance', desc: 'Tiered access for executives, presidents, and students.' },
        { icon: Vote, title: 'Secure Online Voting', desc: 'End-to-end verifiable, anonymous elections.' },
        { icon: AlertTriangle, title: 'Grievance Redressal', desc: 'Ticketing system for academic and hostel complaints.' },
        { icon: Ticket, title: 'Event Ticketing & RSVPs', desc: 'Manage campus events, QR check-ins, and waitlists.' },
        { icon: Wallet, title: 'Club Sub-funding', desc: 'Allow societies to request and track micro-budgets.' },
        { icon: FileText, title: 'Proposals & Bills', desc: 'Draft, debate, and pass union resolutions democratically.' },
        { icon: ClipboardList, title: 'Meeting Minutes', desc: 'Public ledger of committee proceedings and votes.' },
        { icon: Network, title: 'Clubs & Societies', desc: 'Mini-dashboards for sub-groups to manage members.' },
        { icon: Bell, title: 'Campus Notices', desc: 'Official noticeboard for urgent student updates.' },
        { icon: Megaphone, title: 'Multi-channel Alerts', desc: 'Push notifications and SMS for rapid mobilization.' }
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
        { icon: Users, title: 'Member Database', desc: 'Track employment history, standing, and certifications.' },
        { icon: Wallet, title: 'Automated Dues Collection', desc: 'Manage percentage or flat dues, with delinquency alerts.' },
        { icon: Scale, title: 'Grievance Case Mgmt', desc: 'Track workplace disputes through arbitration stages.' },
        { icon: Briefcase, title: 'CBA Contract Tracking', desc: 'Central repository for redlining and negotiation prep.' },
        { icon: Megaphone, title: 'Strike Coordination', desc: 'Workplace mapping and picket line organization.' },
        { icon: Vote, title: 'Secure Polling', desc: 'Conduct strike ballots and leadership elections.' },
        { icon: HardHat, title: 'Worker Dispatch System', desc: 'Match member skills to employer job requirements.' },
        { icon: Building2, title: 'Employer Management', desc: 'Monitor contract compliance across signatory companies.' },
        { icon: BadgeAlert, title: 'Shop Steward Roles', desc: 'Granular permissions for field representatives.' },
        { icon: ShieldCheck, title: 'Labor Law Compliance', desc: 'Automated checks against union regulations.' },
        { icon: Bell, title: 'Emergency SMS Alerts', desc: 'Urgent broadcasts for rapid member mobilization.' },
        { icon: GraduationCap, title: 'Training & Certs', desc: 'Manage apprenticeship programs and skill workshops.' }
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
        { icon: Receipt, title: 'Maintenance Billing', desc: 'Automated invoices based on flat size and late fees.' },
        { icon: Wallet, title: 'Online Payment Gateway', desc: 'Collect dues via UPI/Cards with auto-reconciliation.' },
        { icon: Users, title: 'Digital Visitor Log', desc: 'Gatekeeper app with photo capture and timestamps.' },
        { icon: Lock, title: 'Pre-approved Entry', desc: 'Residents approve guests or deliveries via the app.' },
        { icon: CheckSquare, title: 'Staff Attendance', desc: 'Biometric/geo-enabled tracking for domestic help.' },
        { icon: Headphones, title: 'Helpdesk Ticketing', desc: 'System for plumbing or electrical complaints.' },
        { icon: Calendar, title: 'Facility Booking', desc: 'Reserve clubhouses, gyms, or sports courts easily.' },
        { icon: Briefcase, title: 'Vendor Management', desc: 'Track society assets and preventive maintenance.' },
        { icon: FileText, title: 'Financial Ledgers', desc: 'Audit-ready P&L statements and transparent expenditure.' },
        { icon: Vote, title: 'Community Polls', desc: 'Vote on society upgrades and committee elections.' },
        { icon: Bell, title: 'Digital Notice Board', desc: 'Official society announcements with read receipts.' },
        { icon: Home, title: 'Resident Directory', desc: 'Verified database of owners, tenants, and emergency contacts.' }
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
