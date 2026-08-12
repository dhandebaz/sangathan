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
          <Button variant="outline" asChild className="text-xs font-bold border-orange-200 bg-orange-50/50 text-orange-950 hover:bg-orange-100">
            <Link href={`/${lang}/dashboard/forms/import`}>
              <svg className="mr-2 h-3.5 w-3.5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {lang === 'hi' ? 'Google Forms से आयात' : 'Google Forms Import'}
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
