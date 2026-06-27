import { Metadata } from 'next'
import { InteractiveFeatures } from '@/components/features/interactive-features'

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
      icon: 'Building2',
      color: 'indigo',
      description: isHindi 
        ? 'अपने स्वयंसेवकों को प्रबंधित करें, पारदर्शी रूप से धन जुटाएं, और अपने दान दाताओं के साथ विश्वास बनाएं।'
        : 'Manage your volunteer base, raise funds transparently, and build unshakeable trust with your donors.',
      features: [
        { icon: 'Database', title: 'Donor CRM Database', desc: 'Centralized profiles, giving history, and engagement tracking.' },
        { icon: 'Wallet', title: 'Donation Ledger', desc: 'Process one-time, recurring, and offline contributions.' },
        { icon: 'Receipt', title: 'Tax Receipts Automation', desc: 'Auto-generate 80G/501c3 compliant tax receipts for donors.' },
        { icon: 'Briefcase', title: 'Grant Tracking', desc: 'Manage grant applications and monitor fund utilization.' },
        { icon: 'ShieldCheck', title: 'Audit-Ready Ledgers', desc: 'Automated cash books and government compliance reporting.' },
        { icon: 'Users', title: 'Volunteer Registry', desc: 'Onboard volunteers, track skills, and log service hours.' },
        { icon: 'CheckSquare', title: 'Task & Workflow', desc: 'Assign field tasks and track project milestones.' },
        { icon: 'LineChart', title: 'Impact Analytics', desc: 'Dashboards measuring outcomes and ROI for funders.' },
        { icon: 'Megaphone', title: 'Campaign Management', desc: 'Goal-based peer-to-peer and public fundraising drives.' },
        { icon: 'ClipboardList', title: 'Field Forms & Surveys', desc: 'Offline-capable data collection for field workers.' },
        { icon: 'Network', title: 'Chapters & Subgroups', desc: 'Organise large NGOs by city chapters or wings.' },
        { icon: 'Headphones', title: 'Helpdesk Support', desc: 'Centralized inbox for public and beneficiary inquiries.' },
        { icon: 'ShieldCheck', title: 'Certificate Compliance Tracker', desc: 'Track 12A, 80G, FCRA and other statutory certifications with document uploads.' },
        { icon: 'Lock', title: 'Social OAuth', desc: 'Frictionless member onboarding via Google and X.' },
        { icon: 'ShieldCheck', title: 'Enterprise Security', desc: 'Role-based access and strict data isolation.' },
        { icon: 'Sparkles', title: 'AI-Powered Intelligence', desc: 'Smart summaries, social content generation, meeting minutes, form analysis, personalized notifications, and proposal analysis.' }
      ]
    },
    {
      id: 'student-union',
      title: isHindi ? 'छात्र संघ' : 'Student Unions',
      icon: 'GraduationCap',
      color: 'emerald',
      description: isHindi 
        ? 'छात्रों की आवाज़ को संगठित करें। सुरक्षित चुनाव कराएं और कैंपस की समस्याओं को ट्रैक करें।'
        : 'Organise the student voice. Conduct secure elections, track campus grievances, and manage events.',
      features: [
        { icon: 'Database', title: 'Central Student DB', desc: 'A verified database syncing with university enrollment.' },
        { icon: 'Lock', title: 'Digital ID Cards', desc: 'Cryptographically secure digital IDs with QR access.' },
        { icon: 'Users', title: 'Role-Based Governance', desc: 'Tiered access for executives, presidents, and students.' },
        { icon: 'Vote', title: 'Secure Online Voting', desc: 'End-to-end verifiable, anonymous elections.' },
        { icon: 'AlertTriangle', title: 'Grievance Redressal', desc: 'Ticketing system for academic and hostel complaints.' },
        { icon: 'Ticket', title: 'Event Ticketing & RSVPs', desc: 'Manage campus events, QR check-ins, and waitlists.' },
        { icon: 'Wallet', title: 'Club Sub-funding', desc: 'Allow societies to request and track micro-budgets.' },
        { icon: 'FileText', title: 'Proposals & Bills', desc: 'Draft, debate, and pass union resolutions democratically.' },
        { icon: 'ClipboardList', title: 'Meeting Minutes', desc: 'Public ledger of committee proceedings and votes.' },
        { icon: 'Network', title: 'Clubs & Societies', desc: 'Mini-dashboards for sub-groups to manage members.' },
        { icon: 'Bell', title: 'Campus Notices', desc: 'Official noticeboard for urgent student updates.' },
        { icon: 'Megaphone', title: 'Multi-channel Alerts', desc: 'Push notifications and SMS for rapid mobilization.' },
        { icon: 'ShieldCheck', title: 'University Compliance', desc: 'Track charter agreements, election reports, and mandatory committee formations.' },
        { icon: 'Lock', title: 'Social OAuth', desc: 'Frictionless member onboarding via Google and X.' },
        { icon: 'ShieldCheck', title: 'Enterprise Security', desc: 'Role-based access and strict data isolation.' },
        { icon: 'Sparkles', title: 'AI-Powered Intelligence', desc: 'Smart summaries, social content generation, meeting minutes, form analysis, personalized notifications, and proposal analysis.' }
      ]
    },
    {
      id: 'worker-union',
      title: isHindi ? 'श्रमिक संघ' : 'Workers Unions',
      icon: 'HardHat',
      color: 'orange',
      description: isHindi 
        ? 'मज़दूरों के अधिकारों की रक्षा करें। सामूहिक सौदेबाजी (CBA) और हड़तालों का समन्वय करें।'
        : 'Protect worker rights with power. Coordinate collective bargaining, track dues, and organise actions.',
      features: [
        { icon: 'Users', title: 'Member Database', desc: 'Track employment history, standing, and certifications.' },
        { icon: 'Wallet', title: 'Automated Dues Collection', desc: 'Manage percentage or flat dues, with delinquency alerts.' },
        { icon: 'Scale', title: 'Grievance Case Mgmt', desc: 'Track workplace disputes through arbitration stages.' },
        { icon: 'Briefcase', title: 'CBA Contract Tracking', desc: 'Central repository for redlining and negotiation prep.' },
        { icon: 'Megaphone', title: 'Strike Coordination', desc: 'Workplace mapping and picket line organization.' },
        { icon: 'Vote', title: 'Secure Polling', desc: 'Conduct strike ballots and leadership elections.' },
        { icon: 'HardHat', title: 'Worker Dispatch System', desc: 'Match member skills to employer job requirements.' },
        { icon: 'Building2', title: 'Employer Management', desc: 'Monitor contract compliance across signatory companies.' },
        { icon: 'BadgeAlert', title: 'Shop Steward Roles', desc: 'Granular permissions for field representatives.' },
        { icon: 'ShieldCheck', title: 'Labor Law Compliance', desc: 'Automated checks against union regulations.' },
        { icon: 'Bell', title: 'Emergency SMS Alerts', desc: 'Urgent broadcasts for rapid member mobilization.' },
        { icon: 'GraduationCap', title: 'Training & Certs', desc: 'Manage apprenticeship programs and skill workshops.' },
        { icon: 'ShieldCheck', title: 'Labour Law Compliance', desc: 'Track Trade Union Act registration, annual returns, and strike notice clearance.' },
        { icon: 'Lock', title: 'Social OAuth', desc: 'Frictionless member onboarding via Google and X.' },
        { icon: 'ShieldCheck', title: 'Enterprise Security', desc: 'Role-based access and strict data isolation.' },
        { icon: 'Sparkles', title: 'AI-Powered Intelligence', desc: 'Smart summaries, social content generation, meeting minutes, form analysis, personalized notifications, and proposal analysis.' }
      ]
    },
    {
      id: 'rwa',
      title: isHindi ? 'रेजिडेंट वेलफेयर एसोसिएशन' : 'Resident Welfare Associations',
      icon: 'Home',
      color: 'cyan',
      description: isHindi 
        ? 'अपने पड़ोस को बेहतर बनाएं। रखरखाव, आगंतुक और सामुदायिक मतदान प्रबंधित करें।'
        : 'Modernise your neighbourhood. Manage maintenance, visitors, and democratic community polling.',
      features: [
        { icon: 'Receipt', title: 'Maintenance Billing', desc: 'Automated invoices based on flat size and late fees.' },
        { icon: 'Wallet', title: 'Online Payment Gateway', desc: 'Collect dues via UPI/Cards with auto-reconciliation.' },
        { icon: 'Users', title: 'Digital Visitor Log', desc: 'Gatekeeper app with photo capture and timestamps.' },
        { icon: 'Lock', title: 'Pre-approved Entry', desc: 'Residents approve guests or deliveries via the app.' },
        { icon: 'CheckSquare', title: 'Staff Attendance', desc: 'Biometric/geo-enabled tracking for domestic help.' },
        { icon: 'Headphones', title: 'Helpdesk Ticketing', desc: 'System for plumbing or electrical complaints.' },
        { icon: 'Calendar', title: 'Facility Booking', desc: 'Reserve clubhouses, gyms, or sports courts easily.' },
        { icon: 'Briefcase', title: 'Vendor Management', desc: 'Track society assets and preventive maintenance.' },
        { icon: 'FileText', title: 'Financial Ledgers', desc: 'Audit-ready P&L statements and transparent expenditure.' },
        { icon: 'Vote', title: 'Community Polls', desc: 'Vote on society upgrades and committee elections.' },
        { icon: 'Bell', title: 'Digital Notice Board', desc: 'Official society announcements with read receipts.' },
        { icon: 'Home', title: 'Resident Directory', desc: 'Verified database of owners, tenants, and emergency contacts.' },
        { icon: 'ShieldCheck', title: 'Society Compliance Dashboard', desc: 'Manage registration renewals, fire safety NOCs, lift certificates, and AGM filings.' },
        { icon: 'Lock', title: 'Social OAuth', desc: 'Frictionless member onboarding via Google and X.' },
        { icon: 'ShieldCheck', title: 'Enterprise Security', desc: 'Role-based access and strict data isolation.' },
        { icon: 'Sparkles', title: 'AI-Powered Intelligence', desc: 'Smart summaries, social content generation, meeting minutes, form analysis, personalized notifications, and proposal analysis.' }
      ]
    }
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* Crisp, light, geometric technical header design */}
      <div className="border-b border-slate-100 bg-slate-50/20 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {isHindi ? 'नागरिक समूहों के लिए तैयार की गई सुविधाएं' : 'Purpose-Built Features for Civic Collectives'}
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-normal">
            {isHindi 
              ? 'एनजीओ, छात्र संघों, श्रमिक संघों और आरडब्ल्यूए को प्रबंधित करने के लिए शक्तिशाली डिजिटल बुनियादी ढांचा।' 
              : 'Enterprise-grade digital infrastructure designed to empower NGOs, student unions, workers unions, and Resident Welfare Associations.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <InteractiveFeatures orgs={orgs} isHindi={isHindi} lang={lang} />
      </div>
    </div>
  )
}
