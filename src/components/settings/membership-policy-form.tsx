'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateMembershipPolicy, updateTransparency } from '@/actions/membership'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

export function MembershipPolicyForm({ orgId, currentPolicy }: { orgId: string, currentPolicy: string }) {
  const [policy, setPolicy] = useState(currentPolicy)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    const res = await updateMembershipPolicy({ 
      orgId, 
      policy: policy as 'open_auto' | 'admin_approval' | 'invite_only' 
    })
    setLoading(false)
    if (res.success) {
      alert('Policy updated')
      router.refresh()
    } else {
      alert(res.error)
    }
  }

  return (
    <div className="space-y-4 max-w-md p-6 bg-white border rounded-lg shadow-sm">
      <div className="space-y-2">
        <Label>Membership Policy</Label>
        <Select value={policy} onValueChange={setPolicy}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open_auto">Open (Auto-Approve)</SelectItem>
            <SelectItem value="admin_approval">Admin Approval</SelectItem>
            <SelectItem value="invite_only">Invite Only</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500">
          {policy === 'open_auto' && 'Anyone can join immediately.'}
          {policy === 'admin_approval' && 'Admins must approve requests.'}
          {policy === 'invite_only' && 'Only admins can add members.'}
        </p>
      </div>

      <Button onClick={handleSave} disabled={loading || policy === currentPolicy}>
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  )
}

export function TransparencyToggle({ orgId, enabled }: { orgId: string, enabled: boolean }) {
  const [active, setActive] = useState(enabled)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // We need an action for this. Creating inline here for speed or assume it exists.
  // Actually, we should update updateMembershipPolicy to generic updateOrgSettings or create new action.
  // Let's assume we can add it to membership.ts quickly or use a client-side update if RLS allows (Admin only).
  // Better to use server action.

  return (
    <div className="flex items-center justify-between p-6 bg-white border rounded-lg shadow-sm">
      <div>
        <h3 className="font-medium">Public Transparency</h3>
        <p className="text-sm text-gray-500">Show aggregate stats (members, events, hours) on your public page.</p>
      </div>
      <Button 
        variant={active ? "default" : "outline"}
        onClick={async () => {
           setLoading(true)
           const res = await updateTransparency({ orgId, enabled: !active })
           setLoading(false)
           if (res.success) {
             setActive(!active)
             router.refresh()
           } else {
             alert(res.error)
           }
        }}
        disabled={loading}
      >
        {active ? 'Enabled' : 'Disabled'}
      </Button>
    </div>
  )
}
