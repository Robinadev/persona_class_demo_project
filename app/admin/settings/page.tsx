"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Lock, User, Shield, LogOut } from "lucide-react"
import { supabase } from "@/lib/auth-service"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AdminHeader } from "../components/admin-header"

export default function SettingsPage() {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        setUserProfile(profile)
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success("Logged out successfully")
      router.push("/admin/login")
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <AdminHeader
        title="Settings"
        description="Manage your admin account and preferences"
      />

      {/* Settings Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading settings...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-teal-100 rounded-lg">
                <User className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
                <p className="text-sm text-gray-600">Your account details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Full Name</p>
                  <p className="text-sm text-gray-500">{userProfile?.full_name || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Email Address</p>
                  <p className="text-sm text-gray-500">{userProfile?.email || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Account Type</p>
                  <p className="text-sm text-gray-500">
                    {userProfile?.role === "super_admin" ? "Super Admin" : userProfile?.role || "N/A"}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  userProfile?.role === "super_admin"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {userProfile?.role === "super_admin" ? "Super Admin" : "Admin"}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Member Since</p>
                  <p className="text-sm text-gray-500">{new Date(userProfile?.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Security</h2>
                <p className="text-sm text-gray-600">Manage security preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Not enabled</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Session Timeout</p>
                  <p className="text-sm text-gray-500">30 minutes</p>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Change Password</p>
                  <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Bell className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-600">Configure notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive important updates</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">System Alerts</p>
                  <p className="text-sm text-gray-500">Platform alerts enabled</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Weekly Reports</p>
                  <p className="text-sm text-gray-500">Get weekly analytics</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-red-900">Logout</h3>
                <p className="text-sm text-red-700 mt-1">Sign out of your current session</p>
              </div>
              <Button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
