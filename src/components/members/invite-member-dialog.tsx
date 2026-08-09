'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Link2, Loader2, CheckCircle2, Users, Copy } from 'lucide-react'
import { createInvite } from '@/actions/invites'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export function InviteMemberDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'member' | 'editor' | 'admin'>('member')
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  async function handleSendInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setInviteLink(null)

    const result = await createInvite({ email, role })

    if (result.success && 'inviteLink' in result && result.inviteLink) {
      setInviteLink(result.inviteLink as string)
      toast.success(`Invite sent to ${email}`)
      setEmail('')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to send invite')
    }
    setIsLoading(false)
  }

  function copyLink() {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      toast.success('Invite link copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleClose() {
    setIsOpen(false)
    setEmail('')
    setRole('member')
    setInviteLink(null)
    setCopied(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Mail className="w-4 h-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Invite Team Member
          </DialogTitle>
          <DialogDescription>
            Send an invite link to add members to your organisation.
          </DialogDescription>
        </DialogHeader>

        {inviteLink ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-700">Invite created successfully!</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700">Share this link</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-xs font-mono text-slate-600 truncate">
                  {inviteLink}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={copyLink}
                  className="shrink-0"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button type="button" variant="outline" onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSendInvite} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email" className="text-xs font-semibold text-slate-700">Email Address *</Label>
              <Input
                id="invite-email"
                type="email"
                required
                placeholder="colleague@org.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-role" className="text-xs font-semibold text-slate-700">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as 'member' | 'editor' | 'admin')}>
                <SelectTrigger id="invite-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !email} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Link2 className="mr-2 h-4 w-4" />
                    Send Invite
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
