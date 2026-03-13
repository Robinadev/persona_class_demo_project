"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/auth-service"
import { Button } from "@/components/ui/button"
import { Search, RefreshCw, Users as UsersIcon } from "lucide-react"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, created_at")
        .order("created_at", { ascending: false })

      if (error) throw error
      setUsers(data || [])
      toast.success(`Loaded ${data?.length || 0} users`)
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast.error("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">Manage all Talaritel users and their accounts</p>
        </div>
        <Button onClick={fetchUsers} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Loading..." : "Refresh Users"}
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">User Database</h2>
            <span className="text-sm px-3 py-1 rounded-full bg-teal-100 text-teal-700 font-semibold">
              {filteredUsers.length} users
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <UsersIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900 text-sm">Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900 text-sm">Email</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900 text-sm">Role</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900 text-sm">Joined</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="px-6 py-4 text-gray-900 font-medium">{user.full_name || "-"}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "super_admin"
                            ? "bg-red-100 text-red-700"
                            : user.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role === "super_admin" ? "Super Admin" : user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "User"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
