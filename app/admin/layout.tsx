"use client"

import type { ReactNode } from "react"
import Link from "next/link"
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
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { logout } from "@/app/actions/auth"

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
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      const { supabase } = await import("@/lib/auth-service")
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Logout error:", error)
    }
    router.push("/admin/login")
  }

  // Check if the current path is the login page
  if (pathname === "/admin/login" || pathname === "/admin/(auth)/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden absolute top-4 left-4">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <nav className="h-full bg-[#038E7D] text-white p-4">
            <div className="text-2xl font-bold mb-8">Talaritel Admin</div>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded transition-colors ${
                      pathname === item.href ? "bg-[#025E52] text-white" : "hover:bg-[#025E52] hover:text-white"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>

      <nav className="hidden md:block w-64 bg-[#038E7D] text-white p-4">
        <div className="text-2xl font-bold mb-8">Talaritel Admin</div>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded transition-colors ${
                  pathname === item.href ? "bg-[#025E52] text-white" : "hover:bg-[#025E52] hover:text-white"
                }`}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#038E7D]">Admin Panel</h1>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-grow container mx-auto py-8 px-4">{children}</main>
        <footer className="bg-[#F0FFF9] text-[#038E7D] py-4">
          <div className="container mx-auto text-center">&copy; {new Date().getFullYear()} Talaritel Admin</div>
        </footer>
      </div>
    </div>
  )
}
