'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { supabase } from '@/lib/auth-service'
import Link from 'next/link'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message || 'Invalid credentials')
        return
      }

      if (data?.user?.id) {
        // Check if user has admin role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        const role = profile?.role

        // Only allow super_admin and admin roles to access admin panel
        if (role === 'super_admin' || role === 'admin') {
          toast.success('Logged in successfully!')
          router.push('/admin/dashboard')
        } else {
          // Sign out non-admin users
          await supabase.auth.signOut()
          toast.error('You do not have permission to access the admin panel')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4'>
      {/* Decorative elements */}
      <div className='absolute top-0 left-0 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob' />
      <div className='absolute top-0 right-0 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animation-delay-2000' />
      <div className='absolute bottom-0 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animation-delay-4000' />

      <div className='relative w-full max-w-md'>
        <Card className='border-2 border-teal-200 shadow-xl'>
          <CardHeader className='space-y-3 pb-6 bg-gradient-to-r from-teal-50 to-cyan-50'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent'>
                Talaritel
              </h1>
              <p className='text-sm text-teal-600'>
                Admin Portal
              </p>
            </div>
            <div>
              <CardTitle className='text-2xl text-teal-700'>Admin Login</CardTitle>
            </div>
          </CardHeader>

          <CardContent className='space-y-4'>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-teal-900'>Email Address</label>
                <Input
                  type='email'
                  placeholder='admin@talaritel.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className='border-2 border-teal-200 focus:border-teal-600'
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-teal-900'>Password</label>
                <Input
                  type='password'
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className='border-2 border-teal-200 focus:border-teal-600'
                />
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-semibold h-11'
              >
                {isLoading ? 'Logging in...' : 'Sign In'}
              </Button>
            </form>

            <div className='text-center text-sm text-teal-600 space-y-2'>
              <p>Only administrators can access this panel.</p>
              <Link
                href='/'
                className='text-teal-600 hover:text-teal-700 hover:underline font-medium block'
              >
                Back to Main App
              </Link>
              <Link
                href='/login'
                className='text-teal-500 hover:text-teal-600 text-xs block'
              >
                Not an admin? Go to user login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Fintech pattern decoration */}
        <div className='mt-8 flex justify-center gap-2'>
          <div className='w-2 h-2 rounded-full bg-teal-600' />
          <div className='w-2 h-2 rounded-full bg-cyan-500' />
          <div className='w-2 h-2 rounded-full bg-blue-600' />
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
