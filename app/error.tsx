'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-red-600/60" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-red-600">Error</h1>
          <h2 className="text-2xl font-semibold text-foreground">Something went wrong</h2>
          <p className="text-muted-foreground">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={reset}
            className="w-full bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white"
          >
            Try Again
          </Button>
          <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>

        {error.digest && (
          <div className="pt-4 text-xs text-muted-foreground bg-muted p-3 rounded">
            <p>Error ID: {error.digest}</p>
          </div>
        )}
      </div>
    </div>
  )
}
