"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts"
import { CreditCard, DollarSign, TrendingUp, Target } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 125000, expenses: 45000, profit: 80000 },
  { month: "Feb", revenue: 132000, expenses: 48000, profit: 84000 },
  { month: "Mar", revenue: 145000, expenses: 50000, profit: 95000 },
  { month: "Apr", revenue: 158000, expenses: 52000, profit: 106000 },
  { month: "May", revenue: 172000, expenses: 55000, profit: 117000 },
  { month: "Jun", revenue: 189000, expenses: 58000, profit: 131000 },
]

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">Billing & Revenue</h2>
        <p className="text-gray-600 mt-1">Monitor financial performance and billing metrics</p>
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
            <p className="text-3xl font-bold text-red-700">ETB 921,000</p>
            <p className="text-xs text-red-600 mt-2">6-month total</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-br from-yellow-100 to-yellow-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-yellow-900 text-sm">Operating Costs</CardTitle>
              <CreditCard className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-yellow-700">ETB 308,000</p>
            <p className="text-xs text-yellow-600 mt-2">6-month total</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-br from-green-100 to-green-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-900 text-sm">Net Profit</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-green-700">ETB 613,000</p>
            <p className="text-xs text-green-600 mt-2">6-month total</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-br from-blue-100 to-blue-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-900 text-sm">Profit Margin</CardTitle>
              <Target className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-blue-700">66.5%</p>
            <p className="text-xs text-blue-600 mt-2">Healthy margin</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 border-red-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-red-50 to-yellow-50 border-b border-red-100">
            <CardTitle className="text-gray-900">Revenue & Expenses</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#D62828" />
                <Bar dataKey="expenses" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-100">
            <CardTitle className="text-gray-900">Profit Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
