"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, CheckCircle, AlertCircle } from "lucide-react"
import { RoleBasedComponent } from "../components/role-based-component"

const admins = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Chief Financial Officer (CFO)", status: "Active", lastLogin: "2 hours ago" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Technical Admin", status: "Active", lastLogin: "30 minutes ago" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Administrative Admin", status: "Active", lastLogin: "1 day ago" },
]

const roles = [
  { name: "Chief Financial Officer (CFO)", description: "Full access to billing and financial reports", permissions: 12, color: "bg-red-100 text-red-900" },
  { name: "Technical Admin", description: "Manage technical systems and integrations", permissions: 8, color: "bg-yellow-100 text-yellow-900" },
  { name: "Administrative Admin", description: "User management and operational tasks", permissions: 6, color: "bg-green-100 text-green-900" },
]

export default function ManageAdminsPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/admin/check-auth", { credentials: "include" })
      const data = await res.json()
      if (!data.isLoggedIn) {
        router.push("/admin/login")
      }
    }
    checkAuth()
  }, [router])

  return (
    <RoleBasedComponent requiredRole="cfo">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">Admin Management</h2>
          <p className="text-gray-600 mt-1">Manage admin users and their roles & permissions</p>
        </div>

        <div className="grid gap-6">
          <Card className="border-2 border-red-100 bg-white/80 backdrop-blur">
            <CardHeader className="bg-gradient-to-r from-red-50 to-yellow-50 border-b border-red-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900">Current Admin Users</CardTitle>
                <Users className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {admins.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">{admin.role}</Badge>
                        <span className="text-xs text-gray-500">Last login: {admin.lastLogin}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {admin.status === "Active" ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Inactive</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-white/80 backdrop-blur">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-900">Admin Roles & Permissions</CardTitle>
                <Shield className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {roles.map((role, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border ${role.color}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{role.name}</h3>
                        <p className="text-sm opacity-75 mt-1">{role.description}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                      <p className="text-sm font-medium">{role.permissions} Permissions Granted</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleBasedComponent>
  )
}
