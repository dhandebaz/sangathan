import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { Plus, Eye, Copy, FileText, FileSpreadsheet } from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AccessDenied } from '@/components/dashboard/access-denied'
import { FormStatusToggle } from '@/components/forms/form-status-toggle'

export const dynamic = 'force-dynamic'

export default async function FormsPage(props: { params: Promise<{ lang: string }> }) {
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

  if (!profile || !profile.organisation_id) {
    return <AccessDenied lang={lang} />
  }

  const orgId = profile.organisation_id
  let forms: any[] = []

  const { data, error } = await supabase
    .from('forms')
    .select('id, title, description, is_active, created_at, form_submissions(count)')
    .eq('organisation_id', orgId)
    .order('created_at', { ascending: false })
  
  if (error) {
    try {
      const adminClient = createServiceClient()
      const fallbackRes = await adminClient
        .from('forms')
        .select('id, title, description, is_active, created_at, form_submissions(count)')
        .eq('organisation_id', orgId)
        .order('created_at', { ascending: false })

      if (!fallbackRes.error) {
        forms = fallbackRes.data || []
      }
    } catch {
      forms = []
    }
  } else {
    forms = data || []
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="space-y-1">
           <h1 className="text-3xl font-black tracking-tight text-foreground">Forms & Survey Studio</h1>
           <p className="text-muted-foreground text-xs">Build Jotform-like surveys, capture civic intelligence, and generate instant executive reports.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild className="text-xs font-bold border-slate-200">
            <Link href={`/${lang}/dashboard/forms/import`}>
              <FileSpreadsheet className="mr-2 h-3.5 w-3.5 text-orange-700" />
              {lang === 'hi' ? 'Google Forms से आयात करें' : 'Import Google Form'}
            </Link>
          </Button>
          <Button asChild className="bg-orange-700 hover:bg-orange-800 text-white font-bold text-xs">
            <Link href={`/${lang}/dashboard/forms/new`}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              {lang === 'hi' ? 'नया फॉर्म / सर्वे बनाएं' : 'Create Form / Survey'}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => {
          const subCount = form.form_submissions?.[0]?.count ?? form.form_submissions?.count ?? 0

          return (
            <div key={form.id} className="content-card rounded-2xl flex flex-col h-full relative group p-5 bg-card border border-border shadow-2xs hover:border-orange-300 transition-all">
               <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-extrabold text-base line-clamp-1 text-slate-900">{form.title}</h3>
                  <FormStatusToggle formId={form.id} isActive={form.is_active} />
               </div>
               
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2 flex-grow">
                 {form.description || 'No description provided.'}
                </p>

               <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border mt-auto">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                     <span className="w-2 h-2 rounded-full bg-emerald-500" />
                     <span>{subCount} Responses</span>
                  </div>
                   <div className="flex items-center gap-1">
                      <Link
                        href={`/${lang}/dashboard/forms/${form.id}`}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                      >
                         <Eye size={13} />
                         <span>Analytics</span>
                      </Link>
                      <Link
                        href={`/f/${form.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Open Public Link"
                      >
                        <Copy size={14} />
                     </Link>
                   </div>
               </div>
            </div>
          )
        })}

        {forms.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                <p>No forms created yet.</p>
            </div>
        )}
      </div>
    </div>
  )
}
