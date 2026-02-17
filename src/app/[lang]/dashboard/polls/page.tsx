import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, BarChart2 } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Poll } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

export default async function PollsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <div>Please login</div>

  const { data: profileData } = await supabase.from('profiles').select('organisation_id, role').eq('id', user.id).single()
  const profile = profileData as { organisation_id: string | null; role: string } | null
  
  if (!profile?.organisation_id) return <div>No Organisation</div>

  const { data: polls } = await supabase
    .from('polls')
    .select('*')
    .eq('organisation_id', profile.organisation_id)
    .neq('status', 'archived')
    .order('created_at', { ascending: false }) as { data: Poll[] | null }

  const canManage = profile?.role && ['admin', 'editor'].includes(profile.role)

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Decisions & Polls</h1>
          <p className="text-muted-foreground mt-1">Vote on proposals and view results.</p>
        </div>
        {canManage && (
          <Button asChild>
            <Link href={`/${lang}/dashboard/polls/new`}>
              <Plus className="mr-2 h-4 w-4" />
              New Poll
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {polls?.map((poll) => (
          <Link href={`/${lang}/dashboard/polls/${poll.id}`} key={poll.id} className="block group">
            <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">{poll.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className={
                      poll.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100'
                    }>{poll.status}</Badge>
                    <Badge variant="secondary">{poll.type}</Badge>
                    {poll.voting_method === 'anonymous' && <Badge variant="outline">Anonymous</Badge>}
                  </div>
                </div>
                <BarChart2 className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-gray-500 mt-2 text-sm line-clamp-2">{poll.description}</p>
              <div className="mt-4 text-xs text-gray-400">
                Created {new Date(poll.created_at).toLocaleDateString()}
                {poll.end_time && ` • Ends ${new Date(poll.end_time).toLocaleDateString()}`}
              </div>
            </div>
          </Link>
        ))}

        {(!polls || polls.length === 0) && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
            <p className="text-gray-500 mb-4">
              No active polls yet.
            </p>
            {canManage && (
              <Button asChild>
                <Link href={`/${lang}/dashboard/polls/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first poll
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
