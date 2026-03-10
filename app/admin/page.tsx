'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    router.push('/admin/dashboard')
  }, [router])

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-200 animate-spin'>
          <div className='w-10 h-10 rounded-full bg-teal-50' />
        </div>
        <p className='mt-4 text-teal-700 font-medium'>Redirecting to dashboard...</p>
      </div>
    </div>
  )
}
