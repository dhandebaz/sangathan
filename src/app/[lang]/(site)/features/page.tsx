import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, ShieldCheck, Activity, Printer, Clock, Sparkles } from 'lucide-react'
import { InteractiveFeatures } from '@/components/features/interactive-features'
import { SoftwareApplicationJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'नागरिक सुविधाएं | संगठन' : 'Features & Movement Tools | Sangathan',
    description: isHindi
      ? 'नागरिक समूहों, पर्यावरण कार्यकर्ताओं, एनजीओ, छात्र संघों, श्रमिक संघों और RWA के लिए विशेष डिजिटल बुनियादी ढांचा।'
      : 'Purpose-built features for civic collectives, citizen science networks, NGOs, student unions, workers unions, and RWAs.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/features`,
      languages: {
        'en': 'https://sangathan.space/en/features',
        'hi': 'https://sangathan.space/hi/features',
      },
    },
  }
}

export default async function FeaturesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const orgs = [
    {
      id: 'civic_collective',
      title: isHindi ? 'नागरिक समूह व जमीनी आंदोलन' : 'Civic Collectives & Grassroots Movements',
      icon: 'Megaphone',
      color: 'rose',
      description: isHindi
        ? 'जमीनी अभियान, अनौपचारिक समूह, स्वतंत्र छात्र इकाइयां और आपसी-सहायता नेटवर्क। किसी पंजीकरण संख्या की आवश्यकता नहीं।'
        : 'Grassroots campaigns, informal collectives, activist coalitions, and mutual-aid networks. No registration number required.',
      features: [
        { icon: 'ShieldCheck', title: 'Bahujan Queer Foundation (BQF) Verification Pathway', desc: 'Milestone-based institutional verification from Bahujan Queer Foundation (Delhi Reg. Section 8 NGO • CIN: U88900DL2025NPL452474) for active grassroots collectives meeting verified ground audit and community criteria.' },
        { icon: 'Activity', title: 'Field Spot Audits & Sensor Logger', desc: 'Ground evidence and citizen science testing desk for air quality (PM2.5/PM10), water TDS, waste fires, and industrial emissions with GPS geotagging.' },
        { icon: 'Scale', title: 'Statutory Environmental Violation Notice Generator', desc: 'Instant AI drafting of formal legal representations citing the Air Act 1981, Water Act 1974, CAQM GRAP directives, and NGT compliance orders for DPCC, CPCB, and SDMs.' },
        { icon: 'Printer', title: '1-Page Printable Parcha & Physical Signature Sheets', desc: 'Generate high-contrast black-and-white flyers (पर्चे) formatted for ₹1 photostat/photocopy machines and physical pen-and-paper signature tables for colony chai stalls and parks.' },
        { icon: 'Clock', title: 'Stamped Receiving & 15-Day RTI Escalation Tracker', desc: 'Track stamped physical receiving copies from municipal ward offices with live countdown timers and 1-click Section 6(1) RTI application generator when authorities delay.' },
        { icon: 'Newspaper', title: 'Bilingual Press Release & Media Dispatch Studio', desc: 'Draft journalistic English & Hindi media releases with standard embargo headers, spokesperson quote blocks, and 1-click formatted WhatsApp media broadcast copy.' },
        { icon: 'FileText', title: 'AI Legal Government Representation Generator', desc: 'Instant AI drafting of legally sound government petitions referencing statutory provisions (DMC Act, Motor Vehicles Act, RTI) tailored for SDMs, Police Commissioners, and Municipal Bodies.' },
        { icon: 'Sparkles', title: 'Grassroots Survey & Goal Studio', desc: 'Build 1-click townhall polls, issue prioritization surveys, and volunteer pledges with live Sentiment Matrix and Participant PDF Dossiers.' },
        { icon: 'Globe', title: '1-Click Public Petition & Campaign Studio', desc: 'Publish open letters, campaigns, and drives with live signature counters and instant volunteer conversion hooks.' },
        { icon: 'Vote', title: 'Direct Democracy & Secret Voting Engine', desc: 'Secure, cryptographic anonymous secret ballots and leadership elections with instant tamper-evident tallies.' },
        { icon: 'Network', title: 'Joint Front & Coalition Engine (संयुक्त मोर्चा)', desc: 'Form alliances with other movements, co-sign joint representations, and publish shared public statements.' },
        { icon: 'ShieldAlert', title: 'Emergency SOS & Legal Rapid Response', desc: '1-tap emergency crisis trigger broadcasting GPS coordinates and detention notes to defense advocates with live response tracking.' },
        { icon: 'Database', title: 'Offline-First Field Organizer PWA', desc: 'Door-to-door membership intake and field grievance capture in zero-connectivity areas with automatic background queue sync.' },
        { icon: 'Award', title: 'Sharable Verified Member Badges', desc: 'Dynamic, customizable credentials for Instagram, Twitter/X, and WhatsApp with QR-verified organizational designation.' },
        { icon: 'Users', title: 'Volunteer & Working Group Desks', desc: 'Coordinate volunteers, assign field actions, and manage decentralized working subgroups and committees.' },
        { icon: 'Users', title: 'Granular Team Roles & Permission-Based Dashboards', desc: 'Can Comment, Can Edit, Can Manage, and Second Admin roles — every member sees a dashboard tailored to exactly what they are allowed to do.' },
        { icon: 'Building2', title: 'Local Government Authority Directory', desc: 'Searchable directory of municipal, police, PWD, and utility authorities that auto-matches every complaint to the right department and official.' },
        { icon: 'Sparkles', title: 'AI Complaint Photo Analysis', desc: 'Instant AI detection of issue type, affected department, and urgency from complaint photos with a confidence score.' },
        { icon: 'Printer', title: 'Formal Complaint Print & Delivery Tracking', desc: 'Generate official print-ready complaint letters addressed to the relevant authority, with hand or email delivery tracking.' },
        { icon: 'Sparkles', title: 'Sangathan AI Assistance & Minutes Extraction', desc: 'Draft meeting minutes, extract action items, and synthesize lengthy policy proposals with absolute data isolation.' },
        { icon: 'Lock', title: '1-Click Full Sovereign Data Export', desc: 'Export complete resolution records, votes, and member logs in open JSON/CSV formats anytime with zero lock-in.' },
        { icon: 'Smartphone', title: 'All-In-One Public Portal & Native PWA Installation', desc: 'Transform public org profiles into complete standalone web portals with native tabbed feeds, 1-tap UPI Chanda donation sheets, and instant Android/iOS homescreen app installation.' },
        { icon: 'Sparkles', title: 'AI & Vector Official Emblem Studio (2048px Export)', desc: 'Generate mathematically aligned circular statutory seals, modern crests, and letterhead-ready ink stamps with 1-click apply and 2048px high-resolution PNG downloads.' },
        { icon: 'ShieldCheck', title: 'Statutory Compliance & Government Readiness', desc: 'Legal entity sub-classification, validated statutory ID fields, compliance filings tracker, government API endpoints, and civic collective statutory knowledge hub.' }
      ]
    },
    {
      id: 'ngo',
      title: isHindi ? 'पंजीकृत स्वयंसेवी संगठन (NGO)' : 'Registered Non-Governmental Organisations',
      icon: 'Building2',
      color: 'emerald',
      description: isHindi
        ? 'अपने स्वयंसेवकों को प्रबंधित करें, पारदर्शी रूप से धन जुटाएं, और अपने दान दाताओं के साथ विश्वास बनाएं।'
        : 'Manage your volunteer base, raise funds transparently, and build unshakeable trust with your donors.',
      features: [
        { icon: 'Award', title: 'Cryptographic Volunteer Service Certificates', desc: 'Issue official volunteer recognition certificates with service hours recognized, digital verification seals, and tamper-proof SHA-256 hashes.' },
        { icon: 'DollarSign', title: 'Grant Tranche Accounting & Milestone Spend', desc: 'Track milestone tranche disbursements, line-item expenditures against sanctioned budgets, and real-time remaining balance accounting.' },
        { icon: 'Globe', title: '1-Click Public Petition & Campaign Studio', desc: 'Publish open letters, campaigns, and drives with live signature counters and instant volunteer conversion hooks.' },
        { icon: 'Award', title: 'Sharable Verified Member Badges', desc: 'Generate dynamic, customizable social media graphics for Instagram, Twitter/X, and WhatsApp Stories with cryptographic verification.' },
        { icon: 'Users', title: 'Team Invite System', desc: 'Invite members via email with shareable links. New members can accept and join instantly with role-based access.' },
        { icon: 'Users', title: 'Granular Roles & Permission-Based Dashboards', desc: 'Can Comment, Can Edit, Can Manage, and Second Admin roles with dashboards tailored to each member\'s permissions.' },
        { icon: 'Building2', title: 'Local Government Authority Directory', desc: 'Searchable directory of local authorities to auto-match complaints and requests to the correct department and official.' },
        { icon: 'Printer', title: 'Formal Complaint Print & Delivery Tracking', desc: 'Print-ready official complaint letters to authorities with hand or email delivery tracking for follow-up.' },
        { icon: 'ShieldCheck', title: 'Public Trust & Transparency Ledger', desc: 'Real-time fund utilization, programmatic expenditure bar charts, and SHA-256 verified receipt audit trails with 96/100 A+ rating.' },
        { icon: 'Sparkles', title: 'Sangathan AI Grant & CSR Matcher', desc: 'Automatically scan open government schemes and CSR funds, compute match score %, and generate structured grant application drafts.' },
        { icon: 'Smartphone', title: 'Telegram Conversational Bot & Webhook Engine', desc: 'Zero-configuration Telegram bot with instant grammY webhooks allowing supporters to log grievances, submit check-ins, or check dues via text.' },
        { icon: 'Database', title: 'Offline-First Field Organizer PWA', desc: 'Door-to-door membership intake and field grievance capture in zero-connectivity areas with automatic background queue sync.' },
        { icon: 'AlertTriangle', title: 'Emergency SOS & Legal Rapid Response', desc: '1-tap emergency crisis trigger broadcasting GPS coordinates and detention notes to defense advocates with live response tracking.' },
        { icon: 'Zap', title: 'No-Code Event-Driven Automations', desc: 'Visual Trigger → Condition → Action workflow builder with prebuilt recipes for instant onboarding and rapid SOS alerts.' },
        { icon: 'Lock', title: 'Defensive Permission Guards & Dual Approvals', desc: 'Cryptographically linked immutable audit chain with mandatory dual-approval workflows for high-risk operations.' },
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
        { icon: 'ShieldCheck', title: 'Helpdesk Support', desc: 'Centralized inbox for public and beneficiary inquiries.' },
        { icon: 'CreditCard', title: 'Scalable Cadre Capacity & Pay-As-You-Grow (₹11/Cadre)', desc: '500 active cadre slots included in base Sustainer plan with transparent ₹11/cadre/month capacity expansion for large movements and federations.' },
        { icon: 'CreditCard', title: 'Subscription & Plan Capacity Governance', desc: 'Predictable tier scaling, live member slot meters, automated receipt archiving, and multi-org enterprise capabilities.' },
        { icon: 'Sparkles', title: 'Civic Form & Survey Studio', desc: 'Deploy volunteer skills intake, beneficiary assessments, and donor feedback forms with live Goal Consensus % and Participant PDF Dossiers.' },
        { icon: 'FileSpreadsheet', title: 'Live Google Workspace & CSV Importer', desc: 'Import members via live Google People API (1-click contact selection), authenticated Google Sheets API (private sheet access), or traditional CSV upload. Includes automated column matching, phone validation, and deduplication.' },
        { icon: 'FileText', title: 'Live Google Forms API Migrator', desc: 'Import Google Forms directly via the Forms API — auto-pulls form structure (questions, field types, options) and all historical responses. Also supports CSV paste and response sheet link methods.' },
        { icon: 'FolderLock', title: 'Institutional Document & Asset Vault', desc: 'Encrypted cloud storage for Trust Deeds, 12A/80G tax orders, CSR-1 certificates, and property conveyance deeds with role permissions.' },
        { icon: 'Printer', title: 'Statutory PDF Registers & Audit Books', desc: '1-click export of official Form I Member Rolls, Form H Returns, and Double-Entry Cash Books formatted for government inspections.' },
        { icon: 'MapPin', title: 'National Geo Engine (780+ Districts)', desc: 'Pre-populated registry of all 28 Indian States, 8 UTs, and 780+ administrative districts with ISO codes and SDG sector taxonomies.' },
        { icon: 'Globe', title: 'Public SEO & AI Search Engine Citability', desc: 'Schema.org JSON-LD structured data, dynamic Edge OpenGraph image previews, and high-signal public profiles indexed across Google, Bing, and AI answer engines.' },
        { icon: 'FileText', title: 'Smart Compliance Tracker', desc: 'Auto-suggests 12A, 80G, FCRA based on actual usage and donations.' },
        { icon: 'ShieldCheck', title: 'Legal Identity & Compliance Engine', desc: 'Manage statutory registrations (PAN, CIN, GSTIN) and compliance filings with upcoming direct Government API integrations.' },
        { icon: 'Smartphone', title: 'All-In-One Public Portal & Native PWA Installation', desc: 'Transform public org profiles into complete standalone web portals with native tabbed feeds, 1-tap UPI Chanda donation sheets, and instant Android/iOS homescreen app installation.' },
        { icon: 'Sparkles', title: 'AI & Vector Official Emblem Studio (2048px Export)', desc: 'Generate mathematically aligned circular statutory seals, modern crests, and letterhead-ready ink stamps with 1-click apply and 2048px high-resolution PNG downloads.' },
        { icon: 'ShieldCheck', title: 'Statutory Compliance & Government Readiness', desc: 'Legal entity sub-classification, validated statutory ID fields, compliance filings tracker, government API endpoints, and statutory knowledge hub.' }
      ]
    },
    {
      id: 'student_union',
      title: isHindi ? 'छात्र संघ' : 'Student Unions',
      icon: 'GraduationCap',
      color: 'indigo',
      description: isHindi
        ? 'छात्रों की आवाज़ को संगठित करें। सुरक्षित चुनाव कराएं और कैंपस की समस्याओं को ट्रैक करें।'
        : 'Organise the student voice. Conduct secure elections, track campus grievances, and manage events.',
      features: [
        { icon: 'Vote', title: 'Booth-by-Booth Live Election Counting Desk', desc: 'Round-by-round and booth-by-booth vote count logger with live candidate leads and automated election return certificates.' },
        { icon: 'Home', title: 'Hostel & Mess Quality Inspection Portal', desc: 'Daily meal ratings (1-5★), room vacancy tracking, photo evidence logs, and direct escalation to Warden / Dean offices.' },
        { icon: 'Sparkles', title: 'Campus Mess & Grievance Survey Studio', desc: '1-click mess food quality rating scales, academic grievance forms, and student sentiment analytics with executive committee PDF reports.' },
        { icon: 'Globe', title: '1-Click Public Petition & Campaign Studio', desc: 'Publish public campus representations with live signature counters, 1-click volunteer conversion hooks, and inter-union solidarity endorsements.' },
        { icon: 'FileSpreadsheet', title: 'Batch Student Roster Importer', desc: 'Instantly import campus batches, hostel rosters, and department lists from CSV/Excel with auto-phone validation.' },
        { icon: 'FolderLock', title: 'Campus Document & MoU Vault', desc: 'Secure repository for university representations, administrative agreements, and legal aid case files.' },
        { icon: 'Award', title: 'Sharable Verified Member Badges', desc: 'Generate dynamic social media graphics for Instagram, Twitter/X, and WhatsApp Stories with verified union designations and cryptographic QR codes.' },
        { icon: 'Users', title: 'Team Invite System', desc: 'Invite members via email with shareable links. New members can accept and join instantly with role-based access.' },
        { icon: 'Users', title: 'Granular Team Roles & Permission-Based Dashboards', desc: 'Can Comment, Can Edit, Can Manage, and Second Admin roles tailored to campus committee structures.' },
        { icon: 'Building2', title: 'Campus Authority & Department Directory', desc: 'Directory of university offices and local authorities to auto-match campus grievances to the right office.' },
        { icon: 'Printer', title: 'Formal Grievance Print & Delivery Tracking', desc: 'Official print-ready grievance letters to VC, Dean, and Warden offices with delivery tracking.' },
        { icon: 'Smartphone', title: 'Telegram Conversational Bot & Console', desc: 'Bilingual Telegram bot and console for campus grievances, event attendance, and emergency SOS detention alerts.' },
        { icon: 'Database', title: 'Offline-First Field Organizer PWA', desc: 'Hostel-to-hostel and gate desk onboarding in zero-connectivity environments with automatic background synchronization.' },
        { icon: 'ShieldAlert', title: 'Emergency SOS & Legal Rapid-Response', desc: '1-tap protest detention alert broadcasting GPS coordinates to volunteer advocates with live thana response tracking.' },
        { icon: 'Sparkles', title: 'Sangathan AI Grant & Welfare Matcher', desc: 'Scan UGC and government student welfare grants with 1-click structured AI proposal draft generation.' },
        { icon: 'Database', title: 'Central Student DB & HEI Directory', desc: 'Pre-populated Indian government institutions database including JMI, JNU, DU, BHU, IITs & NITs with support for both official unions and independent collectives.' },
        { icon: 'Printer', title: 'Official Union Letterhead & PDF Exporter', desc: 'Customizable emblem header, reference number generator (SU/2026/08/XXX), recipient block, and print-ready Gyapan & press release layout.' },
        { icon: 'Network', title: 'Joint Front & Co-Signed Protests (संयुक्त मोर्चा)', desc: 'Multi-org alliance hub for co-signing Gyapan representations, organizing joint rallies, and publishing co-authored press statements.' },
        { icon: 'FileText', title: 'RTI & Action Taken Report (ATR) Assistant', desc: 'RTI Act 2005 pre-formatted legal query generator and VC/Dean commitment deadline tracker.' },
        { icon: 'Shield', title: 'Legal Aid & Anti-Ragging Cell', desc: 'Emergency protest detention SOS trigger, volunteer advocate directory, and anonymous UGC-compliant anti-ragging desk.' },
        { icon: 'Megaphone', title: 'Campus Campaigning & Mobilization Suite', desc: 'Hostel-to-Hostel (H2H) canvassing manager, Class-to-Class (C2C) lecture campaign scheduler, and poster wall allocation.' },
        { icon: 'UserCheck', title: 'On-Ground Member Induction Drive', desc: 'Kiosk desk mode for canteen/gate booths, scannable QR posters, and paper slip batch intake for rapid campus onboarding.' },
        { icon: 'Badge', title: 'Union Posts (पद) & Designation Registry', desc: 'Pre-configured designations (President, Vice President, General Secretary, Coordinator, Convener) plus custom post type creation.' },
        { icon: 'Lock', title: 'Digital ID Cards', desc: 'Cryptographically secure digital IDs with QR access.' },
        { icon: 'Users', title: 'Role-Based Governance', desc: 'Tiered access for executives, presidents, and students.' },
        { icon: 'Vote', title: 'Secure Online Voting', desc: 'End-to-end verifiable, anonymous elections.' },
        { icon: 'Scale', title: 'Lyngdoh Compliance Audit', desc: 'Automated Supreme Court mandate checks for candidate age limits, attendance thresholds, and ₹5,000 expense caps.' },
        { icon: 'FileText', title: 'Gyapan (ज्ञापन) Memorandum Builder', desc: 'Draft formal representations to VCs, Deans, and Wardens with digital student signature petitions.' },
        { icon: 'AlertTriangle', title: 'Hostel & Mess Grievances', desc: 'Ticketing system for academic, hostel allotment, mess quality, and campus disputes.' },
        { icon: 'Ticket', title: 'Event Ticketing & RSVPs', desc: 'Manage campus events, QR check-ins, and waitlists.' },
        { icon: 'Wallet', title: 'Club Sub-funding', desc: 'Allow societies to request and track micro-budgets.' },
        { icon: 'CreditCard', title: 'Subscription & Plan Capacity Governance', desc: 'Predictable campus scaling, live member slot meters, automated receipt archiving, and multi-org capabilities.' },
        { icon: 'Globe', title: 'Public SEO & OpenGraph Social Previews', desc: 'Schema.org structured data, dynamic 1200x630 social preview cards for WhatsApp/Twitter, and high-signal public profiles.' },
        { icon: 'FileText', title: 'Proposals & Bills', desc: 'Draft, debate, and pass union resolutions democratically.' },
        { icon: 'Smartphone', title: 'All-In-One Public Portal & Native PWA Installation', desc: 'Transform public org profiles into complete standalone web portals with native tabbed feeds, 1-tap UPI Chanda donation sheets, and instant Android/iOS homescreen app installation.' },
        { icon: 'Sparkles', title: 'AI & Vector Official Emblem Studio (2048px Export)', desc: 'Generate mathematically aligned circular statutory seals, modern crests, and letterhead-ready ink stamps with 1-click apply and 2048px high-resolution PNG downloads.' },
        { icon: 'ShieldCheck', title: 'Statutory Compliance & Government Readiness', desc: 'Legal entity sub-classification, validated statutory ID fields, compliance filings tracker, government API endpoints, and statutory knowledge hub.' }
      ]
    },
    {
      id: 'workers_union',
      title: isHindi ? 'श्रमिक संघ' : 'Workers Unions',
      icon: 'HardHat',
      color: 'amber',
      description: isHindi
        ? 'मज़दूरों के अधिकारों की रक्षा करें। सामूहिक सौदेबाजी (CBA) और हड़तालों का समन्वय करें।'
        : 'Protect worker rights with power. Coordinate collective bargaining, track dues, and organise actions.',
      features: [
        { icon: 'Scale', title: 'Trade Disputes & ALC Conciliation Tracker', desc: 'Manage workplace disputes and statutory conciliation stages under the Industrial Disputes Act (Works Committee → ALC → Labour Court → Industrial Tribunal).' },
        { icon: 'FileText', title: 'CBA Clause-by-Clause Redlining Studio', desc: 'Bipartite collective bargaining agreement builder with clause-by-clause union demands, management counter-offers, and agreed settlements.' },
        { icon: 'Sparkles', title: 'Shop-Floor Hazard & CBA Priority Studio', desc: 'Confidential workplace safety complaint forms and collective bargaining priority surveys with instant grievance escalation alerts.' },
        { icon: 'Globe', title: '1-Click Public Petition & Campaign Studio', desc: 'Launch wage defense and collective strike petitions with live signature counts and volunteer conversion.' },
        { icon: 'FileSpreadsheet', title: 'Factory Floor CSV / Excel Importer', desc: 'Import thousands of shift workers and shop floor delegates from spreadsheets with automatic duplicate cleansing.' },
        { icon: 'FolderLock', title: 'CBA & Bipartite Document Vault', desc: 'Encrypted storage for Collective Bargaining Agreements, strike notices, and wage settlement deeds.' },
        { icon: 'Printer', title: 'Form H Annual General Return Ledger', desc: 'Official print-ready Trade Unions Act 1926 membership and subscription ledger for Labour Commissioner audits.' },
        { icon: 'Award', title: 'Sharable Verified Member Badges', desc: 'Verified shop steward and member credentials formatted for WhatsApp and Twitter/X.' },
        { icon: 'Users', title: 'Team Invite System', desc: 'Invite members via email with shareable links. New members can accept and join instantly with role-based access.' },
        { icon: 'Users', title: 'Granular Team Roles & Permission-Based Dashboards', desc: 'Can Comment, Can Edit, Can Manage, and Second Admin roles for shop stewards and executives.' },
        { icon: 'Building2', title: 'Labour Authority & Department Directory', desc: 'Directory of labour commissioner offices, tribunals (ALC/RLC/CGIT), and factory inspectorates for grievance routing.' },
        { icon: 'Printer', title: 'Formal Grievance Print & Delivery Tracking', desc: 'Official print-ready grievance and complaint letters to labour authorities with delivery tracking.' },
        { icon: 'Smartphone', title: 'Telegram Conversational Bot & Console', desc: 'Bilingual Telegram bot for grievance logging, strike ballot casting, and dues status inquiries via messaging.' },
        { icon: 'Database', title: 'Offline-First Field Organizer PWA', desc: 'Factory gate and construction site worker intake in low-connectivity areas with automatic queue sync.' },
        { icon: 'AlertTriangle', title: 'Emergency SOS & Legal Rapid Response', desc: '1-tap emergency alert for unlawful worker detention with GPS broadcast to labor defense advocates.' },
        { icon: 'ShieldCheck', title: 'Public Trust & Transparency Ledger', desc: 'Audited strike relief fund ledger and worker welfare accounting with SHA-256 verified receipts.' },
        { icon: 'Users', title: 'Member Database', desc: 'Track employment history, standing, and certifications.' },
        { icon: 'Wallet', title: 'Automated Dues Collection', desc: 'Manage percentage or flat dues, with delinquency alerts.' },
        { icon: 'Scale', title: 'Grievance Case Mgmt', desc: 'Track workplace disputes through arbitration stages.' },
        { icon: 'Briefcase', title: 'CBA Contract Tracking', desc: 'Central repository for redlining and negotiation prep.' },
        { icon: 'Megaphone', title: 'Strike Coordination', desc: 'Workplace mapping and picket line organization.' },
        { icon: 'Vote', title: 'Secure Polling', desc: 'Conduct strike ballots and leadership elections.' },
        { icon: 'HardHat', title: 'Worker Dispatch System', desc: 'Match member skills to employer job requirements.' },
        { icon: 'Building2', title: 'Employer Management', desc: 'Monitor contract compliance across signatory companies.' },
        { icon: 'BadgeAlert', title: 'Shop Steward Roles', desc: 'Granular permissions for field representatives.' },
        { icon: 'CreditCard', title: 'Subscription & Plan Capacity Governance', desc: 'Predictable union dues budgeting, member slot tracking, and multi-branch federation tools.' },
        { icon: 'Globe', title: 'Public Union Directory & Schema.org Graph', desc: 'Indexed union representations, public solidarity petitions, and verified collective bargaining records.' },
        { icon: 'ShieldCheck', title: 'Labor Law Compliance', desc: 'Automated checks against union regulations.' },
        { icon: 'Smartphone', title: 'All-In-One Public Portal & Native PWA Installation', desc: 'Transform public org profiles into complete standalone web portals with native tabbed feeds, 1-tap UPI Chanda donation sheets, and instant Android/iOS homescreen app installation.' },
        { icon: 'Sparkles', title: 'AI & Vector Official Emblem Studio (2048px Export)', desc: 'Generate mathematically aligned circular statutory seals, modern crests, and letterhead-ready ink stamps with 1-click apply and 2048px high-resolution PNG downloads.' },
        { icon: 'ShieldCheck', title: 'Statutory Compliance & Government Readiness', desc: 'Legal entity sub-classification, validated statutory ID fields, compliance filings tracker, government API endpoints, and statutory knowledge hub.' }
      ]
    },
    {
      id: 'rwa',
      title: isHindi ? 'आवासीय कल्याण संघ (RWA)' : 'Resident Welfare Association (RWA)',
      icon: 'Home',
      color: 'sky',
      description: isHindi
        ? 'अपने पड़ोस को बेहतर बनाएं। रखरखाव, आगंतुक और सामुदायिक मतदान प्रबंधित करें।'
        : 'Modernise your neighbourhood. Manage maintenance, visitors, and democratic community polling.',
      features: [
        { icon: 'UserCheck', title: 'Domestic Staff Directory & Digital Gate Passes', desc: 'Manage maids, drivers, cooks, and guards with police verification tags, flat associations, and instant pass code verification.' },
        { icon: 'Wrench', title: 'Society Asset AMC & Statutory NOC Tracker', desc: 'Countdown alerts for passenger lift servicing, DG generator AMCs, fire safety NOC validity, and water tank sanitation audits.' },
        { icon: 'Receipt', title: 'Automated Batch Maintenance Invoicing', desc: '1-click generation of monthly maintenance invoices for all occupied units (per sqft or fixed flat rate) with UPI payment links.' },
        { icon: 'Sparkles', title: 'Colony Resident Census & Safai Survey Studio', desc: 'Resident directory census and colony maintenance satisfaction surveys with Likert rating scales and individual flat dossier printouts.' },
        { icon: 'Receipt', title: 'Maintenance Billing', desc: 'Automated invoices based on flat size and late fees.' },
        { icon: 'FileSpreadsheet', title: 'Spreadsheet Flat & Resident Importer', desc: 'Bulk import flat numbers, owner contacts, and tenant directories from Excel in 60 seconds.' },
        { icon: 'FolderLock', title: 'Society Deed & Resolution Vault', desc: 'Centralized repository for builder handover deeds, AGM meeting minutes, fire safety NOCs, and lift licenses.' },
        { icon: 'Printer', title: 'Form I Statutory Member Register', desc: 'Official Societies Registration Act compliant membership book ready for annual registrar filings.' },
        { icon: 'Wallet', title: 'Online Payment Gateway', desc: 'Collect dues via UPI/Cards with auto-reconciliation.' },
        { icon: 'Users', title: 'Team Invite System', desc: 'Invite members via email with shareable links. New members can accept and join instantly with role-based access.' },
        { icon: 'Users', title: 'Granular Team Roles & Permission-Based Dashboards', desc: 'Can Comment, Can Edit, Can Manage, and Second Admin roles for the managing committee and residents.' },
        { icon: 'Building2', title: 'Local Government Authority Directory', desc: 'Directory of MCD, DJB, BSES, PWD, and police authorities to route maintenance and civic complaints to the right department.' },
        { icon: 'Sparkles', title: 'AI Complaint Photo Analysis', desc: 'Instant AI analysis of complaint photos (waterlogging, safai, damage) detecting issue and urgency automatically.' },
        { icon: 'Printer', title: 'Formal Complaint Print & Delivery Tracking', desc: 'Official print-ready complaint letters to municipal and utility authorities with hand or email delivery tracking.' },
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
        { icon: 'CreditCard', title: 'Subscription & Plan Capacity Governance', desc: 'Predictable society scaling, resident capacity meters, and transparent audit trails.' },
        { icon: 'Globe', title: 'Public RWA Portal & SEO Discoverability', desc: 'Public community noticeboard, verified estate representation, and search-optimized public registry.' },
        { icon: 'FileText', title: 'Smart Compliance Tracker', desc: 'Auto-suggests renewals and NOCs based on maintenance and facility usage.' },
        { icon: 'Lock', title: 'Social OAuth', desc: 'Frictionless member onboarding via Google and X.' },
        { icon: 'ShieldCheck', title: 'Enterprise Security', desc: 'Role-based access and strict data isolation.' },
        { icon: 'Zap', title: 'Sangathan AI Assistive Intelligence', desc: 'Smart summaries, meeting minutes extraction, form sentiment analysis, and proposal analysis with master organization control.' },
        { icon: 'Smartphone', title: 'All-In-One Public Portal & Native PWA Installation', desc: 'Transform public org profiles into complete standalone web portals with native tabbed feeds, 1-tap UPI Chanda donation sheets, and instant Android/iOS homescreen app installation.' },
        { icon: 'Sparkles', title: 'AI & Vector Official Emblem Studio (2048px Export)', desc: 'Generate mathematically aligned circular statutory seals, modern crests, and letterhead-ready ink stamps with 1-click apply and 2048px high-resolution PNG downloads.' },
        { icon: 'ShieldCheck', title: 'Statutory Compliance & Government Readiness', desc: 'Legal entity sub-classification, validated statutory ID fields, compliance filings tracker, government API endpoints, and statutory knowledge hub.' }
      ]
    }
  ]

  return (
    <div className="bg-white min-h-screen">
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd items={[
        { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
        { name: isHindi ? 'सुविधाएं' : 'Features', url: `https://sangathan.space/${lang}/features` },
      ]} />
      
      {/* Crisp, light, geometric technical header design with leader anchor */}
      <div className="border-b border-slate-200 bg-gradient-to-b from-slate-50/70 via-white to-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8 text-center lg:text-left space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {isHindi 
                  ? 'हर आंदोलनकारी और नागरिक समूह की डिजिटल ताकत' 
                  : 'Every Tool an Organizer Needs to Build Power and Win.'}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {isHindi 
                  ? 'नागरिक समूहों, पंजीकृत एनजीओ, छात्र संघों, श्रमिक संघों और आरडब्ल्यूए के लिए विशेष मॉड्यूल — 1-टैप फील्ड जांच व ₹1 पर्चे से लेकर गुप्त मतदान और वैधानिक 80G लेजर तक।' 
                  : 'Purpose-built for civic collectives, NGOs, student unions, workers unions, and RWAs. From 1-tap spot audits and ₹1 printable Parchas to secret ballots and 80G tax receipts.'}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2 text-xs font-medium text-slate-600">
                <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded">
                  <Activity className="w-3.5 h-3.5 text-rose-600" /> Sensor Audits
                </span>
                <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded">
                  <Printer className="w-3.5 h-3.5 text-slate-700" /> ₹1 A4 Parchas
                </span>
                <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> 15-Day RTI Tracker
                </span>
                <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> BQF Sec 8 Protection
                </span>
              </div>
            </div>

            {/* Right Leader Box */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-full max-w-[260px] sm:max-w-[300px] bg-slate-50 border border-slate-200 rounded-lg p-3 shadow-xs">
                <div className="relative w-full h-[280px] sm:h-[320px] flex items-end justify-center">
                  <Image
                    src="/images/activist-leader.png"
                    alt="Ground Movement Leader - Sangathan Features"
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-contain object-bottom"
                    priority
                  />
                </div>
                <div className="text-center pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-slate-900 block font-mono">
                    Zero Tech Friction • 100% Ground Ready
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <InteractiveFeatures orgs={orgs} isHindi={isHindi} lang={lang} />
      </div>

      {/* Internal SEO Solutions & Comparisons Discovery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {isHindi ? 'विशेष संगठन समाधान व ब्लूप्रिंट्स' : 'Specialized Movement Solutions'}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                {isHindi
                  ? 'नागरिक समूहों, एनजीओ, छात्र संघों, ट्रेड यूनियनों और आरडब्ल्यूए के लिए पूर्ण वैधानिक समाधान और टूल्स।'
                  : 'Explore purpose-built landing pages and step-by-step ground playbooks for each organization archetype.'}
              </p>
            </div>
            <Link
              href={`/${lang}/solutions`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <span>{isHindi ? 'सभी समाधान एक्सप्लोर करें →' : 'Explore All Solutions →'}</span>
            </Link>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {isHindi ? 'संगठन बनाम अन्य सॉफ्टवेयर' : 'Sangathan vs Other Platforms'}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                {isHindi
                  ? 'देखें कि संगठन कैसे एक्शन नेटवर्क, नेशनबिल्डर, एवरीएक्शन, मोबिलाइज, CiviCRM और मायगेट से बेहतर है।'
                  : 'Compare Sangathan against Action Network, NationBuilder, EveryAction, Mobilize, CiviCRM, MyGate, and WhatsApp.'}
              </p>
            </div>
            <Link
              href={`/${lang}/compare`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <span>{isHindi ? 'सभी तुलनाएं देखें →' : 'View Head-to-Head Comparisons →'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
