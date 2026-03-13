"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/auth-service"
import { toast } from "sonner"
import { LogOut, User, Settings, BarChart3, Users, Home } from "lucide-react"

interface AdminNavbarProps {
  userRole: "admin" | "super_admin" | "support"
  userEmail: string
  userName: string
}

export function AdminNavbar({ userRole, userEmail, userName }: AdminNavbarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success("Logged out successfully")
      router.push("/login")
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  const getRoleBadge = () => {
    switch (userRole) {
      case "super_admin":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Super Admin</span>
      case "admin":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Admin</span>
      case "support":
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Support</span>
      default:
        return null
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center text-white font-bold">
              ⚙️
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-gray-900">Talaritel</div>
              <div className="text-xs text-gray-500">Admin Panel</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/dashboard" icon={<Home className="h-4 w-4" />} label="Dashboard" />
            <NavLink href="/users" icon={<Users className="h-4 w-4" />} label="Users" />
            <NavLink href="/insights" icon={<BarChart3 className="h-4 w-4" />} label="Insights" />
            <NavLink href="/settings" icon={<Settings className="h-4 w-4" />} label="Settings" />
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900">{userName}</div>
              <div className="text-xs text-gray-500">{userEmail}</div>
            </div>

            {getRoleBadge()}

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold">
              {userName.charAt(0)}
            </div>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-gray-900"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition text-sm font-medium"
    >
      {icon}
      {label}
    </Link>
  )
}
