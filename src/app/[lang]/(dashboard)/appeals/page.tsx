import { createClient } from '@/lib/supabase/server'
import { AppealForm } from '@/components/governance/appeal-form'
import { redirect } from 'next/navigation'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AccessDenied } from '@/components/dashboard/access-denied'
import { Appeal } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

export default async function AppealsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profileData } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  const profile = profileData as { organisation_id: string | null; role: string } | null

  if (!profile || !profile.organisation_id || !['admin', 'executive', 'editor'].includes(profile.role)) {
    return <AccessDenied lang={lang} />
  }

  // Fetch Appeals
  const { data: appealsData } = await supabase
    .from('appeals')
    .select('*')
    .eq('organisation_id', profile.organisation_id)
    .order('created_at', { ascending: false })

  const appeals = appealsData as unknown as Appeal[] | null

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Governance Appeals</h1>
        <p className="text-gray-500">Manage appeals against platform actions.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold mb-4">Submit New Appeal</h2>
          <AppealForm orgId={profile.organisation_id} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Appeal History</h2>
          <div className="space-y-4">
            {appeals?.map((appeal) => (
              <Card key={appeal.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className={
                      appeal.status === 'accepted' ? 'bg-green-50 text-green-700' :
                      appeal.status === 'rejected' ? 'bg-red-50 text-red-700' :
                      'bg-yellow-50 text-yellow-700'
                    }>{appeal.status}</Badge>
                    <span className="text-xs text-gray-400">
                      {new Date(appeal.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 line-clamp-3 mb-2">{appeal.reason}</p>
                  {appeal.resolution_note && (
                    <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 mt-2 border-l-2 border-gray-300">
                      <strong>Resolution:</strong> {appeal.resolution_note}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            {(!appeals || appeals.length === 0) && (
              <p className="text-gray-500 text-sm italic">No appeals found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
