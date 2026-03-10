import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-secondary p-4'>
      <div className='text-center space-y-6 max-w-md'>
        <div className='flex justify-center'>
          <AlertCircle className='h-16 w-16 text-primary/60' />
        </div>
        
        <div className='space-y-2'>
          <h1 className='text-4xl font-bold text-primary'>404</h1>
          <h2 className='text-2xl font-semibold text-foreground'>Page Not Found</h2>
          <p className='text-muted-foreground'>
            The admin page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className='flex flex-col gap-3 pt-4'>
          <Link href='/'>
            <Button className='w-full bg-primary hover:bg-primary/90 text-white'>
              <Home className='mr-2 h-4 w-4' />
              Back to Dashboard
            </Button>
          </Link>
          <Link href='/users'>
            <Button variant='outline' className='w-full'>
              Go to Users
            </Button>
          </Link>
        </div>

        <div className='pt-4'>
          <p className='text-sm text-muted-foreground mb-2'>Need help?</p>
          <p className='text-sm'>
            Contact support at{' '}
            <a href='mailto:support@talari.com' className='text-primary hover:underline font-medium'>
              support@talari.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
