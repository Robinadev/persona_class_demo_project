"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts"
import { Activity, TrendingUp, Users, Clock } from "lucide-react"

const activityData = [
  { date: "Mon", logins: 340, actions: 2400 },
  { date: "Tue", logins: 221, actions: 1398 },
  { date: "Wed", logins: 329, actions: 9800 },
  { date: "Thu", logins: 200, actions: 3908 },
  { date: "Fri", logins: 221, actions: 4800 },
  { date: "Sat", logins: 250, actions: 3800 },
  { date: "Sun", logins: 210, actions: 4300 },
]

export default function UserActivityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">User Activity Log</h2>
        <p className="text-gray-600 mt-1">Track user engagement and activity patterns</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-red-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-br from-red-100 to-red-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-900 text-sm">Total Logins</CardTitle>
              <Users className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-red-700">1,771</p>
            <p className="text-xs text-red-600 mt-2">This week</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-br from-yellow-100 to-yellow-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-yellow-900 text-sm">Avg Session</CardTitle>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-yellow-700">8m 24s</p>
            <p className="text-xs text-yellow-600 mt-2">Average duration</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-br from-green-100 to-green-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-900 text-sm">Total Actions</CardTitle>
              <Activity className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-green-700">30,108</p>
            <p className="text-xs text-green-600 mt-2">User actions</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-br from-blue-100 to-blue-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-900 text-sm">Engagement</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-blue-700">+32%</p>
            <p className="text-xs text-blue-600 mt-2">vs last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 border-red-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-red-50 to-yellow-50 border-b border-red-100">
            <CardTitle className="text-gray-900">Daily Logins Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="logins" stroke="#D62828" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-100">
            <CardTitle className="text-gray-900">User Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="actions" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
