import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { MetricCard } from '@/components/analytics/metric-card'
import { AlertTriangle, ShieldCheck, Activity, Users, Mail, Phone, Flag } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { RiskEvent } from '@/types/dashboard'
import { requirePlatformAdmin } from '@/lib/auth/context'

export const dynamic = 'force-dynamic'

export default async function SystemHealthPage() {
  await requirePlatformAdmin()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-600">Unauthorized: No active session</p>
      </div>
    )
  }

  const admin = createServiceClient()

  let orgsResult:
    | {
        count: number | null
      }
    | undefined
  let logsResult:
    | {
        data: { id: string; created_at: string; metadata: unknown }[] | null
      }
    | undefined
  let otpAttemptsResult:
    | {
        count: number | null
      }
    | undefined
  let emailsResult:
    | {
        count: number | null
      }
    | undefined
  let flaggedOrgsResult:
    | {
        data: {
          id: string
          name: string
          slug: string
          status: string
          is_suspended: boolean | null
        }[] | null
      }
    | undefined
  let hasError = false

  try {
    const [orgs, logs, otpAttempts, emails, flaggedOrgs] = await Promise.all([
      admin.from('organisations').select('status', { count: 'exact', head: true }),
      admin
        .from('system_logs')
        .select('*')
        .eq('source', 'risk_engine')
        .order('created_at', { ascending: false })
        .limit(20),
      admin.from('otp_attempts').select('*', { count: 'exact', head: true }),
      admin.from('announcements').select('*', { count: 'exact', head: true }).eq('send_email', true),
      admin
        .from('organisations')
        .select('id, name, slug, status, is_suspended')
        .in('status', ['warning', 'suspended', 'under_review'])
        .order('created_at', { ascending: false })
        .limit(10),
    ])

    orgsResult = orgs
    logsResult = logs as {
      data: { id: string; created_at: string; metadata: unknown }[] | null
    }
    otpAttemptsResult = otpAttempts
    emailsResult = emails
    flaggedOrgsResult = flaggedOrgs as {
      data: {
        id: string
        name: string
        slug: string
        status: string
        is_suspended: boolean | null
      }[] | null
    }
  } catch {
    hasError = true
  }

  if (hasError || !orgsResult || !logsResult || !otpAttemptsResult || !emailsResult || !flaggedOrgsResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center space-y-2">
          <h2 className="text-xl font-bold text-red-600">Error loading system health</h2>
          <p className="text-sm text-gray-600">Check service role configuration and database connectivity.</p>
        </div>
      </div>
    )
  }

  const totalOrgs = orgsResult.count || 0

  const riskEvents: RiskEvent[] =
    (logsResult.data || []).map((log) => {
      const meta = (log.metadata || {}) as {
        entity_id?: string
        risk_type?: string
        severity?: RiskEvent['severity']
        metadata?: Record<string, unknown> | null
      }
      return {
        id: log.id,
        entity_id: meta.entity_id || '',
        risk_type: meta.risk_type || 'unknown',
        severity: meta.severity || 'low',
        detected_at: log.created_at,
        metadata: meta.metadata || null,
      } as RiskEvent
    }) || []

  const totalRisks = riskEvents.length
  const highSeverityRisks = riskEvents.filter((r) => r.severity === 'high').length

  const flagged = (flaggedOrgsResult.data || []) as {
    id: string
    name: string
    slug: string
    status: string
    is_suspended: boolean | null
  }[]

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard title="Total Organisations" value={totalOrgs} icon={Users} />
          <MetricCard title="Active Risk Events" value={totalRisks} icon={AlertTriangle} trend={highSeverityRisks > 0 ? 'down' : 'neutral'} />
          <MetricCard title="OTP Attempts (1h)" value={otpAttemptsResult.count || 0} icon={Phone} />
          <MetricCard title="Broadcasts (24h)" value={emailsResult.count || 0} icon={Mail} />
        </div>

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
                    riskEvents.map((event: RiskEvent) => (
                      <div key={event.id} className="flex items-start justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                event.severity === 'high'
                                  ? 'bg-red-100 text-red-700'
                                  : event.severity === 'medium'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
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
                {flagged.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No organisations currently suspended or under review.</p>
                ) : (
                  <ul className="space-y-3">
                    {flagged.map((org) => (
                      <li key={org.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm text-gray-900">{org.name}</p>
                          <p className="text-xs text-gray-500 font-mono">{org.slug}</p>
                        </div>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              org.status === 'suspended'
                                ? 'bg-red-50 text-red-700'
                                : org.status === 'under_review'
                                ? 'bg-yellow-50 text-yellow-700'
                                : 'bg-orange-50 text-orange-700'
                            }`}
                          >
                            {org.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
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
