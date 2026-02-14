'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createEvent } from '@/actions/events'
import { useRouter } from 'next/navigation'

export function EventForm({ orgId, partners = [] }: { orgId: string, partners?: any[] }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    event_type: 'members',
    rsvp_enabled: true,
    capacity: '',
    collaborating_org_ids: [] as string[]
  })

  const handlePartnerToggle = (partnerId: string) => {
    setFormData(prev => {
      const exists = prev.collaborating_org_ids.includes(partnerId)
      return {
        ...prev,
        collaborating_org_ids: exists 
          ? prev.collaborating_org_ids.filter(id => id !== partnerId)
          : [...prev.collaborating_org_ids, partnerId]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const res = await createEvent({
      organisation_id: orgId,
      title: formData.title,
      description: formData.description,
      start_time: new Date(formData.start_time).toISOString(),
      end_time: formData.end_time ? new Date(formData.end_time).toISOString() : undefined,
      location: formData.location,
      event_type: formData.event_type as any,
      rsvp_enabled: formData.rsvp_enabled,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      collaborating_org_ids: formData.collaborating_org_ids
    })

    setLoading(false)
    if (res.success) {
      router.push('/dashboard/events')
    } else {
      alert(res.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border shadow-sm">
      <div className="space-y-2">
        <Label>Event Title</Label>
        <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Time</Label>
          <Input required type="datetime-local" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} />
        </div>
        <div className="space-y-2">
          <Label>End Time</Label>
          <Input type="datetime-local" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="123 Community Hall / Online Link" />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <textarea 
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Event Type</Label>
          <Select value={formData.event_type} onValueChange={v => setFormData({...formData, event_type: v})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="members">Members Only</SelectItem>
              <SelectItem value="volunteer">Volunteers & Above</SelectItem>
              <SelectItem value="core">Core Team & Above</SelectItem>
              <SelectItem value="executive">Executive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Capacity (Optional)</Label>
          <Input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} placeholder="Unlimited" />
        </div>
      </div>

      {partners.length > 0 && (
        <div className="space-y-3 pt-4 border-t">
           <Label>Co-host with Coalition Partners</Label>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
             {partners.map(p => (
               <div key={p.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50">
                  <input 
                    type="checkbox" 
                    id={`partner-${p.id}`} 
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                    checked={formData.collaborating_org_ids.includes(p.id)}
                    onChange={() => handlePartnerToggle(p.id)}
                  />
                  <Label htmlFor={`partner-${p.id}`} className="cursor-pointer flex-1">
                    <span className="font-medium">{p.name}</span>
                    <span className="ml-1 text-xs text-gray-500">@{p.slug}</span>
                  </Label>
               </div>
             ))}
           </div>
        </div>
      )}

      <div className="flex items-center space-x-2 pt-2">
        <input 
          type="checkbox" 
          id="rsvp" 
          className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
          checked={formData.rsvp_enabled} 
          onChange={e => setFormData({...formData, rsvp_enabled: e.target.checked})} 
        />
        <Label htmlFor="rsvp">Enable RSVP</Label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Create Event'}
      </Button>
    </form>
  )
}
