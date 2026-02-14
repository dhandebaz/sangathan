'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createNetwork } from '@/actions/networks'
import { useRouter } from 'next/navigation'

export function NetworkForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    visibility: 'public'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const res = await createNetwork({
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      visibility: formData.visibility as 'public' | 'private'
    })

    setLoading(false)
    if (res.success) {
      router.push('/dashboard/networks')
    } else {
      alert(res.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border shadow-sm">
      <div className="space-y-2">
        <Label>Network Name</Label>
        <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Climate Action Coalition" />
      </div>

      <div className="space-y-2">
        <Label>Network Slug</Label>
        <Input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase()})} placeholder="climate-action" />
        <p className="text-xs text-gray-500">Public URL: /network/{formData.slug || 'slug'}</p>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <textarea 
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
          placeholder="What is the purpose of this network?"
        />
      </div>

      <div className="space-y-2">
        <Label>Visibility</Label>
        <Select value={formData.visibility} onValueChange={v => setFormData({...formData, visibility: v})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public (Visible to everyone)</SelectItem>
            <SelectItem value="private">Private (Invite only)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Create Network'}
      </Button>
    </form>
  )
}
