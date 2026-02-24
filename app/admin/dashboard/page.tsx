"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, PhoneCall, CreditCard, Settings, Send, Wallet, RefreshCw, Activity, Package } from "lucide-react"

// Simulated data - in a real app, this would come from an API
const callData = [
  { name: "Jan", calls: 4000, revenue: 2400 },
  { name: "Feb", calls: 3000, revenue: 1398 },
  { name: "Mar", calls: 2000, revenue: 9800 },
  { name: "Apr", calls: 2780, revenue: 3908 },
  { name: "May", calls: 1890, revenue: 4800 },
  { name: "Jun", calls: 2390, revenue: 3800 },
]

const transactionData = [
  { name: "Top-Up", value: 400 },
  { name: "Send Money", value: 300 },
  { name: "Recharge", value: 300 },
  { name: "Calls", value: 200 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const recentActivities = [
  { user: "John Doe", service: "Call", date: "2023-06-20" },
  { user: "Jane Smith", service: "Top-Up", date: "2023-06-20" },
  { user: "Bob Johnson", service: "Send Money", date: "2023-06-19" },
  { user: "Alice Brown", service: "Recharge", date: "2023-06-19" },
  { user: "Charlie Davis", service: "Call", date: "2023-06-18" },
]

const plans = [
  { name: "Basic", price: 9.99, minutes: 100 },
  { name: "Standard", price: 19.99, minutes: 300 },
  { name: "Premium", price: 29.99, minutes: 600 },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#038E7D]">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,234</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">42</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$12,345</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>New Users (This Week)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">78</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calls and Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={callData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="calls" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transaction Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {transactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent User Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentActivities.map((activity, index) => (
              <li key={index} className="flex flex-col md:flex-row md:justify-between md:items-center">
                <span>{activity.user}</span>
                <span className="text-[#038E7D]">{activity.service}</span>
                <span className="text-sm text-gray-500">{activity.date}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Button asChild>
              <Link href="/admin/user-activity">View All Activities</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Admin Users Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Admins:</span>
              <span className="font-bold">{5}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Active Admins:</span>
              <span className="font-bold text-green-600">{4}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Inactive Admins:</span>
              <span className="font-bold text-red-600">{1}</span>
            </div>
          </div>
          <div className="mt-4">
            <Button asChild>
              <Link href="/admin/manage-admins">Manage Admins</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Current Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {plans.map((plan, index) => (
              <li key={index} className="flex flex-col md:flex-row md:justify-between md:items-center">
                <span className="font-semibold">{plan.name}</span>
                <span>${plan.price.toFixed(2)}</span>
                <span>{plan.minutes} minutes</span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Button asChild>
              <Link href="/admin/plans">Manage Plans</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          { href: "/admin/users", icon: Users, label: "Manage Users" },
          { href: "/admin/calls", icon: PhoneCall, label: "View Call Logs" },
          { href: "/admin/top-up", icon: Wallet, label: "Top-Up Management" },
          { href: "/admin/send-money", icon: Send, label: "Send Money Logs" },
          { href: "/admin/recharge", icon: RefreshCw, label: "Recharge Management" },
          { href: "/admin/user-activity", icon: Activity, label: "User Activity" },
          { href: "/admin/plans", icon: Package, label: "Manage Plans" },
          { href: "/admin/billing", icon: CreditCard, label: "Billing Management" },
          { href: "/admin/settings", icon: Settings, label: "System Settings" },
          { href: "/admin/manage-admins", icon: Users, label: "Manage Admins" },
        ].map((item, index) => (
          <Button key={index} asChild className="h-auto py-4">
            <Link href={item.href} className="flex flex-col items-center">
              <item.icon className="mb-2 h-6 w-6" />
              <span>{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
