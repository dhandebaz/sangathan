'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Vote, Users, Plus, Calendar, Trophy, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createElection, createElectionPosition, nominateCandidate, submitVote } from '@/actions/elections'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from '@/components/ui/textarea'

export default function ElectionsClient({ 
  elections, 
  votedElectionIds,
  members,
  isAdmin 
}: { 
  elections: any[], 
  votedElectionIds: string[],
  members: { id: string, full_name: string, email: string }[],
  isAdmin: boolean 
}) {
  const { toast } = useToast()
  
  const [electionForm, setElectionForm] = useState({ title: '', description: '', start_time: '', end_time: '' })
  const [positionForm, setPositionForm] = useState({ election_id: '', title: '', max_votes: 1 })
  const [candidateForm, setCandidateForm] = useState({ position_id: '', profile_id: '', manifesto_text: '' })
  
  const [isElectionOpen, setIsElectionOpen] = useState(false)
  const [isPositionOpen, setIsPositionOpen] = useState(false)
  const [isCandidateOpen, setIsCandidateOpen] = useState(false)

  // Voting state: map of position_id -> candidate_id
  const [votes, setVotes] = useState<Record<string, string>>({})

  const handleCreateElection = async () => {
    try {
      await createElection({
        title: electionForm.title,
        description: electionForm.description,
        start_time: new Date(electionForm.start_time).toISOString(),
        end_time: new Date(electionForm.end_time).toISOString()
      })
      toast({ title: 'Success', description: 'Election created successfully' })
      setIsElectionOpen(false)
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    }
  }

  const handleCreatePosition = async () => {
    try {
      await createElectionPosition({
        election_id: positionForm.election_id,
        title: positionForm.title,
        max_votes_per_voter: positionForm.max_votes
      })
      toast({ title: 'Success', description: 'Position created successfully' })
      setIsPositionOpen(false)
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    }
  }

  const handleNominate = async () => {
    try {
      await nominateCandidate({
        position_id: candidateForm.position_id,
        profile_id: candidateForm.profile_id,
        manifesto_text: candidateForm.manifesto_text
      })
      toast({ title: 'Success', description: 'Candidate nominated successfully' })
      setIsCandidateOpen(false)
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    }
  }

  const handleSubmitVote = async (electionId: string, positions: any[]) => {
    // Validate we have a vote for every position
    const voteArray = Object.keys(votes).map(posId => ({
      position_id: posId,
      candidate_id: votes[posId]
    }))
    
    if (voteArray.length < positions.length) {
      toast({ title: 'Incomplete', description: 'Please cast a vote for all positions before submitting', variant: 'destructive' })
      return
    }

    try {
      await submitVote({
        election_id: electionId,
        votes: voteArray
      })
      toast({ title: 'Vote Cast', description: 'Your anonymous vote has been recorded securely.' })
      setVotes({})
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-8">
      {isAdmin && (
        <div className="flex gap-2">
          <Dialog open={isElectionOpen} onOpenChange={setIsElectionOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> New Election</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Election</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={electionForm.title} onChange={e => setElectionForm({...electionForm, title: e.target.value})} placeholder="e.g. Union President 2026" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={electionForm.description} onChange={e => setElectionForm({...electionForm, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input type="datetime-local" value={electionForm.start_time} onChange={e => setElectionForm({...electionForm, start_time: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input type="datetime-local" value={electionForm.end_time} onChange={e => setElectionForm({...electionForm, end_time: e.target.value})} />
                  </div>
                </div>
                <Button className="w-full" onClick={handleCreateElection}>Create Election</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isPositionOpen} onOpenChange={setIsPositionOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><Users className="w-4 h-4 mr-2" /> Add Position</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Position</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Election</Label>
                  <Select value={positionForm.election_id} onValueChange={v => setPositionForm({...positionForm, election_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Select election" /></SelectTrigger>
                    <SelectContent>
                      {elections.map(e => <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Position Title</Label>
                  <Input value={positionForm.title} onChange={e => setPositionForm({...positionForm, title: e.target.value})} placeholder="e.g. Secretary" />
                </div>
                <Button className="w-full" onClick={handleCreatePosition}>Save Position</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCandidateOpen} onOpenChange={setIsCandidateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><Vote className="w-4 h-4 mr-2" /> Nominate</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nominate Candidate</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Select value={candidateForm.position_id} onValueChange={v => setCandidateForm({...candidateForm, position_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Select position" /></SelectTrigger>
                    <SelectContent>
                      {elections.flatMap(e => e.election_positions.map((p: any) => (
                        <SelectItem key={p.id} value={p.id}>{e.title} - {p.title}</SelectItem>
                      )))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Member</Label>
                  <Select value={candidateForm.profile_id} onValueChange={v => setCandidateForm({...candidateForm, profile_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
                    <SelectContent>
                      {members.map(m => <SelectItem key={m.id} value={m.id}>{m.full_name} ({m.email})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Manifesto / Pitch</Label>
                  <Textarea value={candidateForm.manifesto_text} onChange={e => setCandidateForm({...candidateForm, manifesto_text: e.target.value})} />
                </div>
                <Button className="w-full" onClick={handleNominate}>Submit Nomination</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <div className="space-y-8">
        {elections.map((election) => {
          const hasVoted = votedElectionIds.includes(election.id)
          const isComplete = election.status === 'completed' || new Date() > new Date(election.end_time)
          const isActive = election.status === 'active' || (new Date() >= new Date(election.start_time) && new Date() <= new Date(election.end_time))

          return (
            <Card key={election.id} className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{election.title}</h2>
                  {election.description && <p className="text-slate-500 mt-1">{election.description}</p>}
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(election.start_time).toLocaleDateString()} - {new Date(election.end_time).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  {isComplete ? (
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                      Ended
                    </span>
                  ) : isActive ? (
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 animate-pulse">
                      Voting Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
                      Upcoming
                    </span>
                  )}
                </div>
              </div>

              {hasVoted && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">You have securely cast your vote in this election.</span>
                </div>
              )}

              <div className="space-y-6">
                {election.election_positions.map((pos: any) => (
                  <div key={pos.id} className="border rounded-xl p-5 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-indigo-500" /> {pos.title}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pos.candidates.map((cand: any) => (
                        <div 
                          key={cand.id} 
                          className={`p-4 border rounded-xl bg-white transition-all ${!hasVoted && isActive && votes[pos.id] === cand.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'hover:border-slate-300'}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold text-slate-900">{cand.profiles?.full_name}</div>
                              <div className="text-sm text-slate-500">{cand.profiles?.email}</div>
                            </div>
                            
                            {isComplete && (
                              <div className="text-right">
                                <span className="block text-2xl font-black text-indigo-600">{cand.votes_count}</span>
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Votes</span>
                              </div>
                            )}

                            {!hasVoted && isActive && (
                              <Button 
                                variant={votes[pos.id] === cand.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setVotes({ ...votes, [pos.id]: cand.id })}
                              >
                                {votes[pos.id] === cand.id ? 'Selected' : 'Select'}
                              </Button>
                            )}
                          </div>
                          {cand.manifesto_text && (
                            <div className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg italic">
                              "{cand.manifesto_text}"
                            </div>
                          )}
                        </div>
                      ))}
                      {pos.candidates.length === 0 && (
                        <div className="col-span-2 text-center py-4 text-slate-400 text-sm">
                          No candidates nominated yet.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {!hasVoted && isActive && election.election_positions.length > 0 && (
                <div className="mt-6 pt-6 border-t flex justify-end">
                  <Button 
                    size="lg" 
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => handleSubmitVote(election.id, election.election_positions)}
                  >
                    <Vote className="w-4 h-4 mr-2" />
                    Submit Anonymous Vote
                  </Button>
                </div>
              )}
            </Card>
          )
        })}
        {elections.length === 0 && (
          <div className="text-center py-12 text-slate-500 border-2 border-dashed rounded-xl">
            No elections configured for this organisation.
          </div>
        )}
      </div>
    </div>
  )
}
