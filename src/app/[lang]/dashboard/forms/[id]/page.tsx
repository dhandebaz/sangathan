import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { AccessDenied } from '@/components/dashboard/access-denied'
import { CsvExportButton } from '@/components/forms/csv-export-button'
import { FormStatusToggle } from '@/components/forms/form-status-toggle'
import { deleteForm } from '@/actions/forms/actions'
import { DashboardForm, DashboardFormField } from '@/types/dashboard'

interface PageProps {
  params: Promise<{ lang: string; id: string }>
}

export const dynamic = 'force-dynamic'

export default async function FormDetailsPage({ params }: PageProps) {
  const { lang, id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profileData } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  const profile = profileData as { organisation_id: string | null; role: string } | null

  if (!profile || !profile.organisation_id || !['admin', 'editor', 'executive'].includes(profile.role)) {
    return <AccessDenied lang={lang} />
  }

  const orgId = profile.organisation_id

  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', id)
    .eq('organisation_id', orgId)
    .single()
  
  const form = data as DashboardForm | null

  if (error || !form) notFound()

  const { data: subData } = await supabase
    .from('form_submissions')
    .select('*')
    .eq('form_id', id)
    .order('created_at', { ascending: false })
  
  const submissions = subData as { id: string; created_at: string; data: Record<string, unknown> }[] | null

  const fields = (form.fields || []) as DashboardFormField[]

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
         <Link href={`/${lang}/dashboard/forms`} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft size={20} />
         </Link>
         <div>
            <h1 className="text-2xl font-bold">{form.title}</h1>
            <p className="text-sm text-muted-foreground">
               <span className="font-mono bg-muted px-1 rounded select-all">/f/{form.id}</span>
            </p>
         </div>
         <div className="ml-auto flex items-center gap-2">
            <FormStatusToggle formId={form.id} isActive={form.is_active} />
            
            <CsvExportButton data={submissions || []} filename={`${form.title}-submissions.csv`} />
            
            <form action={async () => {
               'use server'
               await deleteForm({ formId: id })
            }}>
                <button type="submit" className="text-red-500 hover:bg-red-50 p-2 rounded-lg" title="Delete Form">
                   <Trash2 size={18} />
                </button>
            </form>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="content-card rounded-lg lg:col-span-1 h-fit">
            <h3 className="font-bold text-muted-foreground uppercase text-xs mb-4">Overview</h3>
            <div className="space-y-4">
               <div>
                  <div className="text-3xl font-bold">{submissions?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Submissions</div>
               </div>
               <div>
                  <div className="text-sm font-medium">Fields</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                     {fields.map(f => (
                        <span key={f.id} className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                           {f.label}
                        </span>
                     ))}
                  </div>
               </div>
               <div className="pt-4 border-t">
                  <a 
                    href={`/f/${form.id}`} 
                    target="_blank"
                    className="flex min-h-11 w-full items-center justify-center rounded-lg bg-primary py-2 text-center text-sm font-semibold text-primary-foreground hover:bg-brand-700"
                  >
                    View Public Form
                  </a>
               </div>
            </div>
         </div>

         <div className="content-card rounded-lg lg:col-span-2 overflow-hidden p-0">
            <div className="p-4 border-b bg-muted">
               <h3 className="font-bold text-foreground">Recent Submissions</h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                  <thead>
                     <tr className="border-b">
                        <th className="py-3 px-4 font-medium text-muted-foreground w-32">Date</th>
                        {fields.slice(0, 3).map(f => (
                           <th key={f.id} className="py-3 px-4 font-medium text-muted-foreground">{f.label}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y">
                     {submissions?.length === 0 ? (
                        <tr>
                           <td colSpan={4} className="py-8 text-center text-muted-foreground">No submissions yet</td>
                        </tr>
                     ) : (
                        submissions?.map(sub => (
                           <tr key={sub.id} className="hover:bg-accent">
                              <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                                 {new Date(sub.created_at).toLocaleDateString()}
                              </td>
                              {fields.slice(0, 3).map(f => (
                                 <td key={f.id} className="py-3 px-4 max-w-xs truncate">
                                    {typeof sub.data[f.id] === 'object' 
                                       ? JSON.stringify(sub.data[f.id]) 
                                       : String(sub.data[f.id] || '-')
                                    }
                                 </td>
                              ))}
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
    </div>
  )
}
