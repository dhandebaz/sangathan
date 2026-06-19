'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AlertTriangle, Home, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const params = useParams()
  const lang = (params?.lang as string) || 'en'

  useEffect(() => {
    console.error('Dashboard Error:', error)
  }, [error])

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-center px-4">
      <div className="p-4 bg-danger-bg text-danger-text rounded-full">
        <AlertTriangle size={48} />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md">
        We encountered an error while loading this page. This might be due to a temporary connection issue.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <pre className="text-xs bg-muted p-4 rounded text-left overflow-auto max-w-lg w-full border border-border">
          {error.message}
        </pre>
      )}
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        <Button onClick={() => reset()}>
          Try Again
        </Button>
        <Button asChild variant="outline">
          <Link href={`/${lang}/dashboard`}>
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href={`/${lang}/login`}>
            <LogIn className="h-4 w-4" />
            Back to Login
          </Link>
        </Button>
      </div>
    </div>
  )
}
