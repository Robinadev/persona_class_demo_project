"use client"

import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users as UsersIcon } from "lucide-react"

type User = {
  id: string
  name: string
  email: string
  phoneNumber: string
  status: "active" | "inactive"
  registrationDate: string
}

// Simulated data - in a real app, this would come from an API
const data = [
  { id: "1", name: "John Doe", email: "john@example.com", status: "active", registrationDate: "2023-01-15", phoneNumber: "+251912345678" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", status: "inactive", registrationDate: "2023-02-20", phoneNumber: "+251923456789" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", status: "active", registrationDate: "2023-03-10", phoneNumber: "+251934567890" },
]

export default function UsersPage() {

  //useEffect(() => {
  //  fetchUsers()
  //}, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-700">User Management</h1>
          <p className="text-teal-600 mt-2">Manage Talari users and their accounts</p>
        </div>
        <Button 
          className="bg-teal-600 hover:bg-teal-700 text-white"
          onClick={() => toast.success("Add user feature coming soon!")}
        >
          <UsersIcon className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card className="border-teal-200 bg-white/80 backdrop-blur">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
          <CardTitle className="text-teal-700">Active Users</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-teal-200">
                <tr>
                  <th className="text-left py-2 px-4 font-semibold text-teal-700">Name</th>
                  <th className="text-left py-2 px-4 font-semibold text-teal-700">Email</th>
                  <th className="text-left py-2 px-4 font-semibold text-teal-700">Phone</th>
                  <th className="text-left py-2 px-4 font-semibold text-teal-700">Status</th>
                  <th className="text-left py-2 px-4 font-semibold text-teal-700">Joined</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user) => (
                  <tr key={user.id} className="border-b border-teal-100 hover:bg-teal-50">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.phoneNumber}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-teal-600">{user.registrationDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-teal-200 bg-white/80 backdrop-blur">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
          <CardTitle className="text-teal-700">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-medium">Active Users</p>
              <p className="text-2xl font-bold text-green-700 mt-2">{data.filter(u => u.status === 'active').length}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-600 font-medium">Inactive Users</p>
              <p className="text-2xl font-bold text-red-700 mt-2">{data.filter(u => u.status === 'inactive').length}</p>
            </div>
            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <p className="text-sm text-teal-600 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-teal-700 mt-2">{data.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
