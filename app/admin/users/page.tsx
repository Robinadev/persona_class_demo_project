"use client"

import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Users as UsersIcon, Search, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/auth-service"

type User = {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
  updated_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/users?limit=100')
      const { data, error } = await response.json()

      if (error) throw error
      setUsers(data || [])
      toast.success(`Loaded ${data?.length || 0} users`)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">User Management</h2>
          <p className="text-gray-600 mt-1">Manage all Talari users and their accounts</p>
        </div>
        <Button 
          onClick={fetchUsers}
          disabled={isLoading}
          className="bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      <Card className="border-2 border-red-100 bg-white/80 backdrop-blur">
        <CardHeader className="bg-gradient-to-r from-red-50 to-yellow-50 border-b border-red-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900">User Database</CardTitle>
            <span className="text-sm px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
              {filteredUsers.length} users
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b-2 border-gray-200 bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-yellow-50 transition">
                      <td className="py-4 px-4 font-medium text-gray-900">{user.full_name || 'N/A'}</td>
                      <td className="py-4 px-4 text-gray-600">{user.email}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin' || user.role === 'super_admin'
                            ? 'bg-red-100 text-red-700' 
                            : user.role === 'user'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(user.updated_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="bg-gradient-to-r from-green-100 to-green-50 border-b border-green-200">
            <CardTitle className="text-green-900 text-sm">Total Users</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-green-700">{users.length}</p>
            <p className="text-xs text-green-600 mt-2">All registered users</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-100 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardHeader className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-b border-yellow-200">
            <CardTitle className="text-yellow-900 text-sm">Premium Users</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-yellow-700">{users.filter(u => u.role === 'user').length}</p>
            <p className="text-xs text-yellow-600 mt-2">Regular users</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-100 bg-gradient-to-br from-red-50 to-red-100/50">
          <CardHeader className="bg-gradient-to-r from-red-100 to-red-50 border-b border-red-200">
            <CardTitle className="text-red-900 text-sm">Admin Users</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-red-700">{users.filter(u => u.role === 'admin' || u.role === 'super_admin').length}</p>
            <p className="text-xs text-red-600 mt-2">Admin accounts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
