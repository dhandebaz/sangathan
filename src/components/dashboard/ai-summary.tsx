'use client'

import { useState, useEffect, useCallback } from 'react'
import { Sparkles, Loader2, RefreshCw, BarChart2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SangathanAiModal } from '@/components/ai/sangathan-ai-modal'

export function AiSummaryWidget({ orgId }: { orgId: string }) {
  const [summary, setSummary] = useState<string | null>(null)
  const [isAi, setIsAi] = useState(false)
  const [loading, setLoading] = useState(false)

  const generateSummary = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/ai/summary?orgId=${orgId}`)
      if (!response.ok) {
        throw new Error('Failed to load insights')
      }
      const data = await response.json()
      setSummary(data.summary)
      setIsAi(data.isAi || false)
    } catch {
      setSummary("Insights are currently unavailable. Check your network or try again later.")
      setIsAi(false)
    } finally {
      setLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    void generateSummary()
  }, [generateSummary])

  return (
    <div className="bg-gradient-to-br from-indigo-50/70 to-white rounded-2xl border border-indigo-100 p-6 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        {isAi ? <Sparkles size={120} /> : <BarChart2 size={120} />}
      </div>
      
      <div className="flex justify-between items-center mb-4 relative z-10">
        <SangathanAiModal>
          <button
            type="button"
            className="flex items-center gap-2 text-indigo-700 hover:text-indigo-900 transition-colors text-left group"
          >
            {isAi ? (
              <Sparkles size={20} className="text-indigo-500 group-hover:scale-110 transition-transform" />
            ) : (
              <BarChart2 size={20} className="text-indigo-500" />
            )}
            <h3 className="font-semibold text-lg flex items-center gap-1.5">
              <span>{isAi ? 'Sangathan AI Insights' : 'Sangathan Insights'}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100/80 text-indigo-800 uppercase">
                Info
              </span>
            </h3>
          </button>
        </SangathanAiModal>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => { void generateSummary() }}
          disabled={loading}
          className="text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </Button>
      </div>

      <div className="relative z-10 min-h-[60px] flex items-center">
        {loading ? (
          <div className="flex items-center gap-3 text-indigo-400 text-sm">
            <Loader2 size={16} className="animate-spin" />
            Analyzing weekly organizational metrics...
          </div>
        ) : (
          <p className="text-muted-foreground text-sm leading-relaxed">
            {summary}
          </p>
        )}
      </div>
    </div>
  )
}
