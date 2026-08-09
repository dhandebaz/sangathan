import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserMemberships } from '@/lib/auth/context'
import { Building2, ArrowRight } from 'lucide-react'
import { setOrgCookie } from './actions'

export const dynamic = 'force-dynamic'

export default async function SelectOrganisationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const memberships = await getUserMemberships(user.id)

  if (memberships.length === 0) {
    redirect('/onboarding')
  }

  if (memberships.length === 1) {
    const orgId = memberships[0].organisationId
    if (orgId) {
      redirect(`/bootstrap-org?org=${orgId}`)
    }
  }

  const supabaseAdmin = createClient()
  const orgIds = memberships
    .map((m) => m.organisationId)
    .filter((id): id is string => !!id)

  const { data: orgs } = await (supabaseAdmin as unknown as {
    from: (table: string) => {
      select: (cols: string) => {
        in: (col: string, vals: string[]) => Promise<{ data: unknown[] | null }>
      }
    }
  })
    .from('organisations')
    .select('id, name, slug, org_type, logo_url')
    .in('id', orgIds)

  const organisations = (orgs || []) as {
    id: string
    name: string
    slug: string
    org_type: string
    logo_url: string | null
  }[]

  async function selectOrganisation(formData: FormData) {
    'use server'
    const orgId = formData.get('orgId') as string
    if (orgId) {
      await setOrgCookie(orgId)
      redirect('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Select Organisation</h1>
          <p className="text-sm text-slate-500 mt-2">
            You are a member of multiple organisations. Choose which one to work with.
          </p>
        </div>

        <div className="space-y-3">
          {organisations.map((org) => (
            <form key={org.id} action={selectOrganisation}>
              <input type="hidden" name="orgId" value={org.id} />
              <button
                type="submit"
                className="w-full p-4 bg-white border border-slate-200 rounded-sm shadow-sm hover:border-indigo-300 hover:shadow-md transition-all text-left flex items-center gap-4"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  {org.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={org.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <Building2 className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{org.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{org.org_type.replace('_', ' ')}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  )
}
