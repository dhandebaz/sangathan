'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, MapPin, Briefcase, IndianRupee, Clock, CheckCircle, Users } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createJobPosting, applyForJob, updateApplicationStatus } from '@/actions/jobs'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function JobsClient({ 
  jobs, 
  isAdmin,
  profileId 
}: { 
  jobs: any[], 
  isAdmin: boolean,
  profileId: string
}) {
  const { toast } = useToast()
  
  const [isJobOpen, setIsJobOpen] = useState(false)
  const [jobForm, setJobForm] = useState({ 
    title: '', employer_name: '', location: '', description: '', 
    skills_required: '', wage_rate: '', positions_available: '1', start_date: '' 
  })

  const [isApplyOpen, setIsApplyOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [applyNotes, setApplyNotes] = useState('')

  const handleCreateJob = async () => {
    try {
      await createJobPosting({
        title: jobForm.title,
        employer_name: jobForm.employer_name,
        location: jobForm.location,
        description: jobForm.description,
        skills_required: jobForm.skills_required,
        wage_rate: jobForm.wage_rate,
        positions_available: Number(jobForm.positions_available),
        start_date: jobForm.start_date || undefined
      })
      toast({ title: 'Success', description: 'Job posted successfully' })
      setIsJobOpen(false)
      setJobForm({ title: '', employer_name: '', location: '', description: '', skills_required: '', wage_rate: '', positions_available: '1', start_date: '' })
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    }
  }

  const handleApply = async () => {
    if (!selectedJob) return
    try {
      await applyForJob({ job_id: selectedJob, notes: applyNotes })
      toast({ title: 'Success', description: 'Application submitted successfully' })
      setIsApplyOpen(false)
      setApplyNotes('')
      setSelectedJob(null)
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    }
  }

  const handleAppStatus = async (appId: string, status: any) => {
    try {
      await updateApplicationStatus({ application_id: appId, status })
      toast({ title: 'Status Updated', description: `Application marked as ${status}` })
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Browse open jobs or view your dispatch status.</p>
        
        {isAdmin && (
          <Dialog open={isJobOpen} onOpenChange={setIsJobOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Post Job</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Create Job Dispatch</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2 col-span-2">
                  <Label>Job Title</Label>
                  <Input value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} placeholder="e.g. Electrician for Construction Site" />
                </div>
                <div className="space-y-2">
                  <Label>Employer / Company</Label>
                  <Input value={jobForm.employer_name} onChange={e => setJobForm({...jobForm, employer_name: e.target.value})} placeholder="L&T Group" />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} placeholder="South Delhi" />
                </div>
                <div className="space-y-2">
                  <Label>Wage Rate</Label>
                  <Input value={jobForm.wage_rate} onChange={e => setJobForm({...jobForm, wage_rate: e.target.value})} placeholder="₹800/day" />
                </div>
                <div className="space-y-2">
                  <Label>Positions Available</Label>
                  <Input type="number" value={jobForm.positions_available} onChange={e => setJobForm({...jobForm, positions_available: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Skills Required (comma separated)</Label>
                  <Input value={jobForm.skills_required} onChange={e => setJobForm({...jobForm, skills_required: e.target.value})} placeholder="Wiring, Safety, Heavy Lifting" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Description</Label>
                  <Textarea value={jobForm.description} onChange={e => setJobForm({...jobForm, description: e.target.value})} />
                </div>
                <Button className="w-full col-span-2" onClick={handleCreateJob}>Post Job</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Apply for Dispatch</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Any notes for the steward/admin? (Optional)</Label>
              <Textarea value={applyNotes} onChange={e => setApplyNotes(e.target.value)} placeholder="I have my own tools and am available immediately." />
            </div>
            <Button className="w-full" onClick={handleApply}>Confirm Application</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6">
        {jobs.map(job => {
          const myApp = job.job_applications?.find((a: any) => a.profile_id === profileId)
          
          return (
            <Card key={job.id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
                    <span className={`inline-flex items-center py-1 px-2.5 rounded-full text-xs font-medium ${job.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> {job.employer_name}</div>
                    {job.location && <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {job.location}</div>}
                    {job.wage_rate && <div className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4 text-slate-400" /> {job.wage_rate}</div>}
                    <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> {job.positions_available} Openings</div>
                  </div>

                  {job.description && <p className="text-slate-600 text-sm mb-4">{job.description}</p>}

                  {job.skills_required && job.skills_required.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-4">
                      {job.skills_required.map((skill: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium border border-indigo-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {!isAdmin && job.status === 'open' && !myApp && (
                    <Button onClick={() => { setSelectedJob(job.id); setIsApplyOpen(true); }}>
                      Apply for Dispatch
                    </Button>
                  )}
                  
                  {!isAdmin && myApp && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border rounded-lg text-sm font-medium">
                      Status: 
                      {myApp.status === 'applied' && <span className="text-amber-600 flex items-center gap-1"><Clock className="w-4 h-4"/> Pending</span>}
                      {myApp.status === 'dispatched' && <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="w-4 h-4"/> Dispatched</span>}
                      {myApp.status === 'rejected' && <span className="text-rose-600">Not Selected</span>}
                    </div>
                  )}
                </div>

                {isAdmin && (
                  <div className="w-full md:w-80 bg-slate-50 rounded-xl p-4 border">
                    <h3 className="font-semibold text-slate-900 mb-3">Applications ({job.job_applications?.length || 0})</h3>
                    <div className="space-y-3">
                      {job.job_applications?.map((app: any) => (
                        <div key={app.id} className="bg-white p-3 rounded-lg border text-sm shadow-sm">
                          <div className="font-medium text-slate-900">{app.profiles?.full_name}</div>
                          {app.profiles?.phone && <div className="text-slate-500 text-xs">{app.profiles.phone}</div>}
                          {app.notes && <div className="text-slate-600 text-xs mt-1 italic">"{app.notes}"</div>}
                          
                          <div className="flex items-center justify-between mt-3 pt-3 border-t">
                            <span className="text-xs font-semibold capitalize text-slate-600">{app.status}</span>
                            {app.status === 'applied' && (
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-600" onClick={() => handleAppStatus(app.id, 'dispatched')}>Dispatch</Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs text-rose-600" onClick={() => handleAppStatus(app.id, 'rejected')}>Reject</Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {(!job.job_applications || job.job_applications.length === 0) && (
                        <div className="text-slate-500 text-sm text-center py-4">No applications yet.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
        {jobs.length === 0 && (
          <Card className="p-12 text-center text-slate-500">
            No job postings available.
          </Card>
        )}
      </div>
    </div>
  )
}
