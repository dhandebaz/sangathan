'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Sparkles, 
  Vote, 
  CheckCircle, 
  Archive, 
  Send, 
  Clock, 
  User, 
  Loader2,
  X,
  FileText
} from 'lucide-react'
import { 
  createProposal, 
  updateProposalStatus, 
  addProposalComment, 
  getProposalComments, 
  analyzeProposalAI 
} from '@/actions/proposals'

interface Proposal {
  id: string
  title: string
  content: string
  status: 'draft' | 'discussion' | 'voting' | 'completed' | 'archived' | string
  created_at: string
}

interface Comment {
  id: string
  author_name: string
  content: string
  created_at: string
}

export function ProposalManager({ proposals: initialProposals }: { proposals: Proposal[] }) {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals)
  const [showNew, setShowNew] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<string>('all')

  // Form states
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  // Active Proposal Details Modal
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isFetchingComments, setIsFetchingComments] = useState(false)

  // AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<{
    summary: string
    strengths: string[]
    concerns: string[]
    recommendation: string
  } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      toast.error('Please enter a title and description')
      return
    }

    try {
      setLoading(true)
      const result = await createProposal({ title, content, status: 'discussion' })
      
      if (result.success && result.data) {
        toast.success('Proposal created for community discussion!')
        setProposals([result.data as Proposal, ...proposals])
        setTitle('')
        setContent('')
        setShowNew(false)
      } else {
        toast.error(result.error || 'Failed to create proposal')
      }
    } catch {
      toast.error('An error occurred while creating the proposal')
    } finally {
      setLoading(false)
    }
  }

  async function handleOpenDetail(proposal: Proposal) {
    setSelectedProposal(proposal)
    setAiAnalysis(null)
    setIsFetchingComments(true)
    const res = await getProposalComments(proposal.id)
    if (res.success) {
      setComments(res.comments)
    } else {
      setComments([])
    }
    setIsFetchingComments(false)
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentText.trim() || !selectedProposal) return

    try {
      setIsSubmittingComment(true)
      const res = await addProposalComment({
        proposalId: selectedProposal.id,
        content: commentText.trim()
      })

      if (res.success && res.data) {
        toast.success('Comment added to discussion')
        setComments([...comments, res.data as Comment])
        setCommentText('')
      } else {
        toast.error(res.error || 'Failed to add comment')
      }
    } catch {
      toast.error('Error adding comment')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  async function handleStatusChange(proposalId: string, newStatus: 'draft' | 'discussion' | 'voting' | 'completed' | 'archived') {
    try {
      const res = await updateProposalStatus(proposalId, newStatus)
      if (res.success) {
        toast.success(`Proposal status updated to ${newStatus}`)
        setProposals(proposals.map(p => p.id === proposalId ? { ...p, status: newStatus } : p))
        if (selectedProposal && selectedProposal.id === proposalId) {
          setSelectedProposal({ ...selectedProposal, status: newStatus })
        }
      } else {
        toast.error(res.error || 'Failed to update status')
      }
    } catch {
      toast.error('Error updating status')
    }
  }

  async function handleRunAIAnalysis() {
    if (!selectedProposal) return
    try {
      setIsAnalyzing(true)
      const res = await analyzeProposalAI(selectedProposal.title, selectedProposal.content)
      if (res.success && res.analysis) {
        setAiAnalysis(res.analysis)
        toast.success('AI Proposal Brief generated!')
      } else {
        toast.error(res.error || 'Failed to analyze proposal')
      }
    } catch {
      toast.error('Error running AI analysis')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const filteredProposals = proposals.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.content.toLowerCase().includes(search.toLowerCase())
    const matchesTab = activeTab === 'all' || p.status === activeTab
    return matchesSearch && matchesTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'discussion':
        return <Badge variant="default" className="bg-indigo-600 text-white">In Discussion</Badge>
      case 'voting':
        return <Badge variant="default" className="bg-amber-600 text-white">Voting Open</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-emerald-600 text-white">Passed & Completed</Badge>
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Proposals & Deliberation</h1>
          <p className="text-muted-foreground mt-1">Draft, discuss, and refine policy ideas before bringing them to a vote.</p>
        </div>
        <Button onClick={() => setShowNew(!showNew)} className="bg-brand-600 hover:bg-brand-500 text-white font-medium">
          <Plus className="mr-2 h-4 w-4" />
          {showNew ? 'Close Form' : 'New Proposal'}
        </Button>
      </div>

      {/* New Proposal Form */}
      {showNew && (
        <Card className="border-brand-200 bg-card shadow-sm animate-in fade-in slide-in-from-top-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              Create Community Proposal
            </CardTitle>
            <CardDescription>
              Submit an idea or initiative for open discussion across your organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Title</label>
                <Input 
                  name="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Community Garden Installation Project" 
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Detailed Proposal</label>
                <Textarea 
                  name="content" 
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  placeholder="Explain the background, goals, expected budget, and impact of this proposal..." 
                  rows={4} 
                  required 
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
                <Button type="submit" disabled={loading || !title.trim() || !content.trim()}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create for Discussion
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-card p-3 rounded-sm border border-border">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'discussion', 'voting', 'completed', 'archived'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sm capitalize whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? 'bg-foreground text-background shadow-xs' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab === 'all' ? 'All Proposals' : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search proposals..." 
            className="pl-9 text-sm" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      {/* Proposal Cards List */}
      <div className="grid gap-4">
        {filteredProposals.map((proposal) => (
          <Card 
            key={proposal.id} 
            onClick={() => handleOpenDetail(proposal)}
            className="hover:border-brand-400 transition-all cursor-pointer group bg-card hover:shadow-sm"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-lg group-hover:text-brand-600 transition-colors">
                  {proposal.title}
                </CardTitle>
                {getStatusBadge(proposal.status)}
              </div>
              <CardDescription className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                Submitted on {new Date(proposal.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 line-clamp-2 mb-4">
                {proposal.content}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-3">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-brand-500" />
                  <span>Click to Deliberate & Discuss</span>
                </div>
                <span className="font-medium text-brand-600 group-hover:underline">View Discussion →</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredProposals.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border rounded-sm bg-muted/30">
            <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <h3 className="font-semibold text-foreground">No proposals found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {search ? 'Try clearing your search term.' : 'Click "New Proposal" above to create the first discussion.'}
            </p>
          </div>
        )}
      </div>

      {/* Selected Proposal Detail & Deliberation Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-sm max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {getStatusBadge(selectedProposal.status)}
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(selectedProposal.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">{selectedProposal.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedProposal(null)} 
                className="p-1 text-muted-foreground hover:text-foreground rounded-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Proposal Content */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Proposal Overview</h4>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted/40 p-4 rounded-sm border border-border">
                  {selectedProposal.content}
                </p>
              </div>

              {/* Status Action Toolbar */}
              <div className="p-4 bg-muted/50 rounded-sm border border-border">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Governance Pipeline</h4>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant={selectedProposal.status === 'discussion' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(selectedProposal.id, 'discussion')}
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Discussion
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedProposal.status === 'voting' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(selectedProposal.id, 'voting')}
                  >
                    <Vote className="w-3.5 h-3.5 mr-1.5" /> Open Voting
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedProposal.status === 'completed' ? 'default' : 'outline'}
                    onClick={() => handleStatusChange(selectedProposal.id, 'completed')}
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Complete
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleStatusChange(selectedProposal.id, 'archived')}
                  >
                    <Archive className="w-3.5 h-3.5 mr-1.5" /> Archive
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleRunAIAnalysis}
                    disabled={isAnalyzing}
                    className="ml-auto"
                  >
                    {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500" />}
                    AI Analysis
                  </Button>
                </div>
              </div>

              {/* AI Analysis Brief Result */}
              {aiAnalysis && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-sm space-y-3">
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                    <Sparkles className="w-4 h-4" /> AI Strategic Assessment Brief
                  </div>
                  <p className="text-xs text-foreground/90">{aiAnalysis.summary}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="bg-card p-2.5 rounded-sm border border-emerald-500/20">
                      <span className="font-semibold text-emerald-600 block mb-1">Key Strengths</span>
                      <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                        {aiAnalysis.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                      </ul>
                    </div>
                    <div className="bg-card p-2.5 rounded-sm border border-amber-500/20">
                      <span className="font-semibold text-amber-600 block mb-1">Key Considerations</span>
                      <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                        {aiAnalysis.concerns.map((c, idx) => <li key={idx}>{c}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments & Discussion Thread */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 flex items-center justify-between">
                  <span>Community Discussion ({comments.length})</span>
                  {isFetchingComments && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                </h4>

                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-3 bg-muted/30 rounded-sm border border-border">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          <User className="w-3 h-3 text-muted-foreground" /> {comment.author_name}
                        </span>
                        <span className="text-muted-foreground">{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-foreground/80">{comment.content}</p>
                    </div>
                  ))}

                  {comments.length === 0 && !isFetchingComments && (
                    <p className="text-xs text-muted-foreground text-center py-4 border border-dashed border-border rounded-sm">
                      No comments yet. Start the conversation below!
                    </p>
                  )}
                </div>

                {/* Comment Input */}
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <Input 
                    placeholder="Add your thoughts or suggestion..." 
                    value={commentText} 
                    onChange={(e) => setCommentText(e.target.value)} 
                    className="text-xs flex-1" 
                  />
                  <Button type="submit" size="sm" disabled={isSubmittingComment || !commentText.trim()}>
                    {isSubmittingComment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  </Button>
                </form>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}
