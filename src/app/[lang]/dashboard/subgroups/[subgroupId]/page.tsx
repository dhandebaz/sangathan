import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { addSubgroupMember, getSubgroup, updateSubgroupMemberRole, removeSubgroupMember } from '@/actions/subgroups'
import { Network, ArrowLeft, UserPlus, Trash } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function SubgroupDetailPage(
  props: { params: Promise<{ lang: string, subgroupId: string }> }
) {
  const params = await props.params
  const { lang, subgroupId } = params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile?.organisation_id) {
    redirect(`/${lang}/onboarding`)
  }

  const { data: subgroup } = await getSubgroup(subgroupId, profile.organisation_id)

  if (!subgroup) return <div>Subgroup not found</div>

  // To allow adding members, get all org members
  const { data: allMembers } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('organisation_id', profile.organisation_id)

  const isAdmin = profile.role === 'admin' || profile.role === 'executive'
  const members = subgroup.org_subgroup_members || []

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Link href={`/${lang}/dashboard/subgroups`} className="text-sm text-brand-600 hover:underline flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" /> Back to Teams & Committees
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Network className="w-8 h-8 text-brand-600" />
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{subgroup.name}</CardTitle>
                <span className="text-xs uppercase font-bold tracking-wider bg-slate-100 text-slate-600 px-2 py-1 rounded">
                  {subgroup.type}
                </span>
              </div>
              <p className="text-slate-600 text-sm mt-1">{subgroup.description || 'No description'}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">Members ({members.length})</h2>
          </div>

          <Card>
            <CardContent className="p-0 divide-y">
              {members.map((m: any) => (
                <div key={m.profile_id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-50 gap-4">
                  <div>
                    <div className="font-medium text-slate-900">{m.profiles?.full_name || 'Unknown'}</div>
                    <div className="text-sm text-slate-500">{m.profiles?.email}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {!isAdmin && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${m.role === 'lead' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                        {m.role}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {members.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  No members in this team yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {isAdmin && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Add Member</h2>
            <Card>
              <CardContent className="p-4 space-y-4">
                <form action={async (formData) => {
                  'use server'
                  const profileId = formData.get('profileId') as string
                  const role = formData.get('role') as string
                  if (profileId) {
                    await addSubgroupMember(subgroupId, profileId, role)
                  }
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Select Member</label>
                    <select name="profileId" className="w-full border rounded-lg px-3 py-2 text-sm min-h-11" required>
                      <option value="">-- Choose Member --</option>
                      {allMembers?.map((m: any) => (
                        <option key={m.id} value={m.id}>{m.full_name || m.email}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role in Team</label>
                    <select name="role" className="w-full border rounded-lg px-3 py-2 text-sm min-h-11" required>
                      <option value="member">Member</option>
                      <option value="lead">Lead</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add to Team
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
