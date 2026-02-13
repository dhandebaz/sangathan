'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to our structured logging service
    // In a real app, this would be a fetch call to an API route
    console.error('Global Error Boundary:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Card className="w-full max-w-md border-red-200 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-red-900">System Error</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Something went wrong on our end. This error has been logged and our team has been notified.
              </p>
              
              {error.digest && (
                <div className="bg-gray-100 p-2 rounded text-xs font-mono text-gray-500 break-all">
                  Error ID: {error.digest}
                </div>
              )}

              <div className="flex flex-col gap-2 pt-4">
                <Button 
                  onClick={() => reset()} 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Try Again
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full">
                  <Home className="mr-2 h-4 w-4" /> Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
