import { getSelectedOrganisationId } from '@/lib/auth/context'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { User, QrCode, School, Calendar, Building2 } from 'lucide-react'

export default async function DigitalIDPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()
  
  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const supabase = await createClient()

  // Get current user profile and org details
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      organisations (name, type)
    `)
    .eq('user_id', user?.id || '')
    .eq('organisation_id', organisationId)
    .single()

  if (!profile) return <div>Profile not found.</div>

  // We can render a neat Digital ID Card UI
  return (
    <div className="space-y-6 max-w-md mx-auto py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Digital ID Card</h1>
        <p className="text-muted-foreground mt-2">Your official organization identifier.</p>
      </div>

      <Card className="relative overflow-hidden border-2 shadow-xl bg-white rounded-2xl">
        {/* Header Ribbon */}
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center p-6 relative">
          <div className="absolute top-4 left-4">
            <School className="w-8 h-8 text-white opacity-80" />
          </div>
          <h2 className="text-white font-bold text-xl uppercase tracking-wider text-center z-10 drop-shadow-md">
            {profile.organisations?.name}
          </h2>
          
          {/* Abstract background pattern for premium feel */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>

        {/* Photo and Details */}
        <div className="p-6 pt-12 relative flex flex-col items-center">
          {/* Avatar floating */}
          <div className="absolute -top-12 w-24 h-24 bg-white rounded-full p-1.5 shadow-lg border">
            <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
              <User className="w-12 h-12 text-slate-400" />
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900 mt-2">{profile.full_name}</h3>
          <p className="text-indigo-600 font-semibold uppercase tracking-wide text-sm mt-1 mb-6">
            {profile.role} Member
          </p>

          <div className="w-full space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Org Type</p>
                  <p className="text-sm font-semibold text-slate-900 capitalize">{profile.organisations?.type}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Joined</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 mb-2 flex flex-col items-center">
            <div className="p-3 bg-white border-2 border-slate-100 rounded-xl shadow-sm mb-2">
              <QrCode className="w-16 h-16 text-slate-800" />
            </div>
            <p className="text-xs text-slate-400 font-mono tracking-widest">{profile.id.split('-')[0].toUpperCase()}</p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 p-3 text-center border-t text-xs text-slate-400 font-medium">
          Official Digital Identifier • Valid while membership is active
        </div>
      </Card>
    </div>
  )
}
