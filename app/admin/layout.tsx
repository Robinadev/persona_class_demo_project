"use client"

import type { ReactNode } from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/auth-service"
import { toast } from "sonner"
import { AdminNavbar } from "./components/admin-navbar"

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: "admin" | "super_admin" | "support"
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        if (!pathname.includes("/login")) {
          router.push("/admin/login")
        }
        setIsLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, email, full_name, role")
        .eq("id", session.user.id)
        .single()

      if (profile && (profile.role === "admin" || profile.role === "super_admin" || profile.role === "support")) {
        setIsAuthenticated(true)
        setUserProfile(profile as UserProfile)
      } else {
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      if (!pathname.includes("/login")) {
        router.push("/admin/login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Login page bypass
  if (pathname === "/admin/login" || pathname === "/admin/(auth)/login") {
    return <>{children}</>
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-teal-200 animate-spin">
            <div className="w-10 h-10 rounded-full bg-white" />
          </div>
          <p className="mt-4 font-semibold text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Unauthorized
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Unauthorized access</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNavbar
        userRole={userProfile?.role || "admin"}
        userEmail={userProfile?.email || "user@talari.com"}
        userName={userProfile?.full_name || "Admin User"}
      />

      <main className="flex-grow overflow-auto bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm py-6 px-6 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} Talaritel Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  )
}
