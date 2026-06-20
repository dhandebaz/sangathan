'use client'

import { use, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, Clock, FileText, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { getSelectedOrganisationId } from '@/lib/auth/context'

type ComplianceItem = {
  id: string
  title: string
  description: string
  status: 'compliant' | 'pending' | 'overdue' | 'not_applicable'
  dueDate?: string
}

const ngoCompliance: ComplianceItem[] = [
  { id: '1', title: '12A Registration', description: 'Tax exemption status for the NGO.', status: 'compliant' },
  { id: '2', title: '80G Certification', description: 'Tax deduction certification for donors.', status: 'pending', dueDate: '2024-12-31' },
  { id: '3', title: 'FCRA Registration', description: 'Clearance to receive foreign contributions.', status: 'not_applicable' },
  { id: '4', title: 'Annual Financial Audit', description: 'Submission of audited statements for the previous fiscal year.', status: 'overdue', dueDate: '2024-03-31' },
]

const rwaCompliance: ComplianceItem[] = [
  { id: '1', title: 'Societies Registration Renewal', description: 'Annual renewal of RWA registration under the Societies Act.', status: 'pending', dueDate: '2024-10-15' },
  { id: '2', title: 'Fire Safety Clearance', description: 'Annual NOC from the Fire Department.', status: 'compliant' },
  { id: '3', title: 'Lift Maintenance Certificates', description: 'Quarterly safety inspection reports for all lifts.', status: 'compliant' },
  { id: '4', title: 'AGM Minutes Submission', description: 'Filing of the Annual General Meeting minutes.', status: 'overdue', dueDate: '2024-05-30' },
]

const workersUnionCompliance: ComplianceItem[] = [
  { id: '1', title: 'Trade Union Act Registration', description: 'Main union registration certificate.', status: 'compliant' },
  { id: '2', title: 'Annual Returns Filing', description: 'Submission of annual member count and financial returns.', status: 'pending', dueDate: '2024-11-01' },
  { id: '3', title: 'Strike Notice Clearance', description: 'Legal clearance and notice periods for ongoing ballots.', status: 'not_applicable' },
]

const studentUnionCompliance: ComplianceItem[] = [
  { id: '1', title: 'University Charter Agreement', description: 'Annual signing of the university guidelines and charter.', status: 'compliant' },
  { id: '2', title: 'Elections Expense Report', description: 'Submission of expenditure details from the last student election.', status: 'pending', dueDate: '2024-09-15' },
  { id: '3', title: 'Anti-Ragging Committee Formation', description: 'Mandatory establishment of a grievance and anti-ragging cell.', status: 'compliant' },
]

function getStatusColor(status: ComplianceItem['status']) {
  switch (status) {
    case 'compliant': return 'bg-green-100 text-green-800 border-green-200'
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'overdue': return 'bg-red-100 text-red-800 border-red-200'
    case 'not_applicable': return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

function getStatusIcon(status: ComplianceItem['status']) {
  switch (status) {
    case 'compliant': return <CheckCircle2 className="w-4 h-4 text-green-600" />
    case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />
    case 'overdue': return <AlertCircle className="w-4 h-4 text-red-600" />
    case 'not_applicable': return <FileText className="w-4 h-4 text-gray-500" />
  }
}

function getStatusLabel(status: ComplianceItem['status']) {
  switch (status) {
    case 'compliant': return 'Compliant'
    case 'pending': return 'Pending'
    case 'overdue': return 'Action Required'
    case 'not_applicable': return 'N/A'
  }
}

export default function CompliancePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params)
  const [orgType, setOrgType] = useState<string>('ngo')
  const supabase = createClient()
  
  useEffect(() => {
    async function fetchOrgType() {
      const orgId = await getSelectedOrganisationId()
      if (orgId) {
        const { data } = await supabase.from('organisations').select('org_type').eq('id', orgId).single()
        if (data?.org_type) {
          setOrgType(data.org_type)
        }
      }
    }
    fetchOrgType()
  }, [supabase])

  let activeCompliance = ngoCompliance
  if (orgType === 'rwa') activeCompliance = rwaCompliance
  if (orgType === 'workers_union') activeCompliance = workersUnionCompliance
  if (orgType === 'student_union') activeCompliance = studentUnionCompliance
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Compliance Tracker</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your legal and operational requirements specific to your organization type.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Your Requirements ({orgType.replace('_', ' ').toUpperCase()})</CardTitle>
            <CardDescription>
              We automatically adapt this checklist based on your organization type.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {activeCompliance.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-card">
                <div className="flex items-start gap-4 mb-4 sm:mb-0">
                  <div className="mt-1">
                    {getStatusIcon(item.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    {item.dueDate && (
                      <p className="text-xs font-medium text-slate-500 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Due by {new Date(item.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <Badge variant="outline" className={getStatusColor(item.status)}>
                    {getStatusLabel(item.status)}
                  </Badge>
                  {item.status !== 'compliant' && item.status !== 'not_applicable' && (
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                      <Upload className="w-3 h-3" /> Upload
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
