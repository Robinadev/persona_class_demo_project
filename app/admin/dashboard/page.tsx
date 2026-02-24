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

// Ethiopian colors from design system
const COLORS = ["#CE1126", "#FFE135", "#007A5E", "#FFD700"]

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary">Talaritel Dashboard</h1>
          <p className="text-muted-foreground mt-2">Platform Analytics & Management</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 border-b border-primary/10">
            <CardTitle className="flex items-center justify-between">
              <span>Total Users</span>
              <Users className="h-5 w-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-4xl font-bold text-primary">1,234</p>
            <p className="text-sm text-muted-foreground mt-2">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-secondary/20 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-b border-secondary/10">
            <CardTitle className="flex items-center justify-between">
              <span>Active Calls</span>
              <PhoneCall className="h-5 w-5 text-secondary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-4xl font-bold text-secondary">42</p>
            <p className="text-sm text-muted-foreground mt-2">Currently active</p>
          </CardContent>
        </Card>
        <Card className="border-accent/20 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-br from-accent/10 to-accent/5 border-b border-accent/10">
            <CardTitle className="flex items-center justify-between">
              <span>Revenue (This Month)</span>
              <CreditCard className="h-5 w-5 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-4xl font-bold text-accent">ETB 12,345</p>
            <p className="text-sm text-muted-foreground mt-2">+8% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 border-b border-primary/10">
            <CardTitle className="flex items-center justify-between">
              <span>New Users (Week)</span>
              <RefreshCw className="h-5 w-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-4xl font-bold text-primary">78</p>
            <p className="text-sm text-muted-foreground mt-2">Registration trend</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b">
            <CardTitle className="text-primary">Calls and Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={callData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                  <YAxis yAxisId="left" orientation="left" stroke="#CE1126" />
                  <YAxis yAxisId="right" orientation="right" stroke="#007A5E" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="calls" fill="#CE1126" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#007A5E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b">
            <CardTitle className="text-primary">Transaction Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
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
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b">
          <CardTitle className="text-primary">Recent User Activities</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-3">
            {recentActivities.map((activity, index) => (
              <li key={index} className="flex flex-col md:flex-row md:justify-between md:items-center p-3 rounded-lg bg-muted/30 border border-primary/10">
                <span className="font-medium">{activity.user}</span>
                <span className="text-primary font-semibold">{activity.service}</span>
                <span className="text-sm text-muted-foreground">{activity.date}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link href="/admin/user-activity">View All Activities</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b">
          <CardTitle className="text-primary">Admin Users Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border border-primary/10">
              <span className="font-medium">Total Admins:</span>
              <span className="font-bold text-xl text-primary">{5}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border border-accent/10">
              <span className="font-medium">Active Admins:</span>
              <span className="font-bold text-xl text-accent">{4}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30 border border-destructive/10">
              <span className="font-medium">Inactive Admins:</span>
              <span className="font-bold text-xl text-destructive">{1}</span>
            </div>
          </div>
          <div className="mt-6">
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link href="/admin/manage-admins">Manage Admins</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b">
          <CardTitle className="text-primary">Current Plans</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-3">
            {plans.map((plan, index) => (
              <li key={index} className="flex flex-col md:flex-row md:justify-between md:items-center p-3 rounded-lg bg-muted/30 border border-primary/10">
                <span className="font-semibold text-primary">{plan.name}</span>
                <span className="font-bold">ETB {plan.price.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">{plan.minutes} minutes</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button asChild className="w-full bg-primary hover:bg-primary/90">
              <Link href="/admin/plans">Manage Plans</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <div>
        <h2 className="text-2xl font-bold text-primary mb-6">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/admin/users", icon: Users, label: "Manage Users", color: "primary" },
            { href: "/admin/calls", icon: PhoneCall, label: "View Call Logs", color: "secondary" },
            { href: "/admin/top-up", icon: Wallet, label: "Top-Up Management", color: "accent" },
            { href: "/admin/send-money", icon: Send, label: "Send Money Logs", color: "primary" },
            { href: "/admin/recharge", icon: RefreshCw, label: "Recharge Management", color: "secondary" },
            { href: "/admin/user-activity", icon: Activity, label: "User Activity", color: "accent" },
            { href: "/admin/plans", icon: Package, label: "Manage Plans", color: "primary" },
            { href: "/admin/billing", icon: CreditCard, label: "Billing Management", color: "secondary" },
            { href: "/admin/settings", icon: Settings, label: "System Settings", color: "accent" },
          ].map((item, index) => (
            <Button 
              key={index} 
              asChild 
              variant="outline"
              className={`h-auto py-6 border-${item.color}/20 hover:bg-${item.color}/5 border-2 transition-all hover:shadow-lg`}
            >
              <Link href={item.href} className="flex flex-col items-center gap-2">
                <item.icon className="h-6 w-6 text-primary" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
