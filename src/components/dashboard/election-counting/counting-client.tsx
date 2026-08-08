'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Vote, BarChart3, Plus, Trophy, Sparkles, Loader2 } from 'lucide-react'
import { logBoothVoteTallyAction } from '@/actions/election-counting'
import { toast } from 'sonner'

interface CountingClientProps {
  organisationId: string
  initialLogs: any[]
}

export default function CountingClient({ initialLogs }: CountingClientProps) {
  const [logs, setLogs] = useState<any[]>(initialLogs)
  const [loading, setLoading] = useState(false)

  // Form State
  const [boothName, setBoothName] = useState('')
  const [roundNumber, setRoundNumber] = useState(1)
  const [postTitle, setPostTitle] = useState('President')
  const [candidateName, setCandidateName] = useState('')
  const [votesCount, setVotesCount] = useState<number | ''>('')

  const handleLogTally = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!boothName || !candidateName || votesCount === '') return
    setLoading(true)

    try {
      const res = await logBoothVoteTallyAction({
        boothName,
        roundNumber: Number(roundNumber),
        postTitle,
        candidateName,
        votesCount: Number(votesCount)
      })

      if (res.success && res.data) {
        toast.success('Vote tally logged & saved to Supabase!')
        setLogs([res.data, ...logs])
        setCandidateName('')
        setVotesCount('')
      } else {
        toast.error(res.error || 'Failed to log vote tally')
      }
    } catch {
      toast.error('An error occurred while logging tally')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-6 rounded-2xl border border-emerald-800 shadow-xl">
        <div className="flex items-center gap-3">
          <Vote className="w-8 h-8 text-emerald-400" />
          <div>
            <h2 className="text-xl font-bold">Live Campus Election Counting Tally Desk</h2>
            <p className="text-slate-300 text-sm mt-1">
              Real-time booth-by-booth vote counting tally logger and Central Panel leads tracker.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Counting Form */}
        <Card className="lg:col-span-2 border shadow-md bg-white">
          <CardHeader className="border-b bg-slate-50">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              Log Booth Vote Tally (मतगणना प्रविष्टि)
            </CardTitle>
            <CardDescription>
              Record votes counted per candidate from individual ballot boxes or EVMs.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogTally}>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Booth Name / Box No. *</label>
                  <input
                    type="text"
                    required
                    value={boothName}
                    onChange={e => setBoothName(e.target.value)}
                    placeholder="e.g. Arts Faculty Booth #3"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Counting Round</label>
                  <input
                    type="number"
                    min={1}
                    value={roundNumber}
                    onChange={e => setRoundNumber(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Contested Post</label>
                  <select
                    value={postTitle}
                    onChange={e => setPostTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                  >
                    <option value="President">President (अध्यक्ष)</option>
                    <option value="Vice President">Vice President (उपाध्यक्ष)</option>
                    <option value="General Secretary">General Secretary (महासचिव)</option>
                    <option value="Joint Secretary">Joint Secretary (सह-सचिव)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Candidate Name *</label>
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={e => setCandidateName(e.target.value)}
                    placeholder="e.g. Priya Sharma (Left Unity)"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Votes Counted *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={votesCount}
                    onChange={e => setVotesCount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 420"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50 flex justify-end p-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Vote Tally to Supabase
              </button>
            </CardFooter>
          </form>
        </Card>

        {/* Live Leaderboard Card */}
        <Card className="border shadow-md bg-gradient-to-b from-slate-900 to-emerald-950 text-white p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Live Lead Tally Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4 text-sm text-slate-300">
            <div className="bg-white/10 p-4 rounded-xl border border-white/10">
              <p className="text-xs uppercase font-bold text-emerald-300">Central Panel Tally</p>
              <p className="text-2xl font-black text-white mt-1">Live Round Counting</p>
              <p className="text-xs text-slate-400 mt-1">{logs.length} booth entries logged</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Vote Tally Logs */}
      <Card className="border shadow-sm">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-slate-900 text-base">
            Database Election Vote Tally Logs ({logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {logs.map((item: any) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-50/50">
              <div>
                <span className="font-extrabold text-slate-900 text-base">{item.title}</span>
                <p className="text-xs text-slate-500 mt-0.5 whitespace-pre-wrap">{item.description}</p>
                <p className="text-[11px] text-emerald-700 font-medium mt-1">
                  Logged: {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                Tally Saved
              </span>
            </div>
          ))}

          {logs.length === 0 && (
            <p className="text-xs text-slate-500 p-6 text-center">No election vote tallies logged in database yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
