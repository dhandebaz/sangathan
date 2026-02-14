import { ShieldAlert, Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function AccessDenied({ lang }: { lang: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <ShieldAlert className="w-10 h-10" />
      </div>
      
      <h1 className="text-3xl font-bold text-slate-900 mb-3">Access Denied</h1>
      <p className="text-slate-600 max-w-md mb-10 leading-relaxed">
        You don&apos;t have the required permissions to view this page. This section is restricted to administrators or specific roles.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline" className="gap-2">
          <Link href={`/${lang}/dashboard`}>
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Button onClick={() => window.history.back()} variant="default" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
      </div>
    </div>
  )
}
