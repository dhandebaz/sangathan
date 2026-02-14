'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createPoll } from '@/actions/polls'
import { useRouter } from 'next/navigation'
import { Plus, Trash } from 'lucide-react'

export function PollForm({ orgId }: { orgId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'informal',
    visibility_level: 'members',
    voting_method: 'anonymous',
    end_time: '',
    options: ['', '']
  })

  const addOption = () => setFormData(p => ({ ...p, options: [...p.options, ''] }))
  const removeOption = (idx: number) => setFormData(p => ({ ...p, options: p.options.filter((_, i) => i !== idx) }))
  const updateOption = (idx: number, val: string) => {
    const newOptions = [...formData.options]
    newOptions[idx] = val
    setFormData(p => ({ ...p, options: newOptions }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const res = await createPoll({
      organisation_id: orgId,
      title: formData.title,
      description: formData.description,
      type: formData.type as any,
      visibility_level: formData.visibility_level as any,
      voting_method: formData.voting_method as any,
      end_time: formData.end_time ? new Date(formData.end_time).toISOString() : undefined,
      options: formData.options.filter(o => o.trim().length > 0)
    })

    setLoading(false)
    if (res.success) {
      router.push('/dashboard/polls')
    } else {
      alert(res.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border shadow-sm">
      <div className="space-y-2">
        <Label>Poll Title</Label>
        <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="What should we decide?" />
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
          <Label>Type</Label>
          <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="informal">Informal Poll</SelectItem>
              <SelectItem value="formal">Formal Binding Vote</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Voting Method</Label>
          <Select value={formData.voting_method} onValueChange={v => setFormData({...formData, voting_method: v})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anonymous">Anonymous (Hashed)</SelectItem>
              <SelectItem value="identifiable">Identifiable (Open)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Visibility / Eligibility</Label>
          <Select value={formData.visibility_level} onValueChange={v => setFormData({...formData, visibility_level: v})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="members">All Members</SelectItem>
              <SelectItem value="volunteer">Volunteers & Above</SelectItem>
              <SelectItem value="core">Core Team & Above</SelectItem>
              <SelectItem value="executive">Executive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>End Time</Label>
          <Input type="datetime-local" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Options</Label>
        {formData.options.map((opt, idx) => (
          <div key={idx} className="flex gap-2">
            <Input value={opt} onChange={e => updateOption(idx, e.target.value)} placeholder={`Option ${idx + 1}`} />
            {formData.options.length > 2 && (
              <Button type="button" variant="outline" size="icon" onClick={() => removeOption(idx)}>
                <Trash className="w-4 h-4 text-red-500" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-2">
          <Plus className="w-4 h-4 mr-2" /> Add Option
        </Button>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Launch Poll'}
      </Button>
    </form>
  )
}
