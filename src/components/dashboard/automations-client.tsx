'use client'

import React, { useState } from 'react'
import {
  Zap, Plus, Sparkles, CheckCircle2, ArrowRight,
  Trash2, Play, ToggleLeft, ToggleRight, Layers, Sliders, Flame
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  createAutomationAction,
  toggleAutomationAction,
  deleteAutomationAction,
  installPrebuiltRecipeAction
} from '@/actions/automations'
import { PREBUILT_AUTOMATION_RECIPES } from '@/lib/automations/engine'
import { useRouter } from 'next/navigation'

interface AutomationsClientProps {
  initialAutomations: any[]
  orgName: string
}

export function AutomationsClient({ initialAutomations, orgName }: AutomationsClientProps) {
  const [automations, setAutomations] = useState<any[]>(initialAutomations)
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Form State
  const [form, setForm] = useState({
    name: '',
    description: '',
    triggerEvent: 'member_joined' as const,
    actionType: 'issue_digital_id' as const,
  })

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) return

    setIsSubmitting(true)
    const res = await createAutomationAction({
      name: form.name,
      description: form.description,
      triggerEvent: form.triggerEvent,
      conditions: [],
      actions: [{ actionType: form.actionType }],
    })

    setIsSubmitting(false)
    if (res.success && res.data) {
      toast.success('Automation rule created and activated!')
      setAutomations((prev) => [res.data, ...prev])
      setIsOpen(false)
      setForm({
        name: '',
        description: '',
        triggerEvent: 'member_joined',
        actionType: 'issue_digital_id',
      })
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to create automation.')
    }
  }

  async function handleToggle(id: string, currentStatus: boolean) {
    const res = await toggleAutomationAction(id, !currentStatus)
    if (res.success) {
      setAutomations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_active: !currentStatus } : a))
      )
      toast.success(`Automation ${!currentStatus ? 'activated' : 'paused'}`)
    } else {
      toast.error('Failed to toggle status.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this automation rule?')) return
    const res = await deleteAutomationAction(id)
    if (res.success) {
      setAutomations((prev) => prev.filter((a) => a.id !== id))
      toast.success('Automation rule deleted.')
    } else {
      toast.error('Failed to delete rule.')
    }
  }

  async function handleInstallRecipe(index: number) {
    const res = await installPrebuiltRecipeAction(index)
    if (res.success && res.data) {
      setAutomations((prev) => [res.data, ...prev])
      toast.success('Prebuilt recipe installed and active!')
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to install recipe.')
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Zap className="w-7 h-7 text-amber-500" />
            <span>No-Code Event-Driven Automations</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build event pipelines (Trigger → Filter → Action) to automate member onboarding, emergency alerts, and task dispatch.
          </p>
        </div>

        <Button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 rounded-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Custom Rule
        </Button>
      </div>

      {/* Pre-built 1-Click Recipes */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Pre-Configured Automation Recipes (1-Click Install)</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Zero Code</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PREBUILT_AUTOMATION_RECIPES.map((recipe, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 p-4 rounded-sm shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold uppercase rounded-sm border border-amber-200">
                    {recipe.triggerEvent.replace(/_/g, ' ')}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 text-[10px] font-bold uppercase rounded-sm border border-indigo-200">
                    {recipe.actions.length} Actions
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{recipe.name}</h3>
                <p className="text-xs text-slate-600 mt-1">{recipe.description}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleInstallRecipe(idx)}
                className="w-full text-xs border-slate-300 font-semibold text-slate-800 hover:bg-slate-50"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Install Recipe
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Active Rules List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-700" />
            <span>Active Automated Pipelines ({automations.length})</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Live Triggered</span>
        </div>

        <div className="space-y-3">
          {automations.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm border ${
                      item.is_active
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {item.is_active ? 'Active' : 'Paused'}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Trigger: <strong className="text-slate-800">{item.trigger_event}</strong>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                {item.description && <p className="text-xs text-slate-600">{item.description}</p>}

                <div className="text-[11px] text-slate-400 font-mono">
                  Executions: {item.execution_count || 0} times • Created{' '}
                  {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggle(item.id, item.is_active)}
                  className="text-xs border-slate-300"
                >
                  {item.is_active ? 'Pause' : 'Resume'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 text-xs h-8"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}

          {automations.length === 0 && (
            <div className="bg-white border border-dashed border-slate-200 p-12 text-center rounded-sm">
              <Zap className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Automations Configured</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Install a prebuilt recipe above or click &quot;Create Custom Rule&quot; to build an automated workflow.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Create Automation Pipeline
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Set up an event listener and automated downstream actions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Rule Name *</Label>
              <Input
                required
                placeholder="e.g. Issue Digital ID on Member Join"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 h-9 text-xs rounded-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Trigger Event *</Label>
              <Select
                value={form.triggerEvent}
                onValueChange={(val: any) => setForm({ ...form, triggerEvent: val })}
              >
                <SelectTrigger className="mt-1 h-9 text-xs rounded-sm">
                  <SelectValue placeholder="Select Trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member_joined">When New Member Joins</SelectItem>
                  <SelectItem value="donation_received">When Donation Received</SelectItem>
                  <SelectItem value="emergency_sos_triggered">When Emergency SOS Triggered</SelectItem>
                  <SelectItem value="grievance_filed">When Grievance Filed</SelectItem>
                  <SelectItem value="petition_signed">When Petition Signed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Automated Action *</Label>
              <Select
                value={form.actionType}
                onValueChange={(val: any) => setForm({ ...form, actionType: val })}
              >
                <SelectTrigger className="mt-1 h-9 text-xs rounded-sm">
                  <SelectValue placeholder="Select Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="issue_digital_id">Issue Digital ID Card</SelectItem>
                  <SelectItem value="send_welcome_message">Send WhatsApp/SMS Welcome</SelectItem>
                  <SelectItem value="alert_legal_team">Broadcast Alert to Legal Team</SelectItem>
                  <SelectItem value="generate_tax_receipt">Generate 80G Tax Receipt</SelectItem>
                  <SelectItem value="assign_task">Assign Task to Convener</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Description</Label>
              <Input
                placeholder="Optional notes..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 h-9 text-xs rounded-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                size="sm"
                className="bg-slate-900 text-white font-semibold text-xs"
              >
                {isSubmitting ? 'Creating...' : 'Activate Rule'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
