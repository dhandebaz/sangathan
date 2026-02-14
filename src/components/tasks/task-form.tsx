'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createTask } from '@/actions/tasks'
import { useRouter } from 'next/navigation'

export function TaskForm({ orgId }: { orgId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    visibility_level: 'volunteer',
    due_date: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const res = await createTask({
      organisation_id: orgId,
      title: formData.title,
      description: formData.description,
      priority: formData.priority as any,
      visibility_level: formData.visibility_level as any,
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : undefined
    })

    setLoading(false)
    if (res.success) {
      router.push('/dashboard/tasks')
    } else {
      alert(res.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border shadow-sm max-w-2xl mx-auto">
      <div className="space-y-2">
        <Label>Task Title</Label>
        <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Organize Welcome Kit" />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <textarea 
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
          placeholder="Details about the task..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={formData.priority} onValueChange={v => setFormData({...formData, priority: v})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Visibility / Role Required</Label>
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
      </div>

      <div className="space-y-2">
        <Label>Due Date (Optional)</Label>
        <Input type="datetime-local" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Create Task'}
      </Button>
    </form>
  )
}
