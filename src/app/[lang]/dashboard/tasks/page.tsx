import { createClient } from '@/lib/supabase/server'
import { TaskCard } from '@/components/tasks/task-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function TasksPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <div>Please login</div>

  const { data: profileData } = await supabase.from('profiles').select('organisation_id, role').eq('id', user.id).single()
  const profile = profileData as { organisation_id: string | null; role: string } | null
  
  if (!profile || !profile.organisation_id) return <div>No Organisation</div>

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*, task_assignments(member_id, accepted)')
    .eq('organisation_id', profile.organisation_id)
    .neq('status', 'archived')
    .order('created_at', { ascending: false })

  const canManage = ['admin', 'executive', 'editor'].includes(profile.role)

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-start gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Volunteer Tasks</h1>
          <p className="text-slate-500 mt-2">Manage and track volunteer activities and assignments.</p>
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
          <TaskCard key={task.id} task={task} userId={user.id} canManage={canManage} />
        ))}

        {(!tasks || tasks.length === 0) && (
          <div className="col-span-full text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500 mb-6">
              No active tasks yet. Create your first task to get started.
            </p>
            {canManage && (
              <Button asChild>
                <Link href={`/${lang}/dashboard/tasks/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first task
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
