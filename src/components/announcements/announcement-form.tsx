'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createAnnouncement } from '@/actions/announcements'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export function AnnouncementForm({ orgId }: { orgId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    visibility_level: 'public' | 'members' | 'volunteer' | 'core' | 'executive';
    is_pinned: boolean;
    send_email: boolean;
    scheduled_at: string;
    expires_at: string;
  }>({
    title: '',
    content: '',
    visibility_level: 'members',
    is_pinned: false,
    send_email: false,
    scheduled_at: '',
    expires_at: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const res = await createAnnouncement({
      organisation_id: orgId,
      title: formData.title,
      content: formData.content,
      visibility_level: formData.visibility_level,
      is_pinned: formData.is_pinned,
      send_email: formData.send_email,
      scheduled_at: formData.scheduled_at ? new Date(formData.scheduled_at).toISOString() : undefined,
      expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : undefined,
    })

    setLoading(false)
    if (res.success) {
      router.push('/dashboard/announcements')
      router.refresh()
    } else {
      alert(res.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border shadow-sm max-w-2xl mx-auto">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Important Update" />
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <textarea 
          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
          value={formData.content} 
          onChange={e => setFormData({...formData, content: e.target.value})} 
          placeholder="Write your announcement here..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Visibility</Label>
          <Select 
            value={formData.visibility_level} 
            onValueChange={(v: 'public' | 'members' | 'volunteer' | 'core' | 'executive') => setFormData({...formData, visibility_level: v})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public (Everyone)</SelectItem>
              <SelectItem value="members">Members Only</SelectItem>
              <SelectItem value="volunteer">Volunteers & Above</SelectItem>
              <SelectItem value="core">Core Team & Above</SelectItem>
              <SelectItem value="executive">Executive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 pt-6">
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="pinned" 
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              checked={formData.is_pinned} 
              onChange={e => setFormData({...formData, is_pinned: e.target.checked})} 
            />
            <Label htmlFor="pinned">Pin to Top</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="email" 
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              checked={formData.send_email} 
              onChange={e => setFormData({...formData, send_email: e.target.checked})} 
            />
            <Label htmlFor="email">Broadcast via Email</Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
        <div className="space-y-2">
          <Label>Schedule (Optional)</Label>
          <Input type="datetime-local" value={formData.scheduled_at} onChange={e => setFormData({...formData, scheduled_at: e.target.value})} />
          <p className="text-xs text-gray-500">Leave blank to publish immediately.</p>
        </div>
        <div className="space-y-2">
          <Label>Expires (Optional)</Label>
          <Input type="datetime-local" value={formData.expires_at} onChange={e => setFormData({...formData, expires_at: e.target.value})} />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? 'Posting...' : 'Post Announcement'}
      </Button>
    </form>
  )
}
