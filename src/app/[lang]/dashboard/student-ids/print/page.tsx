import { createClient } from '@/lib/supabase/server'
import { getUserContext } from '@/lib/auth/context'
import { PrintLayout } from '@/components/print/print-layout'
import { StudentIdCard } from '@/components/dashboard/student-ids-client'

export const dynamic = 'force-dynamic'

interface PrintPageProps {
  params: Promise<{ lang: string }>
  searchParams: Promise<{ id?: string }>
}

export default async function StudentIdsPrintPage(props: PrintPageProps) {
  const { id } = await props.searchParams
  const supabase = await createClient()
  const ctx = await getUserContext()

  // Fetch organisation details
  const { data: orgData } = await supabase
    .from('organisations')
    .select('name')
    .eq('id', ctx.organizationId)
    .single()

  const orgName = orgData?.name || 'Student Union'

  // Fetch active students / member details
  let query = supabase
    .from('members')
    .select('*')
    .eq('organisation_id', ctx.organizationId)
    .eq('status', 'active')

  if (id) {
    query = query.eq('id', id)
  }

  const { data: students } = await query
  const typedStudents = students || []

  const title = id ? 'Student Identity Card' : 'Student Identity Cards Batch'

  return (
    <PrintLayout title={title} orgName={orgName}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center py-4 print:grid-cols-2">
        {typedStudents.map((student) => (
          <div key={student.id} className="print:break-inside-avoid print:mb-6">
            <StudentIdCard student={student} orgName={orgName} />
          </div>
        ))}
      </div>
      {typedStudents.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No active students found to print.
        </div>
      )}
    </PrintLayout>
  )
}
