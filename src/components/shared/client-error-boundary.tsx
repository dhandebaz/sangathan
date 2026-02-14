'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ClientErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Client Error Caught:", event.error)
      setHasError(true)
    }
    
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    if (fallback) return <>{fallback}</>
    
    return (
      <Card className="border-red-200 shadow-sm my-4">
        <CardHeader className="pb-2 flex flex-row items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <CardTitle className="text-base text-red-800">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">A client-side error occurred.</p>
          <Button size="sm" variant="outline" onClick={() => setHasError(false)}>
            <RotateCcw className="w-3 h-3 mr-2" /> Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}
