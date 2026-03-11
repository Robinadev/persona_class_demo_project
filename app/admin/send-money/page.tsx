"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Send, TrendingUp, Users, DollarSign } from "lucide-react"

const sendMoneyData = [
  { date: "Mon", amount: 18000, transfers: 85, users: 120 },
  { date: "Tue", amount: 10500, transfers: 110, users: 180 },
  { date: "Wed", amount: 75000, transfers: 180, users: 520 },
  { date: "Thu", amount: 22000, transfers: 110, users: 240 },
  { date: "Fri", amount: 32000, transfers: 160, users: 380 },
  { date: "Sat", amount: 25000, transfers: 120, users: 280 },
  { date: "Sun", amount: 28000, transfers: 140, users: 340 },
]

export default function SendMoneyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">Money Transfer</h2>
        <p className="text-gray-600 mt-1">Monitor money transfer transactions and remittance trends</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-red-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-br from-red-100 to-red-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-900 text-sm">Total Transfers</CardTitle>
              <DollarSign className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-red-700">ETB 210,500</p>
            <p className="text-xs text-red-600 mt-2">This week</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-br from-yellow-100 to-yellow-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-yellow-900 text-sm">Transactions</CardTitle>
              <Send className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-yellow-700">905</p>
            <p className="text-xs text-yellow-600 mt-2">Total transfers</p>
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
            <p className="text-3xl font-bold text-green-700">2,040</p>
            <p className="text-xs text-green-600 mt-2">Unique users</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-br from-blue-100 to-blue-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-900 text-sm">Avg Transfer</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-blue-700">ETB 232</p>
            <p className="text-xs text-blue-600 mt-2">Average amount</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 border-red-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-red-50 to-yellow-50 border-b border-red-100">
            <CardTitle className="text-gray-900">Daily Transfer Volume</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sendMoneyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#D62828" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-100">
            <CardTitle className="text-gray-900">Transfer Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sendMoneyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="transfers" stroke="#F59E0B" strokeWidth={2} />
                <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
