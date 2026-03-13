"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts"
import { Users, PhoneCall, DollarSign, TrendingUp, Activity, RefreshCw, ArrowRight } from "lucide-react"
import { supabase } from "@/lib/auth-service"
import { toast } from "sonner"
import { AdminHeader } from "../components/admin-header"
import { StatsOverview } from "../components/stats-overview"
import { AdminCard } from "../components/admin-card"

const callData = [
  { name: "Mon", calls: 400, revenue: 2400 },
  { name: "Tue", calls: 300, revenue: 1398 },
  { name: "Wed", calls: 500, revenue: 3800 },
  { name: "Thu", calls: 350, revenue: 2908 },
  { name: "Fri", calls: 450, revenue: 4800 },
  { name: "Sat", calls: 320, revenue: 3800 },
  { name: "Sun", calls: 280, revenue: 3000 },
]

const transactionData = [
  { name: "Calls", value: 35, fill: "#D62828" },
  { name: "Top-Up", value: 40, fill: "#F59E0B" },
  { name: "Send Money", value: 15, fill: "#10B981" },
  { name: "Recharge", value: 10, fill: "#FFD700" },
]

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalCalls: number
  totalRevenue: number
  isLoading: boolean
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalCalls: 0,
    totalRevenue: 0,
    isLoading: true,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, isLoading: true }))
      
      const response = await fetch('/api/admin/stats')
      const data = await response.json()

      setStats({
        totalUsers: data.totalUsers || 0,
        activeUsers: data.activeUsers || 0,
        totalCalls: data.totalCalls || 0,
        totalRevenue: data.totalRevenue || 0,
        isLoading: false,
      })
      toast.success('Dashboard updated')
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      toast.error('Failed to load dashboard stats')
      setStats(prev => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <AdminHeader
        title="Dashboard"
        description="Welcome to Talaritel Admin Panel. Monitor platform performance and user activity."
        action={
          <Button
            onClick={fetchStats}
            disabled={stats.isLoading}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${stats.isLoading ? "animate-spin" : ""}`} />
            {stats.isLoading ? "Updating..." : "Refresh Stats"}
          </Button>
        }
      />

      {/* Stats Overview */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Key Metrics</h2>
        <StatsOverview
          totalUsers={stats.totalUsers}
          activeUsers={stats.activeUsers}
          totalCalls={stats.totalCalls}
          totalRevenue={stats.totalRevenue}
          isLoading={stats.isLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={callData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: "12px" }} />
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                labelStyle={{ color: "#000" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="calls"
                stroke="#038E7D"
                strokeWidth={2}
                dot={{ fill: "#038E7D", r: 4 }}
                activeDot={{ r: 6 }}
                name="Calls"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#06B6D4"
                strokeWidth={2}
                dot={{ fill: "#06B6D4", r: 4 }}
                activeDot={{ r: 6 }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Types Pie Chart */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Transaction Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={transactionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {transactionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Access Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/users">
            <div className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-teal-300 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-600 mt-1">View and manage user accounts</p>
            </div>
          </Link>

          <Link href="/admin/insights">
            <div className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-teal-300 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900">View Insights</h3>
              <p className="text-sm text-gray-600 mt-1">Analytics and performance data</p>
            </div>
          </Link>

          <Link href="/admin/users?tab=profile">
            <div className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-teal-300 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900">Profile Info</h3>
              <p className="text-sm text-gray-600 mt-1">Your admin profile details</p>
            </div>
          </Link>

          <Link href="/admin/settings">
            <div className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-teal-300 transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900">Settings</h3>
              <p className="text-sm text-gray-600 mt-1">Admin panel settings</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
