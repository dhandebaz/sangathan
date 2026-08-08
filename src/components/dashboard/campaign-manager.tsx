'use client'

import { useState } from 'react'
import {
  Flag, Plus, Search, Trash2, Loader2, FileText,
  Users, CheckCircle2, Globe, HeartHandshake, ExternalLink, ArrowRight, Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createCampaign, updateCampaignStatus, deleteCampaign } from '@/actions/campaigns/actions'
import { createPetitionAction } from '@/actions/petitions'
import Link from 'next/link'

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

type Petition = {
  id: string
  title: string
  slug: string
  description: string
  target_decision_maker: string
  signature_goal: number
  current_signatures: number
  status: string
  volunteer_prompt_enabled: boolean
  volunteer_cta_text: string
  created_at: string
}

interface CampaignManagerProps {
  lang?: string
  orgSlug?: string
  campaigns: Campaign[]
  petitions?: Petition[]
  role?: string
  isAdminOrEditor?: boolean
}

export function CampaignManager({
  lang = 'en',
  orgSlug = 'org',
  campaigns,
  petitions = [],
  role,
  isAdminOrEditor,
}: CampaignManagerProps) {
  const [activeTab, setActiveTab] = useState<'petitions' | 'campaigns'>('petitions')
  const [search, setSearch] = useState('')
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false)
  const [isPetitionModalOpen, setIsPetitionModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const router = useRouter()

  const canManage = isAdminOrEditor || role === 'admin' || role === 'editor'

  const filteredCampaigns = campaigns.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.goal_description.toLowerCase().includes(search.toLowerCase())
  )

  const filteredPetitions = petitions.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.target_decision_maker.toLowerCase().includes(search.toLowerCase())
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
      setIsCampaignModalOpen(false)
      toast.success('Campaign created successfully')
      router.refresh()
    } else {
      const errorMsg = result.error || result.data?.error || 'Failed to create campaign'
      toast.error(errorMsg)
    }
    setIsLoading(false)
  }

  async function handleCreatePetition(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const title = formData.get('title') as string
    const slug = (formData.get('slug') as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const description = formData.get('description') as string
    const targetDecisionMaker = formData.get('target_decision_maker') as string
    const goal = Number(formData.get('signature_goal')) || 500
    const volunteerCtaText = (formData.get('volunteer_cta_text') as string) || 'Join the Movement & Volunteer'

    const result = await createPetitionAction({
      title,
      slug,
      description,
      target_decision_maker: targetDecisionMaker,
      signature_goal: goal,
      volunteer_prompt_enabled: true,
      volunteer_cta_text: volunteerCtaText,
    })

    if (result.success) {
      setIsPetitionModalOpen(false)
      toast.success('Public petition published live!')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to create petition')
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Campaigns, Petitions & Viral Growth Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish 1-click public petitions, track live signature drives, and convert signers to active members.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'petitions' ? (
            <Dialog open={isPetitionModalOpen} onOpenChange={setIsPetitionModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 rounded-sm">
                  <Plus className="w-4 h-4 mr-1.5" />
                  Publish Public Petition
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-white border-slate-200">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold text-slate-900">
                    Publish Public Petition Drive
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    Launch a public-facing petition with live signature counter and 1-click volunteer recruitment.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreatePetition} className="space-y-3.5 py-2">
                  <div>
                    <Label htmlFor="petition_title" className="text-xs font-semibold text-slate-700">
                      Petition Title *
                    </Label>
                    <Input
                      id="petition_title"
                      name="title"
                      required
                      placeholder="e.g. Rollback 30% Mess Dues Hike Immediately"
                      className="mt-1 h-9 text-xs rounded-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="slug" className="text-xs font-semibold text-slate-700">
                        URL Slug *
                      </Label>
                      <Input
                        id="slug"
                        name="slug"
                        placeholder="rollback-mess-hike"
                        className="mt-1 h-9 text-xs font-mono rounded-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signature_goal" className="text-xs font-semibold text-slate-700">
                        Signature Target Goal
                      </Label>
                      <Input
                        id="signature_goal"
                        name="signature_goal"
                        type="number"
                        defaultValue={500}
                        className="mt-1 h-9 text-xs rounded-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="target_decision_maker" className="text-xs font-semibold text-slate-700">
                      Target Decision Maker (Authority) *
                    </Label>
                    <Input
                      id="target_decision_maker"
                      name="target_decision_maker"
                      required
                      placeholder="e.g. Vice Chancellor / Labor Commissioner"
                      className="mt-1 h-9 text-xs rounded-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="petition_description" className="text-xs font-semibold text-slate-700">
                      Petition Demands & Context *
                    </Label>
                    <textarea
                      id="petition_description"
                      name="description"
                      required
                      rows={4}
                      placeholder="Detail the grievance, constitutional grounds, and immediate demands..."
                      className="w-full mt-1 p-2 text-xs border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="volunteer_cta_text" className="text-xs font-semibold text-slate-700">
                      Viral Conversion Volunteer Hook
                    </Label>
                    <Input
                      id="volunteer_cta_text"
                      name="volunteer_cta_text"
                      defaultValue="Join the Movement & Volunteer for this cause"
                      className="mt-1 h-9 text-xs rounded-sm"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPetitionModalOpen(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="sm"
                      className="bg-slate-900 text-white font-semibold text-xs"
                    >
                      {isLoading ? 'Publishing...' : 'Launch Petition'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          ) : (
            <Dialog open={isCampaignModalOpen} onOpenChange={setIsCampaignModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 rounded-sm">
                  <Plus className="w-4 h-4 mr-1.5" />
                  New Internal Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white border-slate-200">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold text-slate-900">New Campaign</DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    Start an internal action campaign or mobilization drive.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateCampaign} className="space-y-4 py-2">
                  <div>
                    <Label htmlFor="title" className="text-xs font-semibold text-slate-700">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      required
                      minLength={3}
                      placeholder="e.g. Campus Wi-Fi Restoration Movement"
                      className="mt-1 h-9 text-xs rounded-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal_description" className="text-xs font-semibold text-slate-700">Goal Description *</Label>
                    <textarea
                      id="goal_description"
                      name="goal_description"
                      required
                      rows={3}
                      placeholder="Outline target milestones, rallies, and demands..."
                      className="w-full mt-1 p-2 text-xs border border-slate-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="submit" disabled={isLoading} size="sm" className="bg-slate-900 text-white text-xs">
                      Create Campaign
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 border border-slate-200 p-0.5 rounded-sm bg-slate-50 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('petitions')}
            className={`px-3 py-1.5 font-semibold rounded-sm transition-all flex items-center gap-1.5 ${
              activeTab === 'petitions'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>1-Click Public Petitions ({petitions.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('campaigns')}
            className={`px-3 py-1.5 font-semibold rounded-sm transition-all flex items-center gap-1.5 ${
              activeTab === 'campaigns'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-orange-500" />
            <span>Internal Movements ({campaigns.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
          <Input
            placeholder="Search drives..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-xs rounded-sm"
          />
        </div>
      </div>

      {/* TAB CONTENT 1: PETITIONS STUDIO */}
      {activeTab === 'petitions' && (
        <div className="space-y-4">
          {filteredPetitions.map((petition) => {
            const progress = Math.min(100, Math.round(((petition.current_signatures || 0) / (petition.signature_goal || 500)) * 100))
            const publicUrl = `/${lang}/org/${orgSlug}/petitions/${petition.slug || petition.id}`

            return (
              <div
                key={petition.id}
                className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase rounded-sm border border-emerald-200">
                      {petition.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      Target: <strong className="text-slate-700">{petition.target_decision_maker}</strong>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{petition.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{petition.description}</p>

                  <div className="flex items-center gap-4 text-xs pt-1">
                    <span className="font-semibold text-slate-900">
                      {petition.current_signatures || 0} / {petition.signature_goal || 500} signatures
                    </span>
                    <div className="w-32 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-slate-400">{progress}% reached</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="text-xs border-slate-300 font-semibold"
                  >
                    <Link href={publicUrl} target="_blank">
                      <ExternalLink className="w-3.5 h-3.5 mr-1" />
                      View Public Page
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}

          {filteredPetitions.length === 0 && (
            <div className="bg-white border border-dashed border-slate-200 p-12 text-center rounded-sm">
              <Globe className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No Public Petitions Published</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Launch your first public petition to mobilize supporters, collect verified digital signatures, and recruit volunteers.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: INTERNAL CAMPAIGNS */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded-sm">
                    {campaign.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    Created {new Date(campaign.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{campaign.title}</h3>
                <p className="text-xs text-slate-600">{campaign.goal_description}</p>
              </div>

              {canManage && (
                <div className="flex items-center gap-2">
                  {campaign.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(campaign.id, 'active')}
                      className="bg-emerald-600 text-white text-xs h-8"
                    >
                      Activate
                    </Button>
                  )}
                  {campaign.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(campaign.id, 'completed')}
                      className="text-xs h-8"
                    >
                      Mark Won / Completed
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteCampaign(campaign.id)}
                    className="text-red-600 text-xs h-8"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ))}

          {filteredCampaigns.length === 0 && (
            <div className="bg-white border border-dashed border-slate-200 p-12 text-center rounded-sm">
              <Flag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">No Internal Campaigns</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Create structured campaigns to coordinate volunteers and track resolution milestones.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
