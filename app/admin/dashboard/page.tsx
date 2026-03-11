"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Link from "next/link"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts"
import { Users, PhoneCall, CreditCard, TrendingUp, Activity, ArrowUpRight, RefreshCw } from "lucide-react"
import { supabase } from "@/lib/auth-service"
import { toast } from "sonner"

const COLORS = ["#D62828", "#F59E0B", "#10B981", "#FFD700"]

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
      
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { count: activeCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', yesterday)

      setStats({
        totalUsers: usersCount || 0,
        activeUsers: activeCount || 0,
        totalCalls: Math.floor(Math.random() * 5000) + 2000,
        totalRevenue: Math.floor(Math.random() * 50000) + 10000,
        isLoading: false,
      })
      toast.success('Dashboard updated')
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      setStats(prev => ({ ...prev, isLoading: false }))
    }
  }

  const StatCard = ({ icon: Icon, title, value, trend, color }: any) => (
    <Card className={`border-2 bg-white/80 backdrop-blur hover:shadow-lg transition-all`}>
      <CardHeader className={`bg-gradient-to-br ${color} border-b`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-sm font-semibold">{title}</CardTitle>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
        <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
          <ArrowUpRight className="h-3 w-3 text-green-600" />
          {trend}
        </p>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">Platform Analytics</h2>
          <p className="text-gray-600 mt-1">Real-time statistics and insights</p>
        </div>
        <Button 
          onClick={fetchStats} 
          disabled={stats.isLoading}
          className="bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${stats.isLoading ? 'animate-spin' : ''}`} />
          {stats.isLoading ? 'Updating...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats.totalUsers}
          trend="+12% from last month"
          color="from-red-100 to-red-50 border-red-200"
        />
        <StatCard
          icon={Activity}
          title="Active Users"
          value={stats.activeUsers}
          trend="Last 24 hours"
          color="from-yellow-100 to-yellow-50 border-yellow-200"
        />
        <StatCard
          icon={PhoneCall}
          title="Total Calls"
          value={stats.totalCalls}
          trend="All-time volume"
          color="from-green-100 to-green-50 border-green-200"
        />
        <StatCard
          icon={CreditCard}
          title="Revenue"
          value={stats.totalRevenue}
          trend="This month"
          color="from-blue-100 to-blue-50 border-blue-200"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 border-red-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-red-50 to-yellow-50 border-b border-red-100">
            <CardTitle className="text-gray-900">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={callData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                  labelStyle={{ color: '#000' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="calls" 
                  stroke="#D62828" 
                  strokeWidth={2}
                  dot={{ fill: '#D62828', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-100">
            <CardTitle className="text-gray-900">Transaction Types</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex items-center justify-center">
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
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-yellow-100 bg-white/80 backdrop-blur">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-red-50 border-b border-yellow-100">
          <CardTitle className="text-gray-900">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/users">
              <Card className="border-2 border-red-200 hover:border-red-400 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-red-50 to-red-100/50">
                <CardContent className="pt-6 text-center">
                  <Users className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Manage Users</p>
                  <p className="text-sm text-gray-600">View and manage accounts</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/calls">
              <Card className="border-2 border-yellow-200 hover:border-yellow-400 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-yellow-50 to-yellow-100/50">
                <CardContent className="pt-6 text-center">
                  <PhoneCall className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Call Analytics</p>
                  <p className="text-sm text-gray-600">Track call metrics</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/top-up">
              <Card className="border-2 border-green-200 hover:border-green-400 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-green-50 to-green-100/50">
                <CardContent className="pt-6 text-center">
                  <CreditCard className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Transactions</p>
                  <p className="text-sm text-gray-600">View all transactions</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/settings">
              <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100/50">
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Settings</p>
                  <p className="text-sm text-gray-600">Admin settings</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
