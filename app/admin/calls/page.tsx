"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { PhoneCall, TrendingUp, Clock, DollarSign, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface CallStats {
  totalCalls: number
  avgDuration: number
  totalRevenue: number
  growth: number
  isLoading: boolean
}

const callData = [
  { date: "Mon", duration: 2400, calls: 140, revenue: 2400 },
  { date: "Tue", duration: 1398, calls: 221, revenue: 1398 },
  { date: "Wed", duration: 9800, calls: 229, revenue: 9800 },
  { date: "Thu", duration: 3908, calls: 200, revenue: 3908 },
  { date: "Fri", duration: 4800, calls: 221, revenue: 4800 },
  { date: "Sat", duration: 3800, calls: 250, revenue: 3800 },
  { date: "Sun", duration: 4300, calls: 210, revenue: 4300 },
]

export default function CallsPage() {
  const [stats, setStats] = useState<CallStats>({
    totalCalls: 0,
    avgDuration: 0,
    totalRevenue: 0,
    growth: 0,
    isLoading: true,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, isLoading: true }))
      const response = await fetch('/api/admin/calls')
      const data = await response.json()

      setStats({
        totalCalls: data.stats?.callCount || 0,
        avgDuration: data.stats?.avgDuration || 0,
        totalRevenue: data.stats?.totalRevenue || 0,
        growth: 23,
        isLoading: false,
      })
      toast.success('Call stats updated')
    } catch (error) {
      console.error('Failed to fetch call stats:', error)
      toast.error('Failed to load call statistics')
      setStats(prev => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">Call Analytics</h2>
          <p className="text-gray-600 mt-1">Monitor call volume, duration, and revenue</p>
        </div>
        <Button 
          onClick={fetchStats}
          disabled={stats.isLoading}
          className="bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${stats.isLoading ? 'animate-spin' : ''}`} />
          {stats.isLoading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-red-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-br from-red-100 to-red-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-900 text-sm">Total Calls</CardTitle>
              <PhoneCall className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-red-700">{stats.totalCalls.toLocaleString()}</p>
            <p className="text-xs text-red-600 mt-2">All-time volume</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-br from-yellow-100 to-yellow-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-yellow-900 text-sm">Avg Duration</CardTitle>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-yellow-700">{(stats.avgDuration / 60).toFixed(1)}m</p>
            <p className="text-xs text-yellow-600 mt-2">Average call time</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-br from-green-100 to-green-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-900 text-sm">Call Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-green-700">ETB {stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-2">This month</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-br from-blue-100 to-blue-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-900 text-sm">Growth</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-blue-700">+{stats.growth}%</p>
            <p className="text-xs text-blue-600 mt-2">vs last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 border-red-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-red-50 to-yellow-50 border-b border-red-100">
            <CardTitle className="text-gray-900">Call Volume Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={callData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="calls" stroke="#D62828" strokeWidth={2} dot={{ fill: '#D62828' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-100">
            <CardTitle className="text-gray-900">Revenue by Duration</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={callData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#F59E0B" />
                <Bar dataKey="duration" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
