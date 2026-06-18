'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Plus } from 'lucide-react'
import { createProposal } from '@/actions/proposals'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Proposal {
  id: string
  title: string
  content: string
  status: string
  created_at: string
}

export function ProposalManager({ proposals: initialProposals }: { proposals: Proposal[] }) {
  const [proposals, setProposals] = useState(initialProposals)
  const [showNew, setShowNew] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const content = formData.get('content') as string

    const result = await createProposal({ title, content, status: 'discussion' })
    if (result.success) {
      setProposals([result.data as Proposal, ...proposals])
      setShowNew(false)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Proposals & Deliberation</h2>
          <p className="text-muted-foreground">Draft and discuss ideas before they go to a vote.</p>
        </div>
        <Button onClick={() => setShowNew(!showNew)}>
          <Plus className="mr-2 h-4 w-4" />
          New Proposal
        </Button>
      </div>

      {showNew && (
        <Card>
          <CardHeader>
            <CardTitle>Create Proposal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input name="title" placeholder="Proposal Title" required />
              <Textarea name="content" placeholder="Describe the proposal in detail..." required />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>Create for Discussion</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {proposals.map((proposal) => (
          <Card key={proposal.id} className="hover:border-brand-500 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{proposal.title}</CardTitle>
                <Badge variant={proposal.status === 'discussion' ? 'default' : 'secondary'}>
                  {proposal.status}
                </Badge>
              </div>
              <CardDescription>
                Created on {new Date(proposal.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{proposal.content}</p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>Discussion Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
