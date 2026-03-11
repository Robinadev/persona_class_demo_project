"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { RefreshCw, TrendingUp, Users, DollarSign } from "lucide-react"

const rechargeData = [
  { date: "Mon", amount: 12000, recharges: 45 },
  { date: "Tue", amount: 8500, recharges: 32 },
  { date: "Wed", amount: 15000, recharges: 60 },
  { date: "Thu", amount: 11000, recharges: 44 },
  { date: "Fri", amount: 18000, recharges: 72 },
  { date: "Sat", amount: 14000, recharges: 56 },
  { date: "Sun", amount: 10000, recharges: 40 },
]

export default function RechargePage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">Recharge Activities</h2>
        <p className="text-gray-600 mt-1">Monitor plan recharges and subscription renewals</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-red-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-br from-red-100 to-red-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-900 text-sm">Total Revenue</CardTitle>
              <DollarSign className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-red-700">ETB 98,500</p>
            <p className="text-xs text-red-600 mt-2">This week</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-br from-yellow-100 to-yellow-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-yellow-900 text-sm">Total Recharges</CardTitle>
              <RefreshCw className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-yellow-700">349</p>
            <p className="text-xs text-yellow-600 mt-2">This week</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-br from-green-100 to-green-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-900 text-sm">Active Users</CardTitle>
              <Users className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-green-700">3,450</p>
            <p className="text-xs text-green-600 mt-2">Unique users</p>
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
            <p className="text-3xl font-bold text-blue-700">+18%</p>
            <p className="text-xs text-blue-600 mt-2">vs last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-red-100 bg-white/80 backdrop-blur">
        <CardHeader className="bg-gradient-to-r from-red-50 to-yellow-50 border-b border-red-100">
          <CardTitle className="text-gray-900">Daily Recharge Volume</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rechargeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#D62828" />
              <Bar dataKey="recharges" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
