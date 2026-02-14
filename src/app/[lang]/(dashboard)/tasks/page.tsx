import { createClient } from '@/lib/supabase/server'
import { TaskCard } from '@/components/tasks/task-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { checkCapability } from '@/lib/capabilities'

export const dynamic = 'force-dynamic'

export default async function TasksPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <div>Please login</div>

  const { data: profileData } = await supabase.from('profiles').select('organization_id, role').eq('id', user.id).single()
  const profile = profileData as { organization_id: string; role: string } | null
  
  if (!profile || !profile.organization_id) return <div>No Organisation</div>

  const canTasks = await checkCapability(profile.organization_id, 'volunteer_engine')
  if (!canTasks) return <div className="p-8 text-center text-gray-500">This feature is not enabled for your organisation.</div>

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, task_assignments(member_id, accepted)')
    .eq('organisation_id', profile.organization_id)
    .neq('status', 'archived')
    .order('created_at', { ascending: false })

  const canManage = ['admin', 'editor'].includes(profile.role)

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Volunteer Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and track volunteer activities.</p>
        </div>
        {canManage && (
          <Button asChild>
            <Link href={`/${lang}/dashboard/tasks/new`}>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks?.map((task) => (
          <TaskCard key={task.id} task={task} userId={user.id} />
        ))}

        {(!tasks || tasks.length === 0) && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed">
            <p className="text-gray-500">No active tasks.</p>
          </div>
        )}
      </div>
    </div>
  )
}
