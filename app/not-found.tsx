import Link from 'next/link'
import { Layout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home, Phone } from 'lucide-react'

export default function NotFound() {
  return (
    <Layout>
      <div className='flex min-h-[calc(100vh-80px)] items-center justify-center p-4'>
        <div className='text-center space-y-6 max-w-md'>
          <div className='flex justify-center'>
            <AlertCircle className='h-16 w-16 text-[#038E7D]/60' />
          </div>
          
          <div className='space-y-2'>
            <h1 className='text-4xl font-bold text-[#038E7D]'>404</h1>
            <h2 className='text-2xl font-semibold text-foreground'>Page Not Found</h2>
            <p className='text-muted-foreground'>
              The Talari page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className='flex flex-col gap-3 pt-4'>
            <Link href='/'>
              <Button className='w-full bg-[#038E7D] hover:bg-[#025E52] text-white'>
                <Home className='mr-2 h-4 w-4' />
                Back to Home
              </Button>
            </Link>
            <Link href='/call'>
              <Button variant='outline' className='w-full border-[#038E7D] text-[#038E7D] hover:bg-[#038E7D]/10'>
                <Phone className='mr-2 h-4 w-4' />
                Make a Call
              </Button>
            </Link>
          </div>

          <div className='pt-4'>
            <p className='text-sm text-muted-foreground mb-2'>Need help?</p>
            <Link href='/support' className='text-[#038E7D] hover:underline font-medium text-sm'>
              Visit our Support Page
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
