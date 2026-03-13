'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/auth-service'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // Verify user has admin role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (profile?.role === 'admin' || profile?.role === 'super_admin' || profile?.role === 'support') {
          router.push('/dashboard')
        } else {
          await supabase.auth.signOut()
          router.push('/login')
        }
      } else {
        router.push('/login')
      }
    }

    checkAuthAndRedirect()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-200 animate-spin">
          <div className="w-10 h-10 rounded-full bg-white" />
        </div>
        <p className="mt-4 font-semibold text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
