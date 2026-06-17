'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createTask, updateTask } from '@/actions/tasks'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Task } from '@/types/dashboard'

export function TaskForm({ orgId, initialData }: { orgId: string, initialData?: Task }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useParams() as { lang?: string }
  const lang = params.lang || 'en'
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    visibility_level: initialData?.visibility_level || 'volunteer',
    due_date: initialData?.due_date ? new Date(initialData.due_date).toISOString().slice(0, 16) : ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const payload = {
      organisation_id: orgId,
      title: formData.title,
      description: formData.description,
      priority: formData.priority as 'low' | 'medium' | 'high',
      visibility_level: formData.visibility_level as 'members' | 'volunteer' | 'core' | 'executive',
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : undefined
    }

    const res = initialData
      ? await updateTask({ id: initialData.id, ...payload })
      : await createTask(payload)

    setLoading(false)
    if (res.success) {
      router.refresh()
      router.push(`/${lang}/dashboard/tasks${initialData ? `/${initialData.id}` : ''}`)
    } else {
      toast.error(res.error || `Failed to ${initialData ? 'update' : 'create'} task`)
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
        {loading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Task' : 'Create Task')}
      </Button>
    </form>
  )
}
