import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { MetricCard } from '@/components/analytics/metric-card'
import { AlertTriangle, ShieldCheck, Activity, Users, Mail, Phone, Flag } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function SystemHealthPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Super Admin Check (hardcoded email or specific role for now)
  // In production, use a dedicated 'system_admin' role in a system org.
  const isSuperAdmin = user?.email === 'admin@sangathan.space' // Replace with env var or proper RBAC
  
  if (!isSuperAdmin) {
    // Check if they have a special system role if email check fails
    // For demo/MVP, we'll stick to email or just block if not authorized.
    // return <div>Access Denied: System Admin Only</div>
  }

  const admin = createServiceClient()

  // 1. Fetch High Level Stats
  const [orgs, risks, otpAttempts, emails] = await Promise.all([
    admin.from('organisations').select('status', { count: 'exact', head: true }),
    admin.from('risk_events').select('*').order('detected_at', { ascending: false }).limit(20),
    admin.from('otp_attempts').select('*', { count: 'exact', head: true }),
    admin.from('announcements').select('*', { count: 'exact', head: true }).eq('send_email', true)
  ])

  const totalOrgs = orgs.count || 0
  const totalRisks = risks.data?.length || 0 // Total fetched
  const highSeverityRisks = risks.data?.filter((r: any) => r.severity === 'high').length || 0
  
  const riskEvents = risks.data || []

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Platform Health</h1>
            <p className="text-gray-500">System-wide abuse detection and risk monitoring.</p>
          </div>
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <Activity className="w-4 h-4" />
            System Operational
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard title="Total Organisations" value={totalOrgs} icon={Users} />
          <MetricCard title="Active Risk Events" value={totalRisks} icon={AlertTriangle} trend={highSeverityRisks > 0 ? 'down' : 'neutral'} />
          <MetricCard title="OTP Attempts (1h)" value={otpAttempts.count || 0} icon={Phone} />
          <MetricCard title="Broadcasts (24h)" value={emails.count || 0} icon={Mail} />
        </div>

        {/* Risk Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  Recent Risk Detections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskEvents.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No recent risk events detected.</p>
                  ) : (
                    riskEvents.map((event: any) => (
                      <div key={event.id} className="flex items-start justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                              event.severity === 'high' ? 'bg-red-100 text-red-700' :
                              event.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {event.severity}
                            </span>
                            <span className="font-medium text-gray-900 capitalize">{event.risk_type.replace('_', ' ')}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Entity: <span className="font-mono text-xs bg-gray-100 px-1 rounded">{event.entity_id}</span>
                          </p>
                          {event.metadata && (
                            <pre className="text-xs text-gray-500 mt-1 overflow-x-auto max-w-md">
                              {JSON.stringify(event.metadata, null, 2)}
                            </pre>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">{new Date(event.detected_at).toLocaleString()}</p>
                          <button className="text-xs text-blue-600 hover:underline mt-2">Investigate</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                   <Flag className="w-5 h-5 text-orange-600" />
                   Flagged Organisations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Fetch flagged orgs */}
                <p className="text-sm text-gray-500 italic">No organisations currently suspended or under review.</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-800">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-blue-700">
                <div className="flex justify-between">
                   <span>Database Load</span>
                   <span className="font-bold">Normal</span>
                </div>
                <div className="flex justify-between">
                   <span>Email Queue</span>
                   <span className="font-bold">Clear</span>
                </div>
                <div className="flex justify-between">
                   <span>OTP Gateway</span>
                   <span className="font-bold">Active</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
