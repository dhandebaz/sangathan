import { createClient } from '@/lib/supabase/server'
import { getUserContext } from '@/lib/auth/context'
import { PrintLayout } from '@/components/print/print-layout'

export const dynamic = 'force-dynamic'

export default async function PrintMembersPage() {
  const supabase = await createClient()
  const ctx = await getUserContext()
  
  const { data, error } = await supabase
    .from('members')
    .select('*')
    .eq('status', 'active')
    .order('full_name', { ascending: true })
  
  const members = data as any[]
    
  if (error) return <div>Error loading members</div>

  const { data: orgData } = await supabase
    .from('organisations')
    .select('name')
    .eq('id', ctx.organizationId)
    .single()
  
  const org = orgData as any

  return (
    <PrintLayout title="Member List" orgName={org?.name || 'Organisation'}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Designation</th>
            <th>Area</th>
            <th>Joining Date</th>
          </tr>
        </thead>
        <tbody>
          {members?.map((member) => (
            <tr key={member.id}>
              <td>{member.full_name}</td>
              <td>{member.phone}</td>
              <td>{member.designation || '-'}</td>
              <td>{member.area || '-'}</td>
              <td>{new Date(member.joining_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PrintLayout>
  )
}
