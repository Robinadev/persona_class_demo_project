"use client"

import { LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/auth-service"
import { toast } from "sonner"

interface NavbarProps {
  userRole?: string
  userEmail?: string
  userName?: string
}

export function AdminNavbar({ userRole = "admin", userEmail = "user@talari.com", userName = "Admin User" }: NavbarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/insights", label: "Insights" },
    { href: "/admin/settings", label: "Settings" },
  ]

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success("Logged out successfully")
      router.push("/admin/login")
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-100 text-red-700"
      case "admin":
        return "bg-blue-100 text-blue-700"
      case "support":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getRoleDisplay = (role: string) => {
    return role === "super_admin" ? "Super Admin" : role.charAt(0).toUpperCase() + role.slice(1)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
        {/* Logo Section */}
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-teal-600 to-teal-400 flex items-center justify-center overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
            <img
              src="https://cdn.prod.website-cdn.com/5f8d9b1c7c8f3b2e4a5d6c7e/670e3aea-f7fa-4c57-98a6-68ad94f8a56f.svg"
              alt="Talari Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:block">
            <div className="font-bold text-base md:text-lg text-gray-900">Talaritel</div>
            <div className="text-xs text-gray-500">Admin Panel</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                pathname === item.href
                  ? "bg-teal-100 text-teal-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Section - User Info & Actions */}
        <div className="flex items-center gap-4">
          {/* Role Badge */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full font-medium text-sm ${getRoleColor(userRole)}`}>
            <div className="w-2 h-2 rounded-full bg-current opacity-70" />
            {getRoleDisplay(userRole)}
          </div>

          {/* User Profile Dropdown */}
          <div className="hidden md:block text-right">
            <div className="text-sm font-semibold text-gray-900 truncate">{userName}</div>
            <div className="text-xs text-gray-500 truncate">{userEmail}</div>
          </div>

          {/* Logout Button - Desktop */}
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="hidden md:flex text-gray-600 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0">
              <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
                <div className="flex items-center justify-between p-6 border-b">
                  <div>
                    <div className="font-bold text-gray-900">{userName}</div>
                    <div className="text-xs text-gray-500">{userEmail}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(userRole)}`}>
                    {getRoleDisplay(userRole)}
                  </div>
                </div>

                <nav className="flex-1 p-6 space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-3 rounded-lg font-medium transition-all ${
                        pathname === item.href
                          ? "bg-teal-100 text-teal-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="p-6 border-t">
                  <Button
                    onClick={() => {
                      handleLogout()
                      setIsMobileOpen(false)
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
