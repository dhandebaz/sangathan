import { createClient } from '@/lib/supabase/server'
import { getUserContext } from '@/lib/auth/context'
import { AppealForm } from '@/components/governance/appeal-form'

export const dynamic = 'force-dynamic'

export default async function AppealsPage() {
  const supabase = await createClient()
  const ctx = await getUserContext()
  
  // Fetch existing appeals
  const { data: appeals } = await supabase
    .from('appeals')
    .select('*')
    .eq('organisation_id', ctx.organizationId)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Governance Appeals</h1>
        <p className="text-muted-foreground mt-1">
          Direct line to the Foundation for contesting automated restrictions or policy decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">File New Appeal</h2>
            <AppealForm organisationId={ctx.organizationId} />
         </div>

         <div>
            <h2 className="text-lg font-bold mb-4">Appeal History</h2>
            <div className="space-y-4">
               {appeals?.map((appeal) => (
                   <div key={appeal.id} className="bg-card rounded-lg border border-border p-4 shadow-sm">
                     <div className="flex justify-between items-start mb-2">
                        <span className="font-medium capitalize text-foreground">{appeal.type} Appeal</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize
                           ${appeal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                           ${appeal.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                           ${appeal.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                           {appeal.status}
                        </span>
                     </div>
                     <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{appeal.reason}</p>
                     <div className="text-xs text-muted-foreground">
                        {new Date(appeal.created_at).toLocaleDateString()}
                     </div>
                  </div>
               ))}
               
               {(!appeals || appeals.length === 0) && (
                   <div className="text-center py-8 text-muted-foreground bg-muted rounded-lg border border-dashed border-border">
                     No appeals filed.
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  )
}
