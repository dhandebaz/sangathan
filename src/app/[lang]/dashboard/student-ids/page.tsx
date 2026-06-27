import { createClient } from '@/lib/supabase/server'
import { getUserContext } from '@/lib/auth/context'
import { StudentIdsClient } from '@/components/dashboard/student-ids-client'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function StudentIdsPage(props: PageProps) {
  const { lang } = await props.params
  const supabase = await createClient()
  const ctx = await getUserContext()

  // Fetch student membership details
  const { data: students } = await supabase
    .from('members')
    .select('*')
    .eq('organisation_id', ctx.organizationId)
    .eq('status', 'active')

  // Fetch organization details for the card
  const { data: orgData } = await supabase
    .from('organisations')
    .select('name')
    .eq('id', ctx.organizationId)
    .single()

  const typedStudents = students || []
  const orgName = orgData?.name || 'Student Union'

  return (
    <div className="space-y-6">
      <StudentIdsClient
        initialStudents={typedStudents}
        lang={lang}
        orgName={orgName}
      />
    </div>
  )
}
