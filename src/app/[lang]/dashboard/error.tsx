'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error)
  }, [error])

  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 text-center px-4">
      <div className="p-4 bg-red-50 text-red-600 rounded-full">
        <AlertTriangle size={48} />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md">
        We encountered an error while loading your dashboard. This might be due to a temporary connection issue.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <pre className="text-xs bg-gray-100 p-4 rounded text-left overflow-auto max-w-lg w-full border border-gray-200">
          {error.message}
        </pre>
      )}
      <div className="flex gap-4 mt-4">
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload Page
        </Button>
        <Button onClick={() => reset()}>
          Try Again
        </Button>
      </div>
    </div>
  )
}

