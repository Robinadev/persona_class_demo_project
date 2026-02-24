"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function RoleBasedComponent({ children, requiredRole }: { children: React.ReactNode; requiredRole: string }) {
  const [adminRole, setAdminRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/check-auth", { credentials: "include" })
        const data = await res.json()
        if (data.isLoggedIn) {
          setAdminRole(data.role)
        } else {
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#038E7D]" />
      </div>
    )
  }

  if (adminRole === requiredRole || adminRole === "cfo") {
    return <>{children}</>
  }

  return null
}
