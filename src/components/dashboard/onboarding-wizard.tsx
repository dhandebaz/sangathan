'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles,
  ShieldCheck, Building2, Users, Scale, CreditCard,
  Rocket, Globe, Check, AlertCircle, Loader2, UploadCloud
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { finalizeSignup } from '@/actions/auth'
import { ORG_TYPES, OrgType } from '@/lib/org-types'
import { LegalEntityType, VALID_LEGAL_TYPES } from '@/lib/legal-entity-types'
import { LogoGeneratorModal } from '@/components/logo-generator/logo-generator-modal'

interface OnboardingWizardProps {
  lang: string
}

const ORG_DESCRIPTIONS: Record<OrgType, { en: string; hi: string }> = {
  civic_collective: {
    en: 'Grassroots campaigns, community mutual-aid, informal collectives & civic movements (Protected under Article 19(1)(c))',
    hi: 'जमीनी अभियान, सामुदायिक आपसी-सहायता, अनौपचारिक समूह और नागरिक आंदोलन (अनुच्छेद 19(1)(c) के तहत संरक्षित)',
  },
  ngo: {
    en: 'Registered trusts, societies, Section 8 non-profits with donor CRM, 80G tax receipts & compliance',
    hi: 'पंजीकृत ट्रस्ट, सोसायटियां, सेक्शन 8 संस्थाएं (दानदाता CRM, 80G रसीदें और वैधानिक अनुपालन)',
  },
  student_union: {
    en: 'Hostel & Mess audits, RTI/ATR assistant, election tallies & anti-ragging cell',
    hi: 'हॉस्टल और मेस ऑडिट, RTI/ATR सहायक, चुनाव गणना और एंटी-रैगिंग सेल',
  },
  workers_union: {
    en: 'Collective bargaining (CBA), strike ballots, workplace grievances & dues',
    hi: 'सामूहिक सौदेबाजी (CBA), हड़ताल मतदान, कार्यस्थल शिकायतें और शुल्क',
  },
  rwa: {
    en: 'Maintenance logs, estate operations, apartment management & community voting',
    hi: 'रखरखाव लॉग, संपत्ति संचालन, अपार्टमेंट प्रबंधन और सामुदायिक मतदान',
  },
}

export interface FocusBlueprint {
  id: string
  titleEn: string
  titleHi: string
  descEn: string
  descHi: string
  recommendedRoles: { value: string; labelEn: string; labelHi: string }[]
}

export const FOCUS_BLUEPRINTS: Record<OrgType, FocusBlueprint[]> = {
  civic_collective: [
    {
      id: 'colony_civic',
      titleEn: '1. Neighborhood & Colony Action',
      titleHi: '1. कॉलोनी व मोहल्ला सुधार',
      descEn: 'Roads, water, sanitation, 1-page signature sheets, physical parchas, and local Chanda.',
      descHi: 'सड़क, पानी, सीवर, सफाई, 1-पेज हस्ताक्षर पत्र, पर्चा और चंदा बहीखाता।',
      recommendedRoles: [
        { value: 'Lead Organizer', labelEn: 'Lead Organizer (मुख्य संयोजक)', labelHi: 'मुख्य संयोजक' },
        { value: 'Colony In-Charge', labelEn: 'Colony / Area In-Charge (इलाका प्रमुख)', labelHi: 'इलाका प्रमुख' },
        { value: 'Treasurer', labelEn: 'Treasurer / Chanda Custodian (कोषाध्यक्ष)', labelHi: 'कोषाध्यक्ष' },
        { value: 'Field Volunteer', labelEn: 'Field Volunteer (जमीनी स्वयंसेवक)', labelHi: 'जमीनी स्वयंसेवक' },
      ],
    },
    {
      id: 'citizen_science',
      titleEn: '2. Environmental & Citizen Science',
      titleHi: '2. पर्यावरण व प्रदूषण जांच',
      descEn: 'PM2.5 sensor testing, water TDS, DPCC/CPCB/NGT legal notices, and public health advisories.',
      descHi: 'PM2.5 सेंसर डेटा, जल गुणवत्ता, DPCC/CPCB/NGT वैधानिक नोटिस व जन स्वास्थ्य बुलेटिन।',
      recommendedRoles: [
        { value: 'Lead Researcher', labelEn: 'Lead Researcher / Scientist (मुख्य शोधकर्ता)', labelHi: 'मुख्य शोधकर्ता' },
        { value: 'Field Auditor', labelEn: 'Sensor & Field Auditor (फील्ड ऑडिटर)', labelHi: 'फील्ड ऑडिटर' },
        { value: 'Legal Convener', labelEn: 'Legal & NGT Convener (कानूनी संयोजक)', labelHi: 'कानूनी संयोजक' },
        { value: 'Media Spokesperson', labelEn: 'Media Spokesperson (मीडिया प्रवक्ता)', labelHi: 'मीडिया प्रवक्ता' },
      ],
    },
    {
      id: 'legal_defense',
      titleEn: '3. Human Rights & Legal Defense',
      titleHi: '3. मानवाधिकार व कानूनी सहायता',
      descEn: 'Protest SOS, thana detention logs, advocate dispatch, and BQF Section 8 recognition.',
      descHi: 'विरोध प्रदर्शन एसओएस, पुलिस थाना हिरासत ट्रैकर, वकील सहायता व BQF मान्यता।',
      recommendedRoles: [
        { value: 'Legal Cell Head', labelEn: 'Legal Defense In-Charge (कानूनी सेल प्रमुख)', labelHi: 'कानूनी सेल प्रमुख' },
        { value: 'Rights Advocate', labelEn: 'Advocate on Record (अधिवक्ता)', labelHi: 'अधिवक्ता' },
        { value: 'Emergency Coordinator', labelEn: 'Emergency SOS Dispatcher (आपातकालीन संयोजक)', labelHi: 'आपातकालीन संयोजक' },
        { value: 'Fact Finder', labelEn: 'Fact-Finding Researcher (तथ्यान्वेषी शोधकर्ता)', labelHi: 'तथ्यान्वेषी शोधकर्ता' },
      ],
    },
    {
      id: 'mass_campaigns',
      titleEn: '4. Mass Movements & Public Campaigns',
      titleHi: '4. जन आंदोलन व सार्वजनिक अभियान',
      descEn: '1-click public petitions, secret ballots, joint front coalitions, and media releases.',
      descHi: '1-क्लिक ऑनलाइन याचिकाएं, गुप्त मतदान, संयुक्त मोर्चा (गठबंधन) व प्रेस विज्ञप्ति।',
      recommendedRoles: [
        { value: 'Movement Convener', labelEn: 'Movement Convener (आंदोलन संयोजक)', labelHi: 'आंदोलन संयोजक' },
        { value: 'Campaign Lead', labelEn: 'Public Campaign Lead (अभियान प्रमुख)', labelHi: 'अभियान प्रमुख' },
        { value: 'Cadre In-Charge', labelEn: 'Cadre & Mobilization Head (काडर प्रमुख)', labelHi: 'काडर प्रमुख' },
        { value: 'Communications Head', labelEn: 'Press & Media Head (प्रचार प्रमुख)', labelHi: 'प्रचार प्रमुख' },
      ],
    },
  ],
  ngo: [
    {
      id: 'welfare_relief',
      titleEn: '1. Education, Health & Relief Welfare',
      titleHi: '1. शिक्षा, स्वास्थ्य व राहत कल्याण',
      descEn: 'Donor CRM, 80G tax receipts, volunteer hours, ration & medical aid distribution.',
      descHi: 'दानदाता CRM, 80G टैक्स रसीदें, स्वयंसेवक घंटे, राशन व चिकित्सा सहायता वितरण।',
      recommendedRoles: [
        { value: 'Executive Director', labelEn: 'Executive Director (प्रबंध निदेशक)', labelHi: 'प्रबंध निदेशक' },
        { value: 'Program Manager', labelEn: 'Program Manager (कार्यक्रम प्रबंधक)', labelHi: 'कार्यक्रम प्रबंधक' },
        { value: 'Volunteer Head', labelEn: 'Volunteer Coordinator (स्वयंसेवक समन्वयक)', labelHi: 'स्वयंसेवक समन्वयक' },
        { value: 'Finance Manager', labelEn: 'Finance / 80G Compliance Lead (वित्त प्रमुख)', labelHi: 'वित्त प्रमुख' },
      ],
    },
    {
      id: 'policy_thinktank',
      titleEn: '2. Policy Research & Advocacy Think-Tank',
      titleHi: '2. नीति अनुसंधान व लोक परामर्श',
      descEn: 'Research whitepapers, stakeholder submissions, policy consultation portals, and media.',
      descHi: 'शोध पत्र, हितधारक परामर्श, नीति मसौदे व मीडिया विज्ञप्तियां।',
      recommendedRoles: [
        { value: 'Research Director', labelEn: 'Research Director (शोध निदेशक)', labelHi: 'शोध निदेशक' },
        { value: 'Policy Fellow', labelEn: 'Senior Policy Fellow (नीति विशेषज्ञ)', labelHi: 'नीति विशेषज्ञ' },
        { value: 'Advocacy Lead', labelEn: 'Advocacy & Outreach Lead (परामर्श प्रमुख)', labelHi: 'परामर्श प्रमुख' },
        { value: 'Communications Lead', labelEn: 'Editorial & Media Lead (संपादकीय प्रमुख)', labelHi: 'संपादकीय प्रमुख' },
      ],
    },
    {
      id: 'livelihoods_shg',
      titleEn: '3. Community Development & SHGs',
      titleHi: '3. ग्रामीण विकास व स्वयं सहायता समूह (SHG)',
      descEn: 'Micro-grants, artisan & skill workshops, field surveys, and beneficiary tracking.',
      descHi: 'सूक्ष्म-अनुदान, कौशल प्रशिक्षण, फील्ड सर्वेक्षण और लाभार्थी सूची।',
      recommendedRoles: [
        { value: 'SHG Project Head', labelEn: 'SHG Project Head (परियोजना प्रमुख)', labelHi: 'परियोजना प्रमुख' },
        { value: 'Field Coordinator', labelEn: 'Field Coordinator (क्षेत्र समन्वयक)', labelHi: 'क्षेत्र समन्वयक' },
        { value: 'Community Organizer', labelEn: 'Community Mobilizer (सामुदायिक प्रेरक)', labelHi: 'सामुदायिक प्रेरक' },
        { value: 'Accounts Officer', labelEn: 'Accounts Officer (लेखा अधिकारी)', labelHi: 'लेखा अधिकारी' },
      ],
    },
    {
      id: 'animal_green',
      titleEn: '4. Animal Welfare & Green Action',
      titleHi: '4. पशु कल्याण व हरित पर्यावरण',
      descEn: 'Animal rescue emergency dispatch, shelter care logs, tree plantation audits, and vet records.',
      descHi: 'पशु बचाव आपातकालीन डिस्पैच, आश्रय लॉग, वृक्षारोपण ऑडिट व चिकित्सा रिकॉर्ड।',
      recommendedRoles: [
        { value: 'Shelter Manager', labelEn: 'Shelter / Rescue Manager (आश्रय प्रबंधक)', labelHi: 'आश्रय प्रबंधक' },
        { value: 'Rescue Lead', labelEn: 'Rescue Team Lead (बचाव दल प्रमुख)', labelHi: 'बचाव दल प्रमुख' },
        { value: 'Veterinary Coordinator', labelEn: 'Veterinary Coordinator (पशु चिकित्सा समन्वयक)', labelHi: 'पशु चिकित्सा समन्वयक' },
        { value: 'Adoption Lead', labelEn: 'Adoption & Foster Lead (गोद समन्वय)', labelHi: 'गोद समन्वय' },
      ],
    },
  ],
  student_union: [
    {
      id: 'campus_elections',
      titleEn: '1. Campus Elections & Lyngdoh Compliance',
      titleHi: '1. छात्र संघ चुनाव व लिंगदोह अनुपालन',
      descEn: 'Candidate nomination verification, expenditure caps, debate Q&A, and encrypted secret ballots.',
      descHi: 'उम्मीदवार नामांकन जांच, चुनावी खर्च सीमा, डिबेट प्रश्नोत्तरी और गुप्त मतदान।',
      recommendedRoles: [
        { value: 'Union President', labelEn: 'Student Union President (अध्यक्ष)', labelHi: 'अध्यक्ष' },
        { value: 'Election Commissioner', labelEn: 'Chief Election Commissioner (मुख्य चुनाव आयुक्त)', labelHi: 'मुख्य चुनाव आयुक्त' },
        { value: 'General Secretary', labelEn: 'General Secretary (महासचिव)', labelHi: 'महासचिव' },
        { value: 'Returning Officer', labelEn: 'Returning Officer (निर्वाचन अधिकारी)', labelHi: 'निर्वाचन अधिकारी' },
      ],
    },
    {
      id: 'hostel_mess',
      titleEn: '2. Hostel, Mess & Campus Welfare',
      titleHi: '2. हॉस्टल, मेस व कैम्पस कल्याण',
      descEn: 'Mess food quality spot audits, hostel maintenance tickets, warden resolution tracking.',
      descHi: 'मेस भोजन गुणवत्ता ऑडिट, हॉस्टल शिकायत टिकट, वार्डन समाधान ट्रैकर।',
      recommendedRoles: [
        { value: 'Mess Secretary', labelEn: 'Mess Secretary (मेस सचिव)', labelHi: 'मेस सचिव' },
        { value: 'Hostel Representative', labelEn: 'Hostel Representative (हॉस्टल प्रतिनिधि)', labelHi: 'हॉस्टल प्रतिनिधि' },
        { value: 'Welfare Convener', labelEn: 'Student Welfare Convener (कल्याण संयोजक)', labelHi: 'कल्याण संयोजक' },
        { value: 'Health Inspector', labelEn: 'Campus Health In-Charge (स्वास्थ्य निरीक्षक)', labelHi: 'स्वास्थ्य निरीक्षक' },
      ],
    },
    {
      id: 'academic_antiragging',
      titleEn: '3. Academic Rights & Anti-Ragging Cell',
      titleHi: '3. शैक्षणिक अधिकार व एंटी-रैगिंग सेल',
      descEn: 'Curriculum & exam petitions, anonymous ragging reporting, legal defense, and counseling.',
      descHi: 'परीक्षा याचिकाएं, गोपनीय एंटी-रैगिंग रिपोर्टिंग, कानूनी व मानसिक स्वास्थ्य सहायता।',
      recommendedRoles: [
        { value: 'Anti-Ragging In-Charge', labelEn: 'Anti-Ragging Cell In-Charge (एंटी-रैगिंग प्रमुख)', labelHi: 'एंटी-रैगिंग प्रमुख' },
        { value: 'Academic Secretary', labelEn: 'Academic Affairs Secretary (शैक्षणिक सचिव)', labelHi: 'शैक्षणिक सचिव' },
        { value: 'Counseling Lead', labelEn: 'Peer Counseling Lead (परामर्श प्रमुख)', labelHi: 'परामर्श प्रमुख' },
        { value: 'Faculty Liaison', labelEn: 'Faculty Liaison Delegate (संकाय प्रतिनिधि)', labelHi: 'संकाय प्रतिनिधि' },
      ],
    },
    {
      id: 'student_movement',
      titleEn: '4. Student Activism & Fee Agitations',
      titleHi: '4. छात्र आंदोलन व फीस वृद्धि विरोध',
      descEn: 'Campus Parchas, student general bodies (GBM), strike ballots, and national solidarity.',
      descHi: 'कैम्पस पर्चे, छात्र आम सभा (GBM), हड़ताल मतदान और एकजुटता मोर्चा।',
      recommendedRoles: [
        { value: 'Movement Convener', labelEn: 'Campus Movement Convener (आंदोलन संयोजक)', labelHi: 'आंदोलन संयोजक' },
        { value: 'Agitation Lead', labelEn: 'Direct Action Lead (आंदोलन प्रमुख)', labelHi: 'आंदोलन प्रमुख' },
        { value: 'Publications Secretary', labelEn: 'Parcha & Press Secretary (प्रचार सचिव)', labelHi: 'प्रचार सचिव' },
        { value: 'Solidarity Coordinator', labelEn: 'Inter-University Liaison (अंतर-विश्वविद्यालय संयोजक)', labelHi: 'अंतर-विश्वविद्यालय संयोजक' },
      ],
    },
  ],
  workers_union: [
    {
      id: 'trade_union_cba',
      titleEn: '1. Collective Bargaining & Wage Accords',
      titleHi: '1. सामूहिक सौदेबाजी व वेतन समझौता (CBA)',
      descEn: 'Charter of demands, wage negotiations tracker, strike ballot verification, and labour court logs.',
      descHi: 'मांग पत्र (Charter of Demands), वेतन वार्ता, हड़ताल मतदान और लेबर कोर्ट ट्रैकर।',
      recommendedRoles: [
        { value: 'Union President', labelEn: 'Union President (अध्यक्ष)', labelHi: 'अध्यक्ष' },
        { value: 'General Secretary', labelEn: 'General Secretary (महासचिव)', labelHi: 'महासचिव' },
        { value: 'Negotiations Convener', labelEn: 'CBA Negotiations Lead (समझौता संयोजक)', labelHi: 'समझौता संयोजक' },
        { value: 'Legal Advisor', labelEn: 'Labour Law Legal Advisor (कानूनी सलाहकार)', labelHi: 'कानूनी सलाहकार' },
      ],
    },
    {
      id: 'workplace_safety',
      titleEn: '2. Factory Safety, OSHA & Compensation',
      titleHi: '2. कारखाना सुरक्षा, OSHA व मुआवजा सहायता',
      descEn: 'Workplace accident reporting, ESIC/EPFO claims, hazardous duty spot inspections.',
      descHi: 'कार्यस्थल दुर्घटना रिपोर्टिंग, ESIC/EPFO दावा सहायता और सुरक्षा निरीक्षण।',
      recommendedRoles: [
        { value: 'Safety Secretary', labelEn: 'Workplace Safety Secretary (सुरक्षा सचिव)', labelHi: 'सुरक्षा सचिव' },
        { value: 'ESIC Claim Officer', labelEn: 'ESIC & Welfare Officer (कल्याण अधिकारी)', labelHi: 'कल्याण अधिकारी' },
        { value: 'Works Inspector', labelEn: 'Shop-Floor Safety Auditor (सुरक्षा ऑडिटर)', labelHi: 'सुरक्षा ऑडिटर' },
        { value: 'Grievance Officer', labelEn: 'Workplace Grievance Officer (शिकायत अधिकारी)', labelHi: 'शिकायत अधिकारी' },
      ],
    },
    {
      id: 'gig_informal',
      titleEn: '3. Gig, Platform & Informal Workers',
      titleHi: '3. गिग, डिलीवरी व असंगठित श्रमिक मोर्चा',
      descEn: 'App delivery rate cards, police harassment SOS, informal mutual-aid fund, and strikes.',
      descHi: 'रेट-कार्ड विसंगति, पुलिस प्रताड़ना SOS, आपसी सहायता कोष और त्वरित हड़ताल।',
      recommendedRoles: [
        { value: 'Gig Collective Lead', labelEn: 'Gig Workers Lead (गिग मोर्चा प्रमुख)', labelHi: 'गिग मोर्चा प्रमुख' },
        { value: 'Hub Coordinator', labelEn: 'Delivery Hub In-Charge (हब प्रभारी)', labelHi: 'हब प्रभारी' },
        { value: 'Mutual-Aid Custodian', labelEn: 'Mutual-Aid Fund In-Charge (राहत कोष प्रमुख)', labelHi: 'राहत कोष प्रमुख' },
        { value: 'Field Mobilizer', labelEn: 'Field Mobilizer (फील्ड प्रेरक)', labelHi: 'फील्ड प्रेरक' },
      ],
    },
    {
      id: 'plant_stewards',
      titleEn: '4. Plant Cadre & Shop-Floor Stewards',
      titleHi: '4. प्लांट काडर व शॉप-फ्लोर प्रतिनिधि',
      descEn: 'Shift steward assignments, gate meetings, member dues collection, and discipline defense.',
      descHi: 'शिफ्ट प्रतिनिधि रोस्टर, गेट मीटिंग, सदस्यता चंदा संग्रह और अनुशासन जांच बचाव।',
      recommendedRoles: [
        { value: 'Chief Shop Steward', labelEn: 'Chief Shop Steward (मुख्य शॉप प्रतिनिधि)', labelHi: 'मुख्य शॉप प्रतिनिधि' },
        { value: 'Unit Delegate', labelEn: 'Unit Delegate (प्लांट प्रतिनिधि)', labelHi: 'प्लांट प्रतिनिधि' },
        { value: 'Dues Collector', labelEn: 'Dues & Membership In-Charge (चंदा प्रभारी)', labelHi: 'चंदा प्रभारी' },
        { value: 'Meeting Secretary', labelEn: 'Gate Meeting Coordinator (बैठक सचिव)', labelHi: 'बैठक सचिव' },
      ],
    },
  ],
  rwa: [
    {
      id: 'estate_maintenance',
      titleEn: '1. Gated Society & Estate Operations',
      titleHi: '1. गेटेड सोसायटी व मेंटेनेंस संचालन',
      descEn: 'Lift, DG, water pump workorders, technician assignment, and AMC equipment tracking.',
      descHi: 'लिफ्ट, डीजी, वाटर पंप वर्कऑर्डर, तकनीशियन कार्य और AMC उपकरण ट्रैकिंग।',
      recommendedRoles: [
        { value: 'RWA President', labelEn: 'RWA President (अध्यक्ष)', labelHi: 'अध्यक्ष' },
        { value: 'Maintenance Secretary', labelEn: 'Maintenance Secretary (रखरखाव सचिव)', labelHi: 'रखरखाव सचिव' },
        { value: 'Estate Manager', labelEn: 'Estate Manager (सोसायटी प्रबंधक)', labelHi: 'सोसायटी प्रबंधक' },
        { value: 'Facility Supervisor', labelEn: 'Facility Supervisor (सुपरवाइजर)', labelHi: 'सुपरवाइजर' },
      ],
    },
    {
      id: 'municipal_civic',
      titleEn: '2. Colony & Ward Municipal Action',
      titleHi: '2. कॉलोनी व वार्ड नगर निगम कार्रवाई',
      descEn: 'Potholes, sewers, streetlights, stamped representation letters to MCD, and councillor RTI.',
      descHi: 'सड़क, सीवर, स्ट्रीट लाइट, नगर निगम को स्टैम्प्ड पत्र और पार्षद आरटीआई।',
      recommendedRoles: [
        { value: 'Civic In-Charge', labelEn: 'Colony Civic Affairs Lead (नागरिक कार्य प्रमुख)', labelHi: 'नागरिक कार्य प्रमुख' },
        { value: 'Ward Liaison', labelEn: 'MCD / Councillor Liaison (निगम प्रतिनिधि)', labelHi: 'निगम प्रतिनिधि' },
        { value: 'Sanitation Lead', labelEn: 'Sanitation & Waste Lead (सफाई प्रमुख)', labelHi: 'सफाई प्रमुख' },
        { value: 'General Secretary', labelEn: 'General Secretary (महासचिव)', labelHi: 'महासचिव' },
      ],
    },
    {
      id: 'security_amenities',
      titleEn: '3. Security, Parking & Community Facilities',
      titleHi: '3. सुरक्षा, पार्किंग व क्लबहाउस प्रबंधन',
      descEn: 'Security guard rosters, parking slot allocation, clubhouse booking, and visitor logs.',
      descHi: 'गार्ड रोस्टर, पार्किंग स्लॉट आवंटन, क्लबहाउस बुकिंग और आगंतुक लॉग।',
      recommendedRoles: [
        { value: 'Security Secretary', labelEn: 'Security Secretary (सुरक्षा सचिव)', labelHi: 'सुरक्षा सचिव' },
        { value: 'Amenity Manager', labelEn: 'Clubhouse & Sports In-Charge (क्लब प्रबंधक)', labelHi: 'क्लब प्रबंधक' },
        { value: 'Parking In-Charge', labelEn: 'Parking Officer (पार्किंग प्रभारी)', labelHi: 'पार्किंग प्रभारी' },
        { value: 'Executive Member', labelEn: 'Executive Committee Member (कार्यकारिणी सदस्य)', labelHi: 'कार्यकारिणी सदस्य' },
      ],
    },
    {
      id: 'agm_billing',
      titleEn: '4. Annual AGM Elections & Bill Collection',
      titleHi: '4. वार्षिक AGM चुनाव व मासिक बिलिंग',
      descEn: 'Online AGM secret ballots, automated maintenance bill generation, UPI dues, and transparency audit.',
      descHi: 'ऑनलाइन एजीएम गुप्त मतदान, स्वचालित मेंटेनेंस बिल, UPI भुगतान व वित्तीय पारदर्शिता।',
      recommendedRoles: [
        { value: 'RWA Treasurer', labelEn: 'Treasurer / Finance Lead (कोषाध्यक्ष)', labelHi: 'कोषाध्यक्ष' },
        { value: 'Returning Officer', labelEn: 'AGM Election Returning Officer (चुनाव अधिकारी)', labelHi: 'चुनाव अधिकारी' },
        { value: 'Audit Convener', labelEn: 'Internal Auditor (आंतरिक ऑडिटर)', labelHi: 'आंतरिक ऑडिटर' },
        { value: 'Accounts Lead', labelEn: 'Billing & Collection In-Charge (बिलिंग प्रभारी)', labelHi: 'बिलिंग प्रभारी' },
      ],
    },
  ],
}

interface LegalOptionDetail {
  type: LegalEntityType
  titleEn: string
  titleHi: string
  subEn: string
  subHi: string
  descEn: string
  descHi: string
  actEn: string
  actHi: string
}

const LEGAL_ENTITY_OPTIONS: Record<OrgType, LegalOptionDetail[]> = {
  civic_collective: [
    {
      type: 'unregistered',
      titleEn: 'Unregistered / Informal Collective',
      titleHi: 'अनौपचारिक नागरिक समूह',
      subEn: 'Constitution of India — Article 19(1)(c)',
      subHi: 'भारत का संविधान — अनुच्छेद 19(1)(c)',
      descEn: 'Operates as an unincorporated grassroots association under the constitutional right to form associations. No government registration or renewal needed.',
      descHi: 'संघ बनाने के संवैधानिक अधिकार के तहत कार्य करता है। किसी सरकारी पंजीकरण या नवीनीकरण की आवश्यकता नहीं।',
      actEn: 'Article 19(1)(c) Right to Freedom of Association',
      actHi: 'अनुच्छेद 19(1)(c) संघ बनाने की स्वतंत्रता',
    },
    {
      type: 'bqf_recognized',
      titleEn: 'BQF Umbrella Recognized Collective',
      titleHi: 'BQF छत्र मान्यता प्राप्त समूह',
      subEn: 'Section 8 Umbrella Recognition & Verification',
      subHi: 'धारा 8 छत्र मान्यता व सत्यापन',
      descEn: 'Affiliated with Bahujan Queer Foundation (Section 8 Non-Profit) for grant eligibility, legal protection, and audited bank routing.',
      descHi: 'अनुदान पात्रता, कानूनी संरक्षण और ऑडिटेड बैंक रूटिंग के लिए बहुजन क्वीर फाउंडेशन से संबद्ध।',
      actEn: 'Companies Act, 2013 (Section 8 Institutional Umbrella)',
      actHi: 'कंपनी अधिनियम, 2013 (धारा 8 संस्थागत छत्र)',
    },
  ],
  ngo: [
    {
      type: 'society',
      titleEn: 'Registered Society',
      titleHi: 'पंजीकृत सोसाइटी',
      subEn: 'Societies Registration Act, 1860',
      subHi: 'सोसाइटी पंजीकरण अधिनियम, 1860',
      descEn: 'Democratic governing body with general body members and annual list filings (Form V) to Registrar of Societies.',
      descHi: 'रजिस्ट्रार ऑफ सोसाइटीज को वार्षिक सूची फाइलिंग और आम सभा सदस्यों के साथ लोकतांत्रिक निकाय।',
      actEn: 'Societies Registration Act, 1860 / State Society Acts',
      actHi: 'सोसाइटी पंजीकरण अधिनियम, 1860 / राज्य सोसाइटी अधिनियम',
    },
    {
      type: 'trust',
      titleEn: 'Public Charitable Trust',
      titleHi: 'सार्वजनिक धर्मार्थ ट्रस्ट',
      subEn: 'Indian Trusts Act, 1882 / Bombay Public Trusts Act',
      subHi: 'भारतीय ट्रस्ट अधिनियम, 1882 / सार्वजनिक ट्रस्ट अधिनियम',
      descEn: 'Administered by a Board of Trustees under a registered Trust Deed with annual Charity Commissioner audit requirements.',
      descHi: 'वार्षिक चैरिटी कमिश्नर ऑडिट आवश्यकताओं के साथ पंजीकृत ट्रस्ट डीड के तहत ट्रस्टियों द्वारा संचालित।',
      actEn: 'Indian Trusts Act, 1882 / State Public Trusts Acts',
      actHi: 'भारतीय ट्रस्ट अधिनियम, 1882 / राज्य ट्रस्ट अधिनियम',
    },
    {
      type: 'section_8_company',
      titleEn: 'Section 8 Non-Profit Company',
      titleHi: 'धारा 8 गैर-लाभकारी कंपनी',
      subEn: 'Companies Act, 2013 (Section 8)',
      subHi: 'कंपनी अधिनियम, 2013 (धारा 8)',
      descEn: 'Corporate non-profit entity governed by Ministry of Corporate Affairs (MCA) with CIN, DIN, AOC-4 and MGT-7 filings.',
      descHi: 'CIN, DIN, AOC-4 और MGT-7 फाइलिंग के साथ कॉर्पोरेट मामलों के मंत्रालय (MCA) द्वारा शासित।',
      actEn: 'Companies Act, 2013 (Section 8 MCA Framework)',
      actHi: 'कंपनी अधिनियम, 2013 (धारा 8 MCA ढांचा)',
    },
  ],
  student_union: [
    {
      type: 'university_body',
      titleEn: 'Constituted University / College Body',
      titleHi: 'मान्यता प्राप्त विश्वविद्यालय / कॉलेज निकाय',
      subEn: 'University Statutes & Lyngdoh Committee Framework',
      subHi: 'विश्वविद्यालय नियम व लिंगदोह समिति दिशानिर्देश',
      descEn: 'Official student body governed by Dean of Students Welfare (DSW), university act statutes, and election code.',
      descHi: 'विश्वविद्यालय प्रशासन (DSW), विश्वविद्यालय अधिनियम और चुनाव आचार संहिता द्वारा शासित।',
      actEn: 'University Central/State Acts & UGC Guidelines',
      actHi: 'विश्वविद्यालय केंद्रीय/राज्य अधिनियम व UGC दिशानिर्देश',
    },
    {
      type: 'independent_front',
      titleEn: 'Independent Student Guild / Front',
      titleHi: 'स्वतंत्र छात्र मंच / फ्रंट',
      subEn: 'Autonomous Student Movement Association',
      subHi: 'स्वायत्त छात्र आंदोलन व संघ',
      descEn: 'Autonomous, democratic student association independent of university administration restrictions.',
      descHi: 'विश्वविद्यालय प्रशासन के प्रतिबंधों से स्वतंत्र, स्वायत्त एवं लोकतांत्रिक छात्र संगठन।',
      actEn: 'Article 19(1)(c) / Societies Registration Act',
      actHi: 'अनुच्छेद 19(1)(c) / सोसाइटी पंजीकरण अधिनियम',
    },
  ],
  workers_union: [
    {
      type: 'registered_trade_union',
      titleEn: 'Registered Trade Union',
      titleHi: 'पंजीकृत ट्रेड यूनियन',
      subEn: 'Trade Unions Act, 1926',
      subHi: 'ट्रेड यूनियन अधिनियम, 1926',
      descEn: 'Statutory registered union with strike notice rights, collective bargaining mandate, and annual Form H returns.',
      descHi: 'हड़ताल नोटिस अधिकार, सामूहिक सौदेबाजी जनादेश और वार्षिक फॉर्म H रिटर्न के साथ पंजीकृत यूनियन।',
      actEn: 'Trade Unions Act, 1926 (State Labour Commissioner)',
      actHi: 'ट्रेड यूनियन अधिनियम, 1926 (राज्य श्रम आयुक्त)',
    },
    {
      type: 'informal_collective',
      titleEn: 'Informal / Gig Workers Collective',
      titleHi: 'असंगठित / गिग वर्कर्स मोर्चा',
      subEn: 'Platform & Informal Labor Front',
      subHi: 'प्लेटफॉर्म व असंगठित श्रम मंच',
      descEn: 'Grassroots collective of gig, platform, or contract workers for mutual protection and spot agitation.',
      descHi: 'पारस्परिक सुरक्षा और त्वरित मांग अभियान के लिए गिग, प्लेटफॉर्म या अनुबंध श्रमिकों का जमीनी संगठन।',
      actEn: 'Article 19(1)(c) & Unorganised Workers Social Security Act',
      actHi: 'अनुच्छेद 19(1)(c) व असंगठित कर्मकार सामाजिक सुरक्षा अधिनियम',
    },
  ],
  rwa: [
    {
      type: 'registered_society',
      titleEn: 'Registered Society (RWA)',
      titleHi: 'पंजीकृत सोसाइटी (RWA)',
      subEn: 'Societies Registration Act, 1860',
      subHi: 'सोसाइटी पंजीकरण अधिनियम, 1860',
      descEn: 'Standard resident welfare association registered with Registrar of Societies for maintenance and civic representation.',
      descHi: 'रखरखाव और नागरिक प्रतिनिधित्व के लिए रजिस्ट्रार ऑफ सोसाइटीज के साथ पंजीकृत आरडब्ल्यूए।',
      actEn: 'Societies Registration Act, 1860',
      actHi: 'सोसाइटी पंजीकरण अधिनियम, 1860',
    },
    {
      type: 'cooperative_housing',
      titleEn: 'Cooperative Housing Society (CHS)',
      titleHi: 'सहकारी आवास सोसाइटी (CHS)',
      subEn: 'State Cooperative Societies Act',
      subHi: 'राज्य सहकारी सोसाइटी अधिनियम',
      descEn: 'Cooperative housing entity with share certificates, panel statutory audits, and mandatory AGM elections.',
      descHi: 'शेयर सर्टिफिकेट, पैनल वैधानिक ऑडिट और अनिवार्य एजीएम चुनावों के साथ सहकारी आवास निकाय।',
      actEn: 'State Cooperative Societies Acts (Registrar of Cooperatives)',
      actHi: 'राज्य सहकारी समिति अधिनियम (सहकारी रजिस्ट्रार)',
    },
    {
      type: 'apartment_association',
      titleEn: 'Apartment Owners Association (AOA)',
      titleHi: 'अपार्टमेंट ओनर्स एसोसिएशन (AOA)',
      subEn: 'State Apartment Ownership Act / RERA Rules',
      subHi: 'राज्य अपार्टमेंट स्वामित्व अधिनियम / RERA नियम',
      descEn: 'Formed by deed of declaration under Apartment Ownership Act for common area deeds and builder handovers.',
      descHi: 'कॉमन एरिया डीड और बिल्डर हैंडओवर के लिए अपार्टमेंट ओनरशिप एक्ट के तहत गठित।',
      actEn: 'State Apartment Ownership Acts & Real Estate (RERA) Act',
      actHi: 'राज्य अपार्टमेंट स्वामित्व अधिनियम व रेरा (RERA) अधिनियम',
    },
  ],
}

const UI = {
  en: {
    step1Title: 'Organisation Identity & Public Web Address',
    step1Desc: 'Choose your organisation name and reserve your unique public slug on Sangathan.',
    nameLabel: 'Official Collective Name *',
    namePlaceholder: 'e.g. All India Student Solidarity Front',
    slugLabel: 'Unique Public URL Slug *',
    descLabel: 'Mission Statement / Bio',
    descPlaceholder: 'Brief summary of your collective demands, causes, and democratic objectives...',
    step2Title: 'Collective Sector Blueprint',
    step2Desc: 'Select your organizational archetype to auto-configure compliant workflows, modules, and governance desks.',
    step3Title: 'Legal Entity Sub-Classification',
    step3Desc: 'Specify your statutory registration form under Indian constitutional and regulatory frameworks.',
    step4Title: 'Governance & Tiered Leadership',
    step4Desc: 'Define executive committee roles and administrative designations.',
    roleLabel: 'Your Initial Designation *',
    dualApproval: 'Dual-Approval Security Enabled',
    dualApprovalDesc: 'High-risk operations (such as broadcasting announcements to >1000 members or ledger adjustments) require dual executive approvals.',
    step5Title: 'Membership Policy & Dues Structure',
    step5Desc: 'Configure open grassroots membership or monthly dues collection.',
    freeMembership: 'Free Open Membership',
    freeMembershipDesc: 'No mandatory fee for cadre/students/citizens. Open democratic participation.',
    paidDues: 'Monthly Contribution / Dues',
    paidDuesDesc: 'Automated UPI collection, recurring member ledgers & automated receipt generation.',
    monthlyDuesLabel: 'Monthly Dues Amount (INR) *',
    monthlyDuesPlaceholder: 'e.g. 100',
    step6Title: 'Growth Engines & Final Launch',
    step6Desc: 'Activate mission modules and review your collective configuration before launch.',
    petitionTitle: '1-Click Public Petition Studio',
    petitionDesc: 'Live signature counter & volunteer conversion engine',
    transparencyTitle: 'Public Transparency & Trust Ledger',
    transparencyDesc: 'SHA-256 verified real-time fund utilization and public receipts',
    sosTitle: 'Emergency SOS & Legal Defense Network',
    sosDesc: '1-tap protest detention broadcast & emergency advocate dispatch',
    back: 'Back',
    continue: 'Continue',
    launching: 'Initializing Collective...',
    launch: 'Launch Sangathan OS',
    nameRequired: 'Please enter your organization name.',
    slugRequired: 'Please enter a valid slug (at least 3 characters).',
    slugTaken: 'This URL slug is already taken. Please choose another.',
    orgCreated: 'Organisation initialized and live on Sangathan!',
    setupFailed: 'Failed to complete setup.',
    unexpectedError: 'An unexpected error occurred.',
    checkingSlug: 'Checking availability...',
    slugAvailable: 'This URL is available',
    slugUnavailable: 'This URL is already taken',
    enabled: 'Enabled',
    disabled: 'Disabled',
    reviewSummary: 'Configuration Review Summary',
    selectedArchetype: 'Movement Archetype',
    legalClassification: 'Legal Entity Form',
    adminDesignation: 'Admin Designation',
    membershipPlan: 'Membership Dues',
    growthEngines: 'Active Engines',
  },
  hi: {
    step1Title: 'संगठन पहचान और सार्वजनिक वेब पता',
    step1Desc: 'अपने संगठन का नाम चुनें और Sangathan पर अपना अनूठा सार्वजनिक स्लग आरक्षित करें।',
    nameLabel: 'आधिकारिक सामूहिक नाम *',
    namePlaceholder: 'जैसे अखिल भारतीय छात्र एकता मोर्चा',
    slugLabel: 'अनूठा सार्वजनिक URL स्लग *',
    descLabel: 'मिशन स्टेटमेंट / परिचय',
    descPlaceholder: 'अपनी सामूहिक मांगों, कारणों और लोकतांत्रिक उद्देश्यों का संक्षिप्त सारांश...',
    step2Title: 'सामूहिक क्षेत्र ब्लूप्रिंट',
    step2Desc: 'स्वतः-कॉन्फ़िगर अनुपालन वर्कफ़्लो, मॉड्यूल और शासन डेस्क के लिए अपना संगठनात्मक आदर्श चुनें।',
    step3Title: 'कानूनी इकाई उप-वर्गीकरण',
    step3Desc: 'भारतीय संवैधानिक और नियामक ढांचे के तहत अपना सटीक कानूनी पंजीकरण प्रकार चुनें।',
    step4Title: 'शासन और स्तरीय नेतृत्व',
    step4Desc: 'कार्यकारी समिति भूमिकाओं और प्रशासनिक पदनामों को परिभाषित करें।',
    roleLabel: 'आपका प्रारंभिक पदनाम *',
    dualApproval: 'दोहरी-अनुमोदन सुरक्षा सक्षम',
    dualApprovalDesc: 'उच्च-जोखिम संचालन (जैसे >1000 सदस्यों को घोषणाएं प्रसारित करना या बही समायोजन) के लिए दोहरी कार्यकारी अनुमोदन आवश्यक हैं।',
    step5Title: 'सदस्यता नीति और शुल्क संरचना',
    step5Desc: 'खुली जमीनी सदस्यता या मासिक शुल्क संग्रह कॉन्फ़िगर करें।',
    freeMembership: 'मुफ्त खुली सदस्यता',
    freeMembershipDesc: 'काडर/छात्रों/नागरिकों के लिए कोई अनिवार्य शुल्क नहीं। खुली लोकतांत्रिक भागीदारी।',
    paidDues: 'मासिक योगदान / शुल्क',
    paidDuesDesc: 'स्वचालित UPI सदस्यता, मासिक बहीखाता और स्वचालित रसीद उत्पादन।',
    monthlyDuesLabel: 'मासिक शुल्क राशि (INR) *',
    monthlyDuesPlaceholder: 'जैसे 100',
    step6Title: 'विकास इंजन व अंतिम लॉन्च',
    step6Desc: 'मिशन मॉड्यूल सक्रिय करें और लॉन्च से पहले अपने संगठन के विन्यास की समीक्षा करें।',
    petitionTitle: '1-क्लिक सार्वजनिक याचिका स्टूडियो',
    petitionDesc: 'लाइव हस्ताक्षर काउंटर और स्वयंसेवक रूपांतरण इंजन',
    transparencyTitle: 'सार्वजनिक पारदर्शिता और विश्वास बही',
    transparencyDesc: 'SHA-256 सत्यापित रियल-टाइम फंड उपयोग व रसीदें',
    sosTitle: 'आपातकालीन SOS और कानूनी रक्षा नेटवर्क',
    sosDesc: '1-टैप विरोध बंदीगृह प्रसारण और आपातकालीन वकील सहायता',
    back: 'वापस',
    continue: 'जारी रखें',
    launching: 'संगठन प्रारंभ हो रहा है...',
    launch: 'Sangathan OS लॉन्च करें',
    nameRequired: 'कृपया अपने संगठन का नाम दर्ज करें।',
    slugRequired: 'कृपया एक मान्य स्लग दर्ज करें (कम से कम 3 अक्षर)।',
    slugTaken: 'यह URL स्लग पहले से लिया हुआ है। कृपया दूसरा चुनें।',
    orgCreated: 'संगठन सफलतापूर्वक प्रारंभ हुआ और Sangathan पर लाइव है!',
    setupFailed: 'सेटअप पूरा करने में विफल।',
    unexpectedError: 'एक अप्रत्याशित त्रुटि हुई।',
    checkingSlug: 'उपलब्धता जांची जा रही है...',
    slugAvailable: 'यह URL उपलब्ध है',
    slugUnavailable: 'यह URL पहले से ही लिया गया है',
    enabled: 'सक्षम',
    disabled: 'अक्षम',
    reviewSummary: 'विन्यास समीक्षा सारांश',
    selectedArchetype: 'आंदोलन प्रकार',
    legalClassification: 'कानूनी ढांचा',
    adminDesignation: 'प्रशासक पदनाम',
    membershipPlan: 'सदस्यता शुल्क',
    growthEngines: 'सक्रिय इंजन',
  },
}

export function OnboardingWizard({ lang }: OnboardingWizardProps) {
  const isHi = lang === 'hi'
  const t = (key: keyof typeof UI['en']) => UI[isHi ? 'hi' : 'en'][key]
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Form State across steps
  const [orgData, setOrgData] = useState({
    name: '',
    slug: '',
    type: 'civic_collective' as OrgType,
    focusBlueprint: 'colony_civic',
    legalEntityType: 'unregistered' as LegalEntityType,
    registrationStatus: 'unregistered',
    registrationNumber: '',
    description: '',
    logoUrl: '',
    primaryRole: 'Lead Organizer',
    duesType: 'free' as 'free' | 'paid',
    monthlyDues: '0',
    enablePublicPetitions: true,
    enableTransparencyLedger: true,
    enableEmergencySos: true,
  })

  const [slugChecking, setSlugChecking] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sangathan.space'

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error(isHi ? 'कृपया एक वैध छवि फ़ाइल चुनें।' : 'Please select a valid image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(isHi ? 'छवि 5MB से कम होनी चाहिए।' : 'Image must be under 5MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result) {
        setOrgData((prev) => ({ ...prev, logoUrl: reader.result as string }))
        toast.success(isHi ? 'लोगो अपलोड हो गया!' : 'Logo uploaded successfully!')
      }
    }
    reader.readAsDataURL(file)
  }

  // Debounced slug check
  async function checkSlugAvailability(slug: string) {
    if (slug.length < 3) {
      setSlugAvailable(null)
      return
    }
    setSlugChecking(true)
    try {
      const res = await fetch(`/api/org/slug-check?slug=${encodeURIComponent(slug)}`)
      const data = await res.json()
      setSlugAvailable(data.available)
    } catch {
      setSlugAvailable(null)
    } finally {
      setSlugChecking(false)
    }
  }

  // Update default legal entity when org type changes
  const handleOrgTypeChange = (id: OrgType) => {
    const firstBlueprint = FOCUS_BLUEPRINTS[id]?.[0]
    const validLegalTypes = VALID_LEGAL_TYPES[id] || ['unregistered']
    const defaultLegalType = validLegalTypes[0] as LegalEntityType

    setOrgData((prev) => ({
      ...prev,
      type: id,
      focusBlueprint: firstBlueprint ? firstBlueprint.id : 'default',
      primaryRole: firstBlueprint?.recommendedRoles[0]?.value || 'Lead Organizer',
      legalEntityType: defaultLegalType,
      registrationStatus: defaultLegalType === 'unregistered' ? 'unregistered' : 'registered',
    }))
  }

  const steps = [
    { number: 1, title: isHi ? 'पहचान व स्लग' : 'Identity & Slug', icon: Globe },
    { number: 2, title: isHi ? 'क्षेत्र ब्लूप्रिंट' : 'Sector Blueprint', icon: Building2 },
    { number: 3, title: isHi ? 'कानूनी ढांचा' : 'Legal Entity Type', icon: Scale },
    { number: 4, title: isHi ? 'शासन पदनाम' : 'Governance Roles', icon: Users },
    { number: 5, title: isHi ? 'सदस्यता व शुल्क' : 'Membership & Dues', icon: CreditCard },
    { number: 6, title: isHi ? 'समीक्षा व लॉन्च' : 'Review & Launch', icon: Rocket },
  ]

  async function handleFinalSubmit() {
    if (!orgData.name.trim()) {
      toast.error(t('nameRequired'))
      setStep(1)
      return
    }

    setLoading(true)
    try {
      const res = await finalizeSignup({
        organizationName: orgData.name.trim(),
        organizationType: orgData.type,
        slug: orgData.slug.trim(),
        description: orgData.description.trim(),
        logoUrl: orgData.logoUrl || undefined,
        registrationStatus: orgData.legalEntityType === 'unregistered' ? 'unregistered' : 'registered',
        designation: orgData.primaryRole,
        membershipPolicy: orgData.duesType === 'free' ? 'open_auto' : 'admin_approval',
        monthlyDues: orgData.duesType === 'paid' ? orgData.monthlyDues : '0',
        focusBlueprint: orgData.focusBlueprint,
        legalEntityType: orgData.legalEntityType,
        enablePublicPetitions: orgData.enablePublicPetitions,
        enableTransparencyLedger: orgData.enableTransparencyLedger,
        enableEmergencySos: orgData.enableEmergencySos,
      })

      if (res.success) {
        toast.success(t('orgCreated'))
        router.push(`/${lang}/dashboard`)
      } else {
        toast.error(res.error || t('setupFailed'))
      }
    } catch {
      toast.error(t('unexpectedError'))
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (step === 1) {
      if (!orgData.name.trim()) {
        toast.error(t('nameRequired'))
        return
      }
      if (!orgData.slug.trim() || orgData.slug.trim().length < 3) {
        toast.error(t('slugRequired'))
        return
      }
      if (slugAvailable === false) {
        toast.error(t('slugTaken'))
        return
      }
    }

    if (step === 5 && orgData.duesType === 'paid') {
      const dues = Number(orgData.monthlyDues)
      if (isNaN(dues) || dues <= 0) {
        toast.error(isHi ? 'कृपया एक वैध मासिक शुल्क राशि दर्ज करें।' : 'Please enter a valid monthly dues amount.')
        return
      }
    }

    setStep((s) => Math.min(s + 1, 6))
  }

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 1))
  }

  const currentOrgConfig = ORG_TYPES[orgData.type]
  const currentBlueprint = FOCUS_BLUEPRINTS[orgData.type]?.find((b) => b.id === orgData.focusBlueprint)
  const currentLegalOption = LEGAL_ENTITY_OPTIONS[orgData.type]?.find((l) => l.type === orgData.legalEntityType)

  return (
    <div className="w-full space-y-6">
      {/* Step Progress Bar Header */}
      <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-sm shadow-xs">
        {/* Desktop Stepper */}
        <div className="hidden sm:grid sm:grid-cols-6 gap-2 items-center">
          {steps.map((s) => {
            const isCompleted = step > s.number
            const isCurrent = step === s.number
            return (
              <div key={s.number} className="flex flex-col items-center text-center">
                <div
                  className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-slate-900 text-white ring-2 ring-slate-900/10'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.number}
                </div>
                <span
                  className={`text-[11px] font-medium mt-1.5 truncate max-w-full ${
                    isCurrent ? 'text-slate-900 font-semibold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            )
          })}
        </div>

        {/* Mobile Stepper */}
        <div className="sm:hidden space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">
              {isHi ? `चरण ${step} / 6: ` : `Step ${step} of 6: `}
              <span className="text-brand-600">{steps[step - 1].title}</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">{Math.round((step / 6) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white border border-slate-200 p-5 sm:p-7 rounded-sm shadow-xs space-y-6">
        {/* STEP 1: IDENTITY & SLUG */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">{t('step1Title')}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{t('step1Desc')}</p>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">{t('nameLabel')}</Label>
              <Input
                required
                placeholder={t('namePlaceholder')}
                value={orgData.name}
                onChange={(e) => {
                  const name = e.target.value
                  const generatedSlug = name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')
                  setOrgData({
                    ...orgData,
                    name,
                    slug: orgData.slug && orgData.slug !== '' ? orgData.slug : generatedSlug,
                  })
                  if (!orgData.slug || orgData.slug === '') {
                    checkSlugAvailability(generatedSlug)
                  }
                }}
                className="mt-1 h-10 text-sm rounded-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">{t('slugLabel')}</Label>
              <div className="flex items-center mt-1">
                <span className="bg-slate-100 text-slate-500 text-xs px-3 h-10 flex items-center border border-r-0 border-slate-200 rounded-l-sm font-mono select-none">
                  {appUrl.replace(/^https?:\/\//, '')}/
                </span>
                <Input
                  required
                  placeholder="student-front"
                  value={orgData.slug}
                  onChange={(e) => {
                    const newSlug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                    setOrgData({ ...orgData, slug: newSlug })
                    checkSlugAvailability(newSlug)
                  }}
                  className="h-10 text-xs font-mono rounded-r-sm rounded-l-none"
                />
              </div>
              {slugChecking && <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> {t('checkingSlug')}</p>}
              {slugAvailable === true && (
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('slugAvailable')}
                </p>
              )}
              {slugAvailable === false && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {t('slugUnavailable')}
                </p>
              )}
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">{t('descLabel')}</Label>
              <Textarea
                rows={3}
                placeholder={t('descPlaceholder')}
                value={orgData.description}
                onChange={(e) => setOrgData({ ...orgData, description: e.target.value })}
                className="mt-1 text-xs rounded-sm resize-none"
              />
            </div>

            {/* Logo Setup & AI Generator */}
            <div className="pt-2">
              <Label className="text-xs font-semibold text-slate-700">
                {isHi ? 'संगठन का लोगो / मोहर (Logo & Official Emblem)' : 'Organisation Logo & Official Emblem'}
              </Label>
              <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3.5 p-3 bg-slate-50 border border-slate-200 rounded-sm">
                <div className="h-14 w-14 rounded-xl bg-white border border-slate-300 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                  {orgData.logoUrl ? (
                    <Image
                      src={orgData.logoUrl}
                      alt="Org Logo Preview"
                      width={48}
                      height={48}
                      className="object-contain rounded-lg"
                      unoptimized
                    />
                  ) : (
                    <span className="text-sm font-black text-slate-400">
                      {orgData.name ? orgData.name.slice(0, 2).toUpperCase() : 'SG'}
                    </span>
                  )}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-800">
                    {orgData.logoUrl
                      ? (isHi ? 'लोगो चुना गया' : 'Official Emblem Configured')
                      : (isHi ? 'लोगो अपलोड करें या तुरंत जनरेट करें' : 'Upload custom logo or generate one with AI')}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isHi
                      ? 'लेटरहेड, ज्ञापन व आधिकारिक पत्रों पर उपयोग हेतु'
                      : 'Ready for official letterheads, Gyapan memorandums & public portal'}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={logoInputRef}
                      onChange={handleLogoUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => logoInputRef.current?.click()}
                      className="text-xs font-semibold h-8 rounded-sm"
                    >
                      <UploadCloud className="w-3.5 h-3.5 mr-1" />
                      {orgData.logoUrl ? (isHi ? 'छवि बदलें' : 'Change Image') : (isHi ? 'अपलोड करें' : 'Upload Image')}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsGeneratorOpen(true)}
                      className="text-xs font-bold bg-white hover:bg-slate-50 text-slate-900 border-slate-300 h-8 rounded-sm gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{isHi ? 'लोगो बनाएं (Generate Logo)' : 'Generate My Logo'}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SECTOR BLUEPRINT */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">{t('step2Title')}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{t('step2Desc')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {(Object.entries(ORG_TYPES) as [OrgType, typeof ORG_TYPES[OrgType]][]).map(([id, config]) => {
                const isSelected = orgData.type === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleOrgTypeChange(id)}
                    className={`p-3.5 text-left border rounded-sm transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-900">{isHi ? config.hi : config.en}</div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-slate-900 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {ORG_DESCRIPTIONS[id][isHi ? 'hi' : 'en']}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Specialized Focus Blueprints */}
            <div className="mt-4 p-3.5 border border-slate-200 bg-slate-50/60 rounded-sm space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                <span>{isHi ? 'विशेष फोकस व कार्यक्षेत्र (Focus Blueprint)' : 'Specialized Focus Blueprint'}</span>
              </div>
              <p className="text-[11px] text-slate-600">
                {isHi
                  ? 'अपने संगठन के प्राथमिक उद्देश्य के अनुसार टूल्स, पदनाम और डैशबोर्ड को कस्टमाइज़ करें:'
                  : 'Pre-configure tailored workflows, designation roles, and dashboards for your mission:'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {FOCUS_BLUEPRINTS[orgData.type]?.map((bp) => {
                  const isSelected = orgData.focusBlueprint === bp.id
                  return (
                    <button
                      key={bp.id}
                      type="button"
                      onClick={() => {
                        setOrgData({
                          ...orgData,
                          focusBlueprint: bp.id,
                          primaryRole: bp.recommendedRoles[0]?.value || orgData.primaryRole,
                        })
                      }}
                      className={`p-3 border rounded-sm text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
                        isSelected
                          ? 'bg-white border-slate-900 ring-1 ring-slate-900 shadow-xs'
                          : 'bg-white/80 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-xs text-slate-900">
                          {isHi ? bp.titleHi : bp.titleEn}
                        </div>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-slate-900 shrink-0" />}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {isHi ? bp.descHi : bp.descEn}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: LEGAL ENTITY TYPE */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">{t('step3Title')}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{t('step3Desc')}</p>
            </div>

            <div className="space-y-2.5">
              {LEGAL_ENTITY_OPTIONS[orgData.type]?.map((opt) => {
                const isSelected = orgData.legalEntityType === opt.type
                return (
                  <button
                    type="button"
                    key={opt.type}
                    onClick={() => {
                      setOrgData({
                        ...orgData,
                        legalEntityType: opt.type,
                        registrationStatus: opt.type === 'unregistered' ? 'unregistered' : 'registered',
                      })
                    }}
                    className={`w-full p-3.5 border rounded-sm text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
                      isSelected
                        ? 'bg-white border-slate-900 ring-1 ring-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900">
                          {isHi ? opt.titleHi : opt.titleEn}
                        </div>
                        <div className="text-[11px] font-medium text-slate-600 mt-0.5">
                          {isHi ? opt.subHi : opt.subEn}
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-slate-900 shrink-0 ml-2" />}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                      {isHi ? opt.descHi : opt.descEn}
                    </div>
                    <div className="mt-2 text-[10px] text-slate-600 font-mono bg-slate-50 p-1.5 rounded-xs border border-slate-200">
                      ⚖️ {isHi ? opt.actHi : opt.actEn}
                    </div>
                  </button>
                )
              })}
            </div>

            {orgData.type === 'civic_collective' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-600">
                <p className="leading-relaxed">
                  💡 <strong>{isHi ? 'संवैधानिक सूचना:' : 'Constitutional Note:'}</strong>{' '}
                  {isHi
                    ? 'नागरिक समूहों को अनौपचारिक रूप से कार्य करने का पूर्ण संवैधानिक अधिकार है। भविष्य में यदि औपचारिक खाता या 80G रसीद की आवश्यकता हो, तो BQF मान्यता या सोसायटी पंजीकरण में अपग्रेड किया जा सकता है।'
                    : 'Civic collectives operate lawfully as informal associations under Article 19(1)(c). If your collective later requires grant access or 80G tax benefits, you can link with BQF Section 8 umbrella recognition anytime.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: GOVERNANCE ROLES */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">{t('step4Title')}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{t('step4Desc')}</p>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">{t('roleLabel')}</Label>
              <Select
                value={orgData.primaryRole}
                onValueChange={(val) => setOrgData({ ...orgData, primaryRole: val })}
              >
                <SelectTrigger className="mt-1 h-10 text-xs rounded-sm">
                  <SelectValue placeholder={t('roleLabel')} />
                </SelectTrigger>
                <SelectContent>
                  {/* Blueprint Specific Recommended Roles */}
                  {FOCUS_BLUEPRINTS[orgData.type]
                    ?.find((bp) => bp.id === orgData.focusBlueprint)
                    ?.recommendedRoles.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {isHi ? r.labelHi : r.labelEn} (★ Recommended)
                      </SelectItem>
                    ))}
                  <SelectItem value="President">President (अध्यक्ष)</SelectItem>
                  <SelectItem value="General Secretary">General Secretary (महासचिव)</SelectItem>
                  <SelectItem value="Convener">Convener / Coordinator (संयोजक)</SelectItem>
                  <SelectItem value="Treasurer">Treasurer / Finance Lead (कोषाध्यक्ष)</SelectItem>
                  <SelectItem value="Executive Member">Executive Member (कार्यकारिणी सदस्य)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-600 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t('dualApproval')}</span>
              </div>
              <p className="text-[11px] leading-relaxed">{t('dualApprovalDesc')}</p>
            </div>
          </div>
        )}

        {/* STEP 5: MEMBERSHIP & DUES */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">{t('step5Title')}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{t('step5Desc')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Option A: Free Open Membership */}
              <button
                type="button"
                onClick={() => setOrgData({ ...orgData, duesType: 'free', monthlyDues: '0' })}
                className={`p-3.5 text-left border rounded-sm transition-all ${
                  orgData.duesType === 'free'
                    ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900">{t('freeMembership')}</div>
                  {orgData.duesType === 'free' && <CheckCircle2 className="w-4 h-4 text-slate-900 shrink-0" />}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {t('freeMembershipDesc')}
                </div>
              </button>

              {/* Option B: Paid Monthly Dues */}
              <button
                type="button"
                onClick={() => setOrgData({ ...orgData, duesType: 'paid', monthlyDues: orgData.monthlyDues === '0' ? '100' : orgData.monthlyDues })}
                className={`p-3.5 text-left border rounded-sm transition-all ${
                  orgData.duesType === 'paid'
                    ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900">{t('paidDues')}</div>
                  {orgData.duesType === 'paid' && <CheckCircle2 className="w-4 h-4 text-slate-900 shrink-0" />}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {t('paidDuesDesc')}
                </div>
              </button>
            </div>

            {/* Dues Amount Input if paid is selected */}
            {orgData.duesType === 'paid' && (
              <div className="mt-4 p-3.5 border border-slate-200 bg-slate-50/50 rounded-sm space-y-2">
                <Label className="text-xs font-semibold text-slate-700">{t('monthlyDuesLabel')}</Label>
                <div className="flex items-center">
                  <span className="bg-slate-100 text-slate-600 text-xs px-3 h-9 flex items-center border border-r-0 border-slate-200 rounded-l-sm font-semibold">
                    ₹
                  </span>
                  <Input
                    type="number"
                    min="1"
                    placeholder={t('monthlyDuesPlaceholder')}
                    value={orgData.monthlyDues}
                    onChange={(e) => setOrgData({ ...orgData, monthlyDues: e.target.value })}
                    className="h-9 text-xs rounded-r-sm rounded-l-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  {isHi
                    ? 'सदस्यों के लिए मासिक सदस्यता शुल्क स्वतः UPI द्वारा संग्रह करने के लिए निर्धारित किया जाएगा।'
                    : 'Members will be prompted for this recurring monthly contribution via automated UPI subscriptions.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: GROWTH ENGINES & LAUNCH REVIEW */}
        {step === 6 && (
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">{t('step6Title')}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{t('step6Desc')}</p>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setOrgData({ ...orgData, enablePublicPetitions: !orgData.enablePublicPetitions })}
                className={`p-3 w-full text-left border rounded-sm flex items-center justify-between transition-all ${
                  orgData.enablePublicPetitions ? 'border-slate-900 bg-slate-50/80 shadow-xs' : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{t('petitionTitle')}</div>
                  <div className="text-[11px] text-slate-500">{t('petitionDesc')}</div>
                </div>
                <span className={`text-xs font-bold ${orgData.enablePublicPetitions ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {orgData.enablePublicPetitions ? t('enabled') : t('disabled')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrgData({ ...orgData, enableTransparencyLedger: !orgData.enableTransparencyLedger })}
                className={`p-3 w-full text-left border rounded-sm flex items-center justify-between transition-all ${
                  orgData.enableTransparencyLedger ? 'border-slate-900 bg-slate-50/80 shadow-xs' : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{t('transparencyTitle')}</div>
                  <div className="text-[11px] text-slate-500">{t('transparencyDesc')}</div>
                </div>
                <span className={`text-xs font-bold ${orgData.enableTransparencyLedger ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {orgData.enableTransparencyLedger ? t('enabled') : t('disabled')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrgData({ ...orgData, enableEmergencySos: !orgData.enableEmergencySos })}
                className={`p-3 w-full text-left border rounded-sm flex items-center justify-between transition-all ${
                  orgData.enableEmergencySos ? 'border-slate-900 bg-slate-50/80 shadow-xs' : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">{t('sosTitle')}</div>
                  <div className="text-[11px] text-slate-500">{t('sosDesc')}</div>
                </div>
                <span className={`text-xs font-bold ${orgData.enableEmergencySos ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {orgData.enableEmergencySos ? t('enabled') : t('disabled')}
                </span>
              </button>
            </div>

            {/* Configuration Review Summary Card */}
            <div className="border border-slate-200 bg-slate-50 p-4 rounded-sm space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('reviewSummary')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-white p-2.5 border border-slate-200 rounded-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-500">{isHi ? 'संगठन नाम व वेब पता' : 'Organisation & URL'}</div>
                  <div className="font-bold text-slate-900 mt-0.5 truncate">{orgData.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">{appUrl.replace(/^https?:\/\//, '')}/{orgData.slug}</div>
                </div>

                <div className="bg-white p-2.5 border border-slate-200 rounded-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-500">{t('selectedArchetype')}</div>
                  <div className="font-bold text-slate-900 mt-0.5">{isHi ? currentOrgConfig?.hi : currentOrgConfig?.en}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{isHi ? currentBlueprint?.titleHi : currentBlueprint?.titleEn}</div>
                </div>

                <div className="bg-white p-2.5 border border-slate-200 rounded-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-500">{t('legalClassification')}</div>
                  <div className="font-bold text-slate-900 mt-0.5">{isHi ? currentLegalOption?.titleHi : currentLegalOption?.titleEn}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 truncate">{isHi ? currentLegalOption?.actHi : currentLegalOption?.actEn}</div>
                </div>

                <div className="bg-white p-2.5 border border-slate-200 rounded-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-500">{t('adminDesignation')} & {t('membershipPlan')}</div>
                  <div className="font-bold text-slate-900 mt-0.5">{orgData.primaryRole}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {orgData.duesType === 'free'
                      ? (isHi ? 'मुफ्त खुली सदस्यता' : 'Free Open Membership')
                      : (isHi ? `मासिक शुल्क: ₹ ${orgData.monthlyDues}` : `Monthly Dues: ₹ ${orgData.monthlyDues}`)}
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-indigo-50/50 border border-indigo-100 rounded-xs flex items-center gap-2 text-[11px] text-indigo-900">
                <span className="text-sm">📱</span>
                <span>
                  {isHi
                    ? 'लॉन्च के बाद संगठन को सीधे Android या iPhone होमस्क्रीन पर 1-टैप ऐप के रूप में इंस्टॉल किया जा सकता है।'
                    : 'Your organization portal is 100% PWA-ready for instant 1-tap installation on Android & iOS homescreens.'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBack}
              disabled={loading}
              className="text-xs border-slate-300 h-9 px-3 rounded-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              {t('back')}
            </Button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <Button
              type="button"
              size="sm"
              onClick={handleNext}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 px-5 rounded-sm shadow-xs"
            >
              <span>{t('continue')}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          ) : (
            <Button
              type="button"
              disabled={loading}
              onClick={handleFinalSubmit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-6 rounded-sm shadow-md transition-all flex items-center gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('launching')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t('launch')}</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Official Emblem & Logo Generator Modal */}
      <LogoGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        orgName={orgData.name || 'My Organisation'}
        orgType={orgData.type}
        orgSlug={orgData.slug || 'org'}
        lang={lang}
        onLogoSelected={(_url, dataUrl) => {
          setOrgData((prev) => ({ ...prev, logoUrl: dataUrl }))
        }}
      />
    </div>
  )
}
