'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PhoneCall, Zap, Droplet, Trash2, Shield, Plus, Pencil, Ambulance, Wrench, AlertCircle, Trash } from 'lucide-react'
import { addServiceContact, removeServiceContact, updateServiceContact } from '@/actions/local-directory'
import type { Member } from '@/types/dashboard'
import { toast } from 'sonner'

interface LocalDirectoryClientProps {
  contacts: Member[]
  isAdmin: boolean
}

const CATEGORIES = [
  { id: 'Electricity', label: '🔌 Electricity', icon: Zap },
  { id: 'Water Supply', label: '💧 Water Supply', icon: Droplet },
  { id: 'Sanitation', label: '🗑️ Sanitation', icon: Trash },
  { id: 'Police', label: '👮 Police', icon: Shield },
  { id: 'Medical', label: '🏥 Medical', icon: Ambulance },
  { id: 'General', label: '🔧 General', icon: Wrench },
]

const EMERGENCY_NUMBERS = [
  { title: 'Police Control Room', number: '100' },
  { title: 'Fire Brigade', number: '101' },
  { title: 'Ambulance', number: '102' },
  { title: 'Women Helpline', number: '1091' },
  { title: 'Child Helpline', number: '1098' },
  { title: 'Senior Citizen', number: '14567' },
  { title: 'BSES Rajdhani Complaint', number: '19123' },
  { title: 'BSES Yamuna Complaint', number: '19122' },
  { title: 'DJB Complaint', number: '1916' },
  { title: 'MCD Helpline', number: '311' },
]

function safeJsonParse(str: string | null) {
  if (!str) return {}
  try {
    return JSON.parse(str)
  } catch (e) {
    return {}
  }
}

export default function LocalDirectoryClient({ contacts, isAdmin }: LocalDirectoryClientProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    title: '',
    category: 'Electricity',
    isPinned: false
  })

  const handleOpenEdit = (contact: Member) => {
    const title = contact.designation?.replace('[SERVICE] ', '') || ''
    const meta = safeJsonParse(contact.notes)
    
    setFormData({
      name: contact.full_name,
      phone: contact.phone || '',
      title,
      category: meta.category || 'Electricity',
      isPinned: meta.isPinned || false
    })
    setEditingId(contact.id)
    setIsOpen(true)
  }

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      phone: '',
      title: '',
      category: 'Electricity',
      isPinned: false
    })
    setEditingId(null)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const notesJson = JSON.stringify({
      category: formData.category,
      isPinned: formData.isPinned
    })

    const payload = {
      full_name: formData.name,
      phone: formData.phone,
      designation: `[SERVICE] ${formData.title}`,
      notes: notesJson
    }

    if (editingId) {
      const res = await updateServiceContact({ id: editingId, ...payload })
      if (res.success) {
        toast.success('Contact updated')
        setIsOpen(false)
      } else {
        toast.error(res.error || 'Failed to update')
      }
    } else {
      const res = await addServiceContact(payload)
      if (res.success) {
        toast.success('Contact added')
        setIsOpen(false)
      } else {
        toast.error(res.error || 'Failed to add')
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this contact?')) return
    const res = await removeServiceContact({ id })
    if (res.success) {
      toast.success('Contact removed')
    } else {
      toast.error(res.error || 'Failed to remove')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Local Directory</h1>
          <p className="text-sm text-zinc-500 mt-1">Essential service contacts for your community.</p>
        </div>
        {isAdmin && (
          <Button onClick={handleOpenAdd} className="gap-2">
            <Plus className="w-4 h-4" /> Add Contact
          </Button>
        )}
      </div>

      {/* Emergency Section */}
      <Card className="border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-900/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400 text-lg">
            <AlertCircle className="w-5 h-5" />
            Emergency Numbers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {EMERGENCY_NUMBERS.map(em => (
              <a 
                key={em.title} 
                href={`tel:${em.number}`}
                className="flex flex-col p-3 rounded-lg bg-white dark:bg-zinc-900 border border-red-100 dark:border-red-900/30 hover:border-red-300 dark:hover:border-red-800 transition-colors"
              >
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 line-clamp-1">{em.title}</span>
                <span className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center justify-between">
                  {em.number}
                  <PhoneCall className="w-4 h-4 opacity-50" />
                </span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {CATEGORIES.map(category => {
          const categoryContacts = contacts.filter(c => {
            const meta = safeJsonParse(c.notes)
            return meta.category === category.id
          }).sort((a, b) => {
            const metaA = safeJsonParse(a.notes)
            const metaB = safeJsonParse(b.notes)
            if (metaA.isPinned && !metaB.isPinned) return -1
            if (!metaA.isPinned && metaB.isPinned) return 1
            return 0
          })

          if (categoryContacts.length === 0) return null

          const Icon = category.icon

          return (
            <Card key={category.id}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="w-5 h-5 text-zinc-500" />
                  {category.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoryContacts.map(contact => {
                  const meta = safeJsonParse(contact.notes)
                  const title = contact.designation?.replace('[SERVICE] ', '')
                  
                  return (
                    <div key={contact.id} className="flex items-start justify-between p-3 rounded-lg border bg-zinc-50/50 dark:bg-zinc-800/50">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-zinc-900 dark:text-zinc-50">{title || contact.full_name}</h3>
                          {meta.isPinned && (
                            <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">Pinned</span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-500 mb-2">{title ? contact.full_name : ''}</p>
                        
                        <div className="flex gap-2 mt-2">
                          <a href={`tel:${contact.phone}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                            <PhoneCall className="w-3.5 h-3.5" />
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                      
                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(contact)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDelete(contact.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Contact' : 'Add Service Contact'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={v => setFormData(p => ({ ...p, category: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Service Title / Role (e.g. BSES Lineman)</Label>
              <Input required value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label>Person's Name</Label>
              <Input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input required type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input 
                type="checkbox" 
                id="isPinned" 
                checked={formData.isPinned}
                onChange={e => setFormData(p => ({ ...p, isPinned: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isPinned">Pin to top of category</Label>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit">{editingId ? 'Save Changes' : 'Add Contact'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
