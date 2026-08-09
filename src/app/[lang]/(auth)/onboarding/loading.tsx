import { Loader2 } from 'lucide-react'

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        <p className="text-sm text-slate-500">Preparing your setup...</p>
      </div>
    </div>
  )
}
