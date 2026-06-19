import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSubgroups, createSubgroup } from '@/actions/subgroups'
import Link from 'next/link'
import { Network, Plus, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Subgroup {
  id: string
  name: string
  type: string
  description: string | null
  org_subgroup_members: { count: number }[]
}

export default async function SubgroupsPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params
  const lang = params.lang
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${lang}/login`)
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile?.organisation_id) {
    redirect(`/${lang}/onboarding`)
  }

  const { data: subgroupsData } = await getSubgroups(profile.organisation_id)
  const subgroups = (subgroupsData || []) as unknown as Subgroup[]
  const isAdmin = profile.role === 'admin' || profile.role === 'executive'

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Network className="w-6 h-6 text-brand-600" />
            Teams & Committees
          </h1>
          <p className="text-muted-foreground mt-1">Manage departments, chapters, and committees</p>
        </div>
        {isAdmin && (
          <form action={async (formData) => {
            'use server'
            const name = formData.get('name') as string
            const subgroupType = formData.get('type') as string
            if (name && subgroupType) {
              await createSubgroup({
                organisationId: profile.organisation_id,
                name,
                type: subgroupType as "department" | "committee" | "chapter" | "team"
              })
            }
          }} className="flex flex-wrap gap-2">
            <Input name="name" placeholder="New Team Name" className="max-w-xs" required />
            <select name="type" className="border rounded-lg px-3 py-2 text-sm min-h-11 bg-card">
              <option value="department">Department</option>
              <option value="committee">Committee</option>
              <option value="chapter">Chapter</option>
              <option value="team">Team</option>
            </select>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </form>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subgroups.map((subgroup) => (
          <Link href={`/${lang}/dashboard/subgroups/${subgroup.id}`} key={subgroup.id}>
            <Card className="hover:border-brand-300 hover:shadow-md transition cursor-pointer h-full group">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg group-hover:text-brand-700">{subgroup.name}</CardTitle>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-muted text-muted-foreground px-2 py-1 rounded">
                    {subgroup.type}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {subgroup.description || 'No description provided.'}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{subgroup.org_subgroup_members?.[0]?.count || 0} members</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {subgroups.length === 0 && (
          <div className="col-span-full py-12 text-center bg-muted rounded-xl border border-dashed">
            <Network className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-foreground">No teams yet</h3>
            <p className="text-muted-foreground text-sm mt-1">Create a team or committee to organize your members.</p>
          </div>
        )}
      </div>
    </div>
  )
}
