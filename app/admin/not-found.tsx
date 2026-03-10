import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home } from 'lucide-react'

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-teal-600/60" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-teal-600">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Admin Page Not Found</h2>
          <p className="text-muted-foreground">
            The admin page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Link href="/admin/dashboard">
            <Button className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button variant="outline" className="w-full border-teal-600 text-teal-600 hover:bg-teal-50">
              Admin Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
