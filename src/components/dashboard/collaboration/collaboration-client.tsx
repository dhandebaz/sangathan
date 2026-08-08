'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Network, Plus, CheckCircle2, XCircle, Users, Megaphone, FileText, Send, Sparkles, Loader2, ShieldCheck } from 'lucide-react'
import { createCollaborationRequest, respondToCollaborationRequest } from '@/actions/collaboration'
import { toast } from 'sonner'

interface CollaborationClientProps {
  organisationId: string
  activePartners: { id: string; name: string; slug: string }[]
  pendingIncoming: any[]
  pendingOutgoing: any[]
  availableOrgs: { id: string; name: string; slug: string; org_type: string }[]
}

export default function CollaborationClient({
  activePartners: initialPartners,
  pendingIncoming: initialIncoming,
  pendingOutgoing: initialOutgoing,
  availableOrgs
}: CollaborationClientProps) {
  const [partners, setPartners] = useState(initialPartners)
  const [incoming, setIncoming] = useState(initialIncoming)
  const [outgoing, setOutgoing] = useState(initialOutgoing)

  const [selectedTargetOrgId, setSelectedTargetOrgId] = useState('')
  const [loading, setLoading] = useState(false)

  // Joint Action Form state
  const [showJointForm, setShowJointForm] = useState(false)
  const [actionTitle, setActionTitle] = useState('')
  const [actionType, setActionType] = useState<'joint_gyapan' | 'joint_protest' | 'joint_press'>('joint_gyapan')
  const [actionDesc, setActionDesc] = useState('')

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTargetOrgId) return
    setLoading(true)

    try {
      const res = await createCollaborationRequest(selectedTargetOrgId)
      if (res.success) {
        toast.success('Collaboration invitation sent successfully!')
        window.location.reload()
      } else {
        toast.error(res.error || 'Failed to send invite')
      }
    } catch {
      toast.error('An error occurred while sending request')
    } finally {
      setLoading(false)
    }
  }

  const handleRespond = async (linkId: string, status: 'active' | 'rejected') => {
    setLoading(true)
    try {
      const res = await respondToCollaborationRequest(linkId, status)
      if (res.success) {
        toast.success(`Collaboration request ${status === 'active' ? 'accepted' : 'rejected'}`)
        window.location.reload()
      } else {
        toast.error(res.error || 'Failed to respond to request')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateJointAction = (e: React.FormEvent) => {
    e.preventDefault()
    if (!actionTitle) return
    toast.success(`Joint Action "${actionTitle}" created and broadcasted to alliance partners!`)
    setShowJointForm(false)
    setActionTitle('')
    setActionDesc('')
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white text-slate-900 p-6 rounded-sm border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Multi-Org Collaboration Hub (संयुक्त मोर्चा)</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Co-sign joint Gyapans, schedule joint protests/rallies, and manage campus student alliances.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowJointForm(!showJointForm)}
          className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 rounded-sm transition shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          {showJointForm ? 'Cancel Form' : 'New Joint Action'}
        </button>
      </div>

      {/* Joint Action Creation Form */}
      {showJointForm && (
        <Card className="border-2 border-purple-200 shadow-xl bg-white">
          <CardHeader className="border-b bg-purple-50/50">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Co-Organize Joint Action (संयुक्त कार्रवाई / ज्ञापन)
            </CardTitle>
            <CardDescription>
              Create a co-signed Gyapan, joint protest rally, or joint press release with linked alliance partners.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateJointAction}>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Action Title</label>
                  <input
                    type="text"
                    required
                    value={actionTitle}
                    onChange={e => setActionTitle(e.target.value)}
                    placeholder="e.g., Joint Delegation Regarding Hostel Mess Quality"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Action Type</label>
                  <select
                    value={actionType}
                    onChange={e => setActionType(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                  >
                    <option value="joint_gyapan">Co-Signed Gyapan (संयुक्त ज्ञापन)</option>
                    <option value="joint_protest">Joint Protest & March (संयुक्त प्रदर्शन)</option>
                    <option value="joint_press">Joint Press Statement (संयुक्त प्रेस विज्ञप्ति)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Action Description & Demands</label>
                <textarea
                  rows={4}
                  value={actionDesc}
                  onChange={e => setActionDesc(e.target.value)}
                  placeholder="Outline the demands and joint action details..."
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Co-Authoring Partner Organizations</label>
                <div className="flex flex-wrap gap-2">
                  {partners.map(p => (
                    <span key={p.id} className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-900 text-xs font-bold px-3 py-1 rounded-full border border-purple-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                      {p.name}
                    </span>
                  ))}
                  {partners.length === 0 && (
                    <p className="text-xs text-slate-500 italic">No linked partner organizations yet. Invite partners below.</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50 flex justify-end gap-3 p-4">
              <button
                type="button"
                onClick={() => setShowJointForm(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow"
              >
                Publish Joint Action to Alliance
              </button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Invite New Partner Card */}
      <Card className="border shadow-sm">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-slate-900 text-base flex items-center gap-2">
            <Plus className="w-4 h-4 text-purple-600" />
            Link Campus Partner Organization (गठबंधन पार्टनर जोड़ें)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row gap-3">
            <select
              required
              value={selectedTargetOrgId}
              onChange={e => setSelectedTargetOrgId(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="">-- Choose Campus Student Organization --</option>
              {availableOrgs.map(o => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.org_type})
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition shadow flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Send Collaboration Invite
            </button>
          </form>
        </CardContent>
      </Card>

      {/* Grid: Pending Invites & Active Alliance Partners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <Card className="border shadow-sm">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-slate-900 text-base flex items-center gap-2">
              <Send className="w-4 h-4 text-amber-600" />
              Pending Collaboration Requests ({incoming.length + outgoing.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {/* Incoming */}
            {incoming.map((item: any) => (
              <div key={item.id} className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{item.requester?.name}</p>
                  <p className="text-xs text-slate-500">Wants to link as joint action partner</p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleRespond(item.id, 'active')}
                    className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    title="Accept Invite"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRespond(item.id, 'rejected')}
                    className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                    title="Reject Invite"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Outgoing */}
            {outgoing.map((item: any) => (
              <div key={item.id} className="p-3 bg-slate-50 rounded-xl border flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{item.responder?.name}</p>
                  <p className="text-xs text-amber-600 font-semibold">Invite Sent (Pending Response)</p>
                </div>
              </div>
            ))}

            {incoming.length === 0 && outgoing.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No pending collaboration requests.</p>
            )}
          </CardContent>
        </Card>

        {/* Active Partners */}
        <Card className="border shadow-sm">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Active Alliance Partners ({partners.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {partners.map(p => (
              <div key={p.id} className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900 text-sm">{p.name}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold">Linked Joint Action Partner</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
            ))}

            {partners.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No active alliance partners linked yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
