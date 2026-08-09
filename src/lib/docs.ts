import fs from 'fs'
import path from 'path'

export function getDocContent(slug: string, lang: string = 'en'): string | null {
  try {
    const isHi = lang === 'hi'
    const fileName = isHi ? 'OPERATIONAL_MANUAL_HI.md' : 'OPERATIONAL_MANUAL.md'
    const MANUAL_PATH = path.join(process.cwd(), `docs/manual/${fileName}`)
    
    const fileContent = fs.readFileSync(MANUAL_PATH, 'utf8')
    
    const slugToHeaderMapEn: Record<string, string> = {
      'getting-started': 'Section 1: Getting Started',
      'members': 'Section 2: Members Module',
      'forms': 'Section 3: Forms System',
      'meetings': 'Section 4: Meetings System',
      'donations': 'Section 5: Donations System',
      'membership-requests': 'Section 6: Membership Requests',
      'announcements': 'Section 7: Announcements & Communication',
      'events-campaigns': 'Section 8: Events & Campaigns',
      'tasks-volunteers': 'Section 9: Tasks & Volunteers',
      'appeals-polls': 'Section 10: Appeals & Polls',
      'grievances': 'Section 11: Grievances & Complaints',
      'maintenance': 'Section 12: Maintenance',
      'student-ids': 'Section 13: Student IDs',
      'networks': 'Section 14: Networks & Coalitions',
      'analytics': 'Section 15: Analytics & Audit Logs',
      'support-sangathan': 'Section 16: Support Sangathan',
      'security-governance': 'Section 17: Security & Governance',
      'admin-responsibilities': 'Section 18: Admin Responsibilities',
      'system-admin': 'Section 19: System Admin Documentation',
      'data-lifecycle': 'Section 20: Data Lifecycle',
      'troubleshooting': 'Section 21: Troubleshooting',
      'faq': 'Section 22: Frequently Asked Operational Questions',
      'ngo-playbook': 'Section 23: NGO & Civil Society Handbook',
      'student-union-playbook': 'Section 24: Student Union & Campus Guild Handbook',
      'workers-union-playbook': 'Section 25: Trade Union & Labor Collective Handbook',
      'rwa-playbook': 'Section 26: Resident Welfare Association (RWA) Handbook',
      'data-importer': 'Section 27: Universal Data Importer & Spreadsheet Migration',
      'document-vault': 'Section 28: Sovereign Document & Asset Cloud Vault',
      'statutory-registers': 'Section 29: Statutory PDF Registers & Government Inspection Rolls',
      'master-reference-data': 'Section 30: Master Reference Data & National Geographical Standards',
    }

    const slugToHeaderMapHi: Record<string, string> = {
      'getting-started': 'अनुभाग 1: शुरू करना',
      'members': 'अनुभाग 2: सदस्य मॉड्यूल',
      'forms': 'अनुभाग 3: फॉर्म सिस्टम',
      'meetings': 'अनुभाग 4: बैठकें और कार्यवृत्त',
      'donations': 'अनुभाग 5: दान बहीखाता',
      'membership-requests': 'अनुभाग 6: सदस्यता अनुरोध',
      'announcements': 'अनुभाग 7: घोषणाएँ',
      'events-campaigns': 'अनुभाग 8: कार्यक्रम और अभियान',
      'tasks-volunteers': 'अनुभाग 9: कार्य और स्वयंसेवक',
      'appeals-polls': 'अनुभाग 10: अपील और मतदान',
      'grievances': 'अनुभाग 11: शिकायतें',
      'maintenance': 'अनुभाग 12: रखरखाव',
      'student-ids': 'अनुभाग 13: छात्र आईडी',
      'networks': 'अनुभाग 14: नेटवर्क और गठबंधन',
      'analytics': 'अनुभाग 15: एनालिटिक्स और ऑडिट लॉग',
      'support-sangathan': 'अनुभाग 16: संगठन का समर्थन करें',
      'security-governance': 'अनुभाग 17: सुरक्षा और शासन',
      'admin-responsibilities': 'अनुभाग 18: प्रशासक जिम्मेदारियां',
      'system-admin': 'अनुभाग 19: सिस्टम एडमिन दस्तावेज़ीकरण',
      'data-lifecycle': 'अनुभाग 20: डेटा जीवनचक्र',
      'troubleshooting': 'अनुभाग 21: समस्या निवारण',
      'faq': 'अनुभाग 22: अक्सर पूछे जाने वाले परिचालन प्रश्न',
      'ngo-playbook': 'अनुभाग 23: गैर सरकारी संगठन (NGO) व नागरिक समाज हैंडबुक',
      'student-union-playbook': 'अनुभाग 24: छात्र संघ व विश्वविद्यालय परिषद हैंडबुक',
      'workers-union-playbook': 'अनुभाग 25: श्रमिक संघ व ट्रेड यूनियन हैंडबुक',
      'rwa-playbook': 'अनुभाग 26: आवासीय कल्याण संघ (RWA) हैंडबुक',
      'data-importer': 'अनुभाग 27: यूनिवर्सल डेटा आयातक व स्प्रेडशीट माइग्रेशन',
      'document-vault': 'अनुभाग 28: संप्रभु दस्तावेज़ एवं परिसंपत्ति क्लाउड वॉल्ट',
      'statutory-registers': 'अनुभाग 29: वैधानिक PDF रजिस्टर व सरकारी निरीक्षण बहीखाता',
      'master-reference-data': 'अनुभाग 30: मास्टर संदर्भ डेटा व राष्ट्रीय भौगोलिक मानक',
    }

    const header = isHi ? slugToHeaderMapHi[slug] : slugToHeaderMapEn[slug]
    if (!header) return null

    // Extract content between this header and the next header (or end of file)
    // Headers are marked with "## "
    const sections = fileContent.split(/^## /m)
    
    // Find the section that starts with the header title (minus "## " since we split by it)
    const matchingSection = sections.find(s => s.trim().startsWith(header))
    
    if (!matchingSection) return null
    
    return `## ${matchingSection}`
  } catch (error) {
    console.error('Error reading manual:', error)
    return null
  }
}
