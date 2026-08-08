'use client'

import React, { useState, useEffect } from 'react'
import {
  Wifi, WifiOff, UploadCloud, Download, CheckCircle2,
  Users, AlertCircle, FileText, Plus, Database, Sparkles, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  getFieldQueue, enqueueFieldRecord, removeSyncedRecords,
  exportQueueToCsv, FieldRecord
} from '@/lib/offline/field-store'
import { syncFieldBatchAction } from '@/actions/field-sync'

interface FieldModeClientProps {
  orgName: string
}

export function FieldModeClient({ orgName }: FieldModeClientProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [queue, setQueue] = useState<FieldRecord[]>([])
  const [activeTab, setActiveTab] = useState<'member' | 'grievance' | 'petition'>('member')
  const [isSyncing, setIsSyncing] = useState(false)

  // Forms
  const [memberForm, setMemberForm] = useState({ fullName: '', email: '', phone: '', role: 'member' })
  const [grievanceForm, setGrievanceForm] = useState({ location: '', category: 'Hostel/Facility', description: '' })
  const [petitionForm, setPetitionForm] = useState({ petitionId: '', name: '', email: '', phone: '', locality: '' })

  useEffect(() => {
    setIsOnline(navigator.onLine)
    setQueue(getFieldQueue())

    const handleOnline = () => {
      setIsOnline(true)
      toast.success('Connection restored. Auto-syncing offline field queue...')
      triggerSync()
    }
    const handleOffline = () => {
      setIsOnline(false)
      toast.warning('Offline mode active. All records saved locally to device storage.')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  async function triggerSync() {
    const currentQueue = getFieldQueue()
    if (currentQueue.length === 0) {
      toast.info('No pending offline records to sync.')
      return
    }

    setIsSyncing(true)
    try {
      const res = await syncFieldBatchAction(currentQueue)
      if (res.success && res.syncedIds && res.syncedIds.length > 0) {
        removeSyncedRecords(res.syncedIds)
        setQueue(getFieldQueue())
        toast.success(`Successfully synchronized ${res.syncedIds.length} offline records to server!`)
      } else {
        toast.error('Sync failed. Records remain safely cached locally.')
      }
    } catch {
      toast.error('Sync encountered an error. Records safely preserved in storage.')
    } finally {
      setIsSyncing(false)
    }
  }

  function handleSaveMember(e: React.FormEvent) {
    e.preventDefault()
    if (!memberForm.fullName) return

    enqueueFieldRecord('member_intake', memberForm)
    setQueue(getFieldQueue())
    setMemberForm({ fullName: '', email: '', phone: '', role: 'member' })
    toast.success('Member record queued in local offline database.')

    if (navigator.onLine) {
      triggerSync()
    }
  }

  function handleSaveGrievance(e: React.FormEvent) {
    e.preventDefault()
    if (!grievanceForm.description) return

    enqueueFieldRecord('field_grievance', grievanceForm)
    setQueue(getFieldQueue())
    setGrievanceForm({ location: '', category: 'Hostel/Facility', description: '' })
    toast.success('Field grievance queued in local storage.')

    if (navigator.onLine) {
      triggerSync()
    }
  }

  function handleExportCsv() {
    const currentQueue = getFieldQueue()
    if (currentQueue.length === 0) {
      toast.info('No records in local storage to export.')
      return
    }
    const csv = exportQueueToCsv(currentQueue)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Sangathan_Field_Queue_Backup_${Date.now()}.csv`
    a.click()
    toast.success('Offline backup exported to CSV!')
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 px-4">
      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Database className="w-7 h-7 text-indigo-600" />
            <span>Offline-First Field Organizer PWA</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Door-to-door membership drives, rally check-ins & grievances in low or zero internet conditions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1.5 rounded-sm border text-xs font-semibold flex items-center gap-1.5 ${
              isOnline
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-amber-50 border-amber-200 text-amber-700'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'Online (Live Sync)' : 'Offline (Local Storage)'}</span>
          </div>

          <Button
            onClick={triggerSync}
            disabled={isSyncing || queue.length === 0}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 rounded-sm"
          >
            <UploadCloud className="w-4 h-4 mr-1.5" />
            {isSyncing ? 'Syncing...' : `Sync Queue (${queue.length})`}
          </Button>

          <Button
            variant="outline"
            onClick={handleExportCsv}
            className="text-xs border-slate-300 h-9 rounded-sm"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Main Intake Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Action Forms with Large Touch Targets */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center gap-1 border border-slate-200 p-0.5 rounded-sm bg-slate-50 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('member')}
              className={`flex-1 py-2 font-semibold rounded-sm transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'member'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>Door-to-Door Intake</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('grievance')}
              className={`flex-1 py-2 font-semibold rounded-sm transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'grievance'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
              <span>Field Grievance</span>
            </button>
          </div>

          {/* Form 1: Member Intake */}
          {activeTab === 'member' && (
            <form onSubmit={handleSaveMember} className="space-y-4 pt-2">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Full Name *</Label>
                <Input
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={memberForm.fullName}
                  onChange={(e) => setMemberForm({ ...memberForm, fullName: e.target.value })}
                  className="mt-1 h-11 text-sm rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Phone Number</Label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                    className="mt-1 h-11 text-sm rounded-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Email (Optional)</Label>
                  <Input
                    type="email"
                    placeholder="ramesh@example.com"
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    className="mt-1 h-11 text-sm rounded-sm"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-sm text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Save Member Record (Instant Offline Store)
              </Button>
            </form>
          )}

          {/* Form 2: Field Grievance */}
          {activeTab === 'grievance' && (
            <form onSubmit={handleSaveGrievance} className="space-y-4 pt-2">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Hostel / Location / Factory Ward *</Label>
                <Input
                  placeholder="e.g. Hostel 3 Dining Hall or Section B"
                  value={grievanceForm.location}
                  onChange={(e) => setGrievanceForm({ ...grievanceForm, location: e.target.value })}
                  className="mt-1 h-11 text-sm rounded-sm"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Grievance Description *</Label>
                <Textarea
                  required
                  rows={4}
                  placeholder="Detail the issue reported by worker or student..."
                  value={grievanceForm.description}
                  onChange={(e) => setGrievanceForm({ ...grievanceForm, description: e.target.value })}
                  className="mt-1 text-sm rounded-sm"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-12 rounded-sm text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Save Field Grievance (Instant Offline Store)
              </Button>
            </form>
          )}
        </div>

        {/* Right: Local Storage Queue Inspector */}
        <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pending Local Storage Queue ({queue.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">IndexedDB Ready</span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto">
            {queue.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-sm text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">{item.id}</span>
                  <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 font-bold uppercase text-[9px] rounded">
                    {item.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="font-semibold text-slate-900">
                  {item.data.fullName || item.data.location || item.data.name || 'Field Record'}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Captured: {new Date(item.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}

            {queue.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">All records synchronized with central server.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
