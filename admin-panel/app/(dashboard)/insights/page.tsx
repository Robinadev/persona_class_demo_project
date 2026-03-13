"use client"

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp, Users, PhoneCall, DollarSign } from "lucide-react"

const chartData = [
  { month: "Jan", users: 400, calls: 240, revenue: 2400 },
  { month: "Feb", users: 520, calls: 320, revenue: 2210 },
  { month: "Mar", users: 640, calls: 380, revenue: 2290 },
  { month: "Apr", users: 780, calls: 420, revenue: 2000 },
  { month: "May", users: 920, calls: 500, revenue: 2181 },
  { month: "Jun", users: 1200, calls: 580, revenue: 2500 },
]

const weeklyData = [
  { day: "Mon", calls: 140, users: 50, revenue: 2400 },
  { day: "Tue", calls: 221, users: 65, revenue: 1398 },
  { day: "Wed", calls: 229, users: 75, revenue: 9800 },
  { day: "Thu", calls: 200, users: 60, revenue: 3908 },
  { day: "Fri", calls: 221, users: 80, revenue: 4800 },
  { day: "Sat", users: 250, calls: 190, revenue: 3800 },
  { day: "Sun", users: 210, calls: 160, revenue: 4300 },
]

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Insights</h1>
        <p className="text-gray-600 mt-2">Analytics and performance data for your platform</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Call Duration</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">4m 32s</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <PhoneCall className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Retention Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">87%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">23%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenue/User</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">ETB 245</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 6-Month Growth */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Platform Growth (6 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }} />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#038E7D" strokeWidth={2} name="Users" />
              <Line type="monotone" dataKey="calls" stroke="#06B6D4" strokeWidth={2} name="Calls" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Engagement */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Weekly Engagement</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb" }} />
              <Legend />
              <Bar dataKey="users" fill="#038E7D" name="New Users" />
              <Bar dataKey="calls" fill="#06B6D4" name="Calls" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Key Insights</h2>
        <ul className="space-y-3 text-gray-600">
          <li>✓ User growth is trending upward with 200% increase in the last 6 months</li>
          <li>✓ Call volume increased by 45% compared to last quarter</li>
          <li>✓ Retention rate remains stable at 87% with consistent engagement</li>
          <li>✓ Weekend traffic is 30% higher than weekdays, indicating strong user engagement</li>
        </ul>
      </div>
    </div>
  )
}
