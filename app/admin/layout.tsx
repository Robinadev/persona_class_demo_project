"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Home,
  Users,
  PhoneCall,
  CreditCard,
  Settings,
  Send,
  Wallet,
  RefreshCw,
  Activity,
  Package,
  Menu,
  LogOut,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/auth-service"
import { toast } from "sonner"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/calls", label: "Calls", icon: PhoneCall },
  { href: "/admin/top-up", label: "Top-Up", icon: Wallet },
  { href: "/admin/send-money", label: "Send Money", icon: Send },
  { href: "/admin/recharge", label: "Recharge", icon: RefreshCw },
  { href: "/admin/user-activity", label: "User Activity", icon: Activity },
  { href: "/admin/plans", label: "Plans", icon: Package },
  { href: "/admin/billing", label: "Billing", icon: CreditCard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/manage-admins", label: "Manage Admins", icon: Users },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        if (!pathname.includes('/login')) {
          router.push('/admin/login')
        }
        setIsLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile?.role === 'admin' || profile?.role === 'super_admin') {
        setIsAuthenticated(true)
        setUserRole(profile.role)
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      if (!pathname.includes('/login')) {
        router.push('/admin/login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Logged out successfully')
      router.push('/admin/login')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  // Check if the current path is the login page
  if (pathname === "/admin/login" || pathname === "/admin/(auth)/login") {
    return <>{children}</>
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-red-200 to-green-200 animate-spin">
            <div className="w-10 h-10 rounded-full bg-white" />
          </div>
          <p className="mt-4 font-semibold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // If not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Unauthorized access</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-red-50 via-yellow-50 to-green-50">
      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40 hover:bg-white/20">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <nav className="h-full bg-gradient-to-b from-red-600 to-yellow-500 text-white p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/20">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                <img 
                  src="https://cdn.prod.website-cdn.com/5f8d9b1c7c8f3b2e4a5d6c7e/670e3aea-f7fa-4c57-98a6-68ad94f8a56f.svg" 
                  alt="Talari Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-bold">Talaritel</div>
                <div className="text-sm text-white/80">Admin</div>
              </div>
            </div>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      pathname === item.href 
                        ? "bg-white/20 text-white" 
                        : "text-white/90 hover:bg-white/10"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex md:w-72 bg-gradient-to-b from-red-600 to-yellow-500 text-white flex-col p-6 shadow-xl">
        <div className="flex items-center gap-3 pb-6 border-b border-white/20 mb-6">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden">
            <img 
              src="https://cdn.prod.website-cdn.com/5f8d9b1c7c8f3b2e4a5d6c7e/670e3aea-f7fa-4c57-98a6-68ad94f8a56f.svg" 
              alt="Talari Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-bold text-lg">Talaritel</div>
            <div className="text-xs text-white/80">Admin Panel</div>
          </div>
        </div>
        <ul className="space-y-2 flex-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  pathname === item.href 
                    ? "bg-white/20 text-white shadow-lg" 
                    : "text-white/90 hover:bg-white/10"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6 border-t border-white/20">
          <Button
            onClick={handleLogout}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:ml-0">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-red-100 shadow-sm sticky top-0 z-30">
          <div className="flex justify-between items-center p-4 px-6">
            <div className="md:hidden flex items-center gap-2 ml-12">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                <img 
                  src="https://cdn.prod.website-cdn.com/5f8d9b1c7c8f3b2e4a5d6c7e/670e3aea-f7fa-4c57-98a6-68ad94f8a56f.svg" 
                  alt="Talari Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="font-bold text-red-600">Talaritel</div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline px-3 py-1 rounded-full bg-gradient-to-r from-red-100 to-yellow-100 text-red-700 font-semibold text-xs">
                {userRole === 'super_admin' ? 'Super Admin' : 'Admin'}
              </span>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="hidden md:flex text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow overflow-auto p-4 md:p-8 space-y-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-red-100 bg-white/50 backdrop-blur-sm py-6 px-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Talaritel Admin Panel. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
