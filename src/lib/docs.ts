import fs from 'fs'
import path from 'path'

const MANUAL_PATH = path.join(process.cwd(), 'docs/manual/OPERATIONAL_MANUAL.md')

export function getDocContent(slug: string): string | null {
  try {
    const fileContent = fs.readFileSync(MANUAL_PATH, 'utf8')
    
    const slugToHeaderMap: Record<string, string> = {
      'getting-started': 'Section 1: Getting Started',
      'members': 'Section 2: Members Module',
      'forms': 'Section 3: Forms System',
      'meetings': 'Section 4: Meetings System',
      'donations': 'Section 5: Donations System',
      'supporter-plan': 'Section 6: Supporter Plan',
      'security-governance': 'Section 7: Security & Governance',
      'admin-responsibilities': 'Section 8: Admin Responsibilities',
      'system-admin': 'Section 9: System Admin Documentation',
      'data-lifecycle': 'Section 10: Data Lifecycle',
      'troubleshooting': 'Section 11: Troubleshooting',
      'faq': 'Section 12: Frequently Asked Operational Questions',
    }

    const header = slugToHeaderMap[slug]
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
