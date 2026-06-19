'use client'

import { useState } from 'react'
import { Flag, Plus, Search, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { createCampaign, updateCampaignStatus, deleteCampaign } from '@/actions/campaigns/actions'

type Campaign = {
  id: string
  organisation_id: string
  created_by: string | null
  title: string
  goal_description: string
  status: 'draft' | 'active' | 'completed'
  created_at: string
  updated_at: string
}

interface CampaignManagerProps {
  campaigns: Campaign[]
  role?: string
  isAdminOrEditor?: boolean
}

export function CampaignManager({
  campaigns,
  role,
  isAdminOrEditor,
}: CampaignManagerProps) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const router = useRouter()

  const canManage = isAdminOrEditor || role === 'admin' || role === 'editor'

  const filteredCampaigns = campaigns.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.goal_description.toLowerCase().includes(search.toLowerCase())
  )

  async function handleCreateCampaign(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const title = formData.get('title') as string
    const goalDescription = formData.get('goal_description') as string

    const result = await createCampaign({
      title,
      goal_description: goalDescription,
    })

    if (result.success && !result.data?.error) {
      setIsOpen(false)
      toast.success('Campaign created successfully')
      router.refresh()
    } else {
      const errorMsg = result.error || result.data?.error || 'Failed to create campaign'
      toast.error(errorMsg)
    }
    setIsLoading(false)
  }

  async function handleUpdateStatus(campaignId: string, status: 'draft' | 'active' | 'completed') {
    setActionLoadingId(campaignId)
    const result = await updateCampaignStatus({ campaignId, status })
    if (result.success && !result.data?.error) {
      toast.success(`Campaign updated successfully`)
      router.refresh()
    } else {
      const errorMsg = result.error || result.data?.error || 'Failed to update campaign status'
      toast.error(errorMsg)
    }
    setActionLoadingId(null)
  }

  async function handleDeleteCampaign(campaignId: string) {
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return
    }
    setActionLoadingId(campaignId)
    const result = await deleteCampaign({ campaignId })
    if (result.success && !result.data?.error) {
      toast.success('Campaign deleted successfully')
      router.refresh()
    } else {
      const errorMsg = result.error || result.data?.error || 'Failed to delete campaign'
      toast.error(errorMsg)
    }
    setActionLoadingId(null)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Campaigns & Movements</h1>
           <p className="text-muted-foreground mt-1">Organize student protests, demands, and collective actions.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New Campaign</DialogTitle>
                <DialogDescription>
                  Start a new campaign or movement for the organisation.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateCampaign} className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    minLength={3}
                    placeholder="Brief summary"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="goal_description">Goal Description *</Label>
                  <textarea
                    id="goal_description"
                    name="goal_description"
                    required
                    minLength={10}
                    rows={4}
                    placeholder="Detailed explanation (minimum 10 characters)"
                    disabled={isLoading}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} className="min-w-[100px]">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm mb-6">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search campaigns..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Campaign</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Started</th>
                {canManage && <th className="px-6 py-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                          <Flag size={18} />
                       </div>
                       <div>
                           <div className="font-medium text-foreground">{camp.title}</div>
                           <div className="text-muted-foreground text-xs mt-1 line-clamp-1">{camp.goal_description}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={camp.status === 'completed' ? 'secondary' : camp.status === 'active' ? 'default' : 'outline'} className="capitalize">
                      {camp.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(camp.created_at).toLocaleDateString()}
                  </td>
                  {canManage && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {camp.status === 'draft' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-xs"
                            disabled={actionLoadingId !== null}
                            onClick={() => handleUpdateStatus(camp.id, 'active')}
                          >
                            Activate
                          </Button>
                        )}
                        {camp.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-xs bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                            disabled={actionLoadingId !== null}
                            onClick={() => handleUpdateStatus(camp.id, 'completed')}
                          >
                            Complete
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={actionLoadingId !== null}
                          onClick={() => handleDeleteCampaign(camp.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filteredCampaigns.length === 0 && (
                <tr>
                  <td colSpan={canManage ? 4 : 3} className="px-6 py-8 text-center text-muted-foreground">
                    No active campaigns. Start a movement!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
