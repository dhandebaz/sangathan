'use client'

import { useEffect } from 'react'
import { ShieldAlert, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Admin Dashboard Error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-8 text-center">
      <div className="p-4 bg-red-100 text-red-600 rounded-full">
        <ShieldAlert size={48} />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">System Admin Error</h2>
      <p className="text-gray-500 max-w-md">
        This is a protected area. Access might be restricted due to missing configuration or connectivity issues.
      </p>
      {process.env.NODE_ENV === 'development' && (
        <pre className="text-xs bg-white p-4 rounded text-left overflow-auto max-w-lg w-full border border-gray-200 shadow-sm">
          {error.message}
          {error.stack}
        </pre>
      )}
      <div className="flex gap-4 mt-4">
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload Page
        </Button>
        <Button onClick={() => reset()}>
          Retry Access
        </Button>
      </div>
    </div>
  )
}
