import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Book, ShieldAlert, Database, ServerCrash } from 'lucide-react'

export default function RunbookPage() {
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Book className="w-8 h-8 text-orange-600" />
        <h1 className="text-3xl font-bold">System Runbook</h1>
      </div>

      <div className="grid gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <ShieldAlert className="w-5 h-5" /> Critical Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Database Outage / Unreachable</AccordionTrigger>
                <AccordionContent className="prose text-sm text-gray-600">
                  <ol>
                    <li>Check <strong>Supabase Status Page</strong> for regional outages.</li>
                    <li>If local issue, check connection pooler limits in Supabase Dashboard.</li>
                    <li><strong>Action:</strong> Enable <code>Maintenance Mode</code> via System Settings immediately.</li>
                    <li>If permanent data corruption: Initiate Point-in-Time Recovery (PITR) from yesterday's backup.</li>
                    <li>Notify users via Status Page or Email (if external email provider is working).</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>OTP Provider Failure (Firebase)</AccordionTrigger>
                <AccordionContent className="prose text-sm text-gray-600">
                  <ol>
                    <li>Verify failure via <code>/api/health</code> logs or Firebase Console.</li>
                    <li><strong>Action:</strong> Enable Degraded Mode: <code>disable_otp_signup</code>.</li>
                    <li>Users logged in can continue working. New signups will be paused.</li>
                    <li>Monitor Firebase status for resolution.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Database className="w-5 h-5" /> Maintenance Procedures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="m-1">
                <AccordionTrigger>Enabling Maintenance Mode</AccordionTrigger>
                <AccordionContent className="text-sm">
                  Run SQL: 
                  <pre className="bg-gray-100 p-2 rounded mt-2 text-xs">
                    UPDATE system_settings SET value = '{`{"enabled": true, "message": "Upgrading DB"}`}' WHERE key = 'maintenance_mode';
                  </pre>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="m-2">
                <AccordionTrigger>Restoring Soft-Deleted Org</AccordionTrigger>
                <AccordionContent className="text-sm">
                  Run SQL:
                  <pre className="bg-gray-100 p-2 rounded mt-2 text-xs">
                    UPDATE organisations SET deleted_at = NULL WHERE id = 'ORG_UUID';
                  </pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <ServerCrash className="w-5 h-5" /> Queue Recovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="q-1">
                <AccordionTrigger>Reprocessing Failed Jobs</AccordionTrigger>
                <AccordionContent className="text-sm">
                  To retry all failed jobs from the last hour:
                  <pre className="bg-gray-100 p-2 rounded mt-2 text-xs">
                    UPDATE system_jobs 
                    SET status = 'pending', attempts = 0, last_error = NULL 
                    WHERE status = 'failed' AND created_at &gt; NOW() - INTERVAL '1 hour';
                  </pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
