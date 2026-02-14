'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress' // Assuming we have this
import { castVote } from '@/actions/polls'
import { useRouter } from 'next/navigation'
import { CheckCircle, Lock } from 'lucide-react'

export function VotingInterface({ poll, options, hasVoted, isEligible, totalVotes, results }: { poll: any, options: any[], hasVoted: boolean, isEligible: boolean, totalVotes: number, results: any }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleVote = async () => {
    if (!selected) return
    setLoading(true)
    const res = await castVote({ poll_id: poll.id, option_id: selected })
    setLoading(false)
    if (res.success) {
      router.refresh()
    } else {
      alert(res.error)
    }
  }

  const showResults = hasVoted || poll.status === 'closed' || (poll.type === 'informal' && hasVoted)
  // Formal polls usually hide results until closed, but if "informal" we can show live.
  // Requirement: "If formal: Results visible only after close".
  const canSeeResults = poll.type === 'informal' || poll.status === 'closed'

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{poll.title}</CardTitle>
            <p className="text-sm text-gray-500 mt-1">{poll.description}</p>
          </div>
          <div className="text-right">
             <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${poll.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
               {poll.status}
             </span>
             {poll.type === 'formal' && <div className="text-xs text-purple-600 mt-1 font-medium">Formal Vote</div>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasVoted && isEligible && poll.status === 'active' ? (
          <div className="space-y-3">
            {options.map((opt) => (
              <div 
                key={opt.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${selected === opt.id ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}
                onClick={() => setSelected(opt.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selected === opt.id ? 'border-blue-500' : 'border-gray-400'}`}>
                    {selected === opt.id && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                  <span className="font-medium">{opt.label}</span>
                </div>
              </div>
            ))}
            <Button onClick={handleVote} disabled={!selected || loading} className="w-full">
              {loading ? 'Submitting...' : 'Cast Vote'}
            </Button>
            <p className="text-xs text-center text-gray-400">
              Your vote is {poll.voting_method === 'anonymous' ? 'anonymous' : 'recorded securely'}.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {hasVoted && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5" />
                You have voted in this poll.
              </div>
            )}
            
            {!canSeeResults && (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Results are hidden until the vote closes.</p>
              </div>
            )}

            {canSeeResults && options.map((opt) => {
              const count = results?.counts?.[opt.id] || 0
              const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
              
              return (
                <div key={opt.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{opt.label}</span>
                    <span className="text-gray-500">{count} votes ({percentage}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              )
            })}
            
            {canSeeResults && (
               <div className="text-sm text-gray-500 text-center pt-2">
                 Total Votes: {totalVotes}
               </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
