"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp, Users, PhoneCall, DollarSign } from "lucide-react"
import { AdminHeader } from "../components/admin-header"
import { AdminCard } from "../components/admin-card"

const analyticsData = [
  { month: "Jan", users: 2400, calls: 1240, revenue: 2400 },
  { month: "Feb", users: 2210, calls: 1398, revenue: 2210 },
  { month: "Mar", users: 2290, calls: 9800, revenue: 2290 },
  { month: "Apr", users: 2000, calls: 9800, revenue: 2000 },
  { month: "May", users: 2181, calls: 7490, revenue: 2181 },
  { month: "Jun", users: 2500, calls: 3908, revenue: 2500 },
]

const userGrowthData = [
  { week: "Week 1", newUsers: 120, activeUsers: 950 },
  { week: "Week 2", newUsers: 150, activeUsers: 1100 },
  { week: "Week 3", newUsers: 180, activeUsers: 1280 },
  { week: "Week 4", newUsers: 165, activeUsers: 1445 },
]

export default function InsightsPage() {
  const [insights, setInsights] = useState({
    avgCallDuration: "4m 32s",
    userRetention: "87%",
    conversionRate: "12.5%",
    averageRevenue: "ETB 425",
  })

  return (
    <div className="space-y-12">
      {/* Header */}
      <AdminHeader
        title="Insights & Analytics"
        description="Detailed analytics and performance metrics for Talaritel platform"
      />

      {/* Key Insights Cards */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminCard
            icon={<PhoneCall className="h-8 w-8" />}
            title="Avg Call Duration"
            value={insights.avgCallDuration}
            subtitle="Average per call"
            trend="down"
            trendValue="2% vs last month"
          />
          <AdminCard
            icon={<Users className="h-8 w-8" />}
            title="User Retention"
            value={insights.userRetention}
            subtitle="30-day retention rate"
            trend="up"
            trendValue="5% increase"
          />
          <AdminCard
            icon={<TrendingUp className="h-8 w-8" />}
            title="Conversion Rate"
            value={insights.conversionRate}
            subtitle="Trial to paid"
            trend="up"
            trendValue="3% growth"
          />
          <AdminCard
            icon={<DollarSign className="h-8 w-8" />}
            title="Avg Revenue/User"
            value={insights.averageRevenue}
            subtitle="Monthly average"
            trend="up"
            trendValue="8% increase"
          />
        </div>
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Growth */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Platform Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: "12px" }} />
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                labelStyle={{ color: "#000" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#038E7D"
                strokeWidth={2}
                dot={{ fill: "#038E7D", r: 4 }}
                name="New Users"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#06B6D4"
                strokeWidth={2}
                dot={{ fill: "#06B6D4", r: 4 }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Engagement */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Weekly User Engagement</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6b7280" style={{ fontSize: "12px" }} />
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                labelStyle={{ color: "#000" }}
              />
              <Legend />
              <Bar dataKey="newUsers" fill="#038E7D" name="New Users" radius={[8, 8, 0, 0]} />
              <Bar dataKey="activeUsers" fill="#06B6D4" name="Active Users" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Summary & Insights</h2>
        <div className="prose prose-sm text-gray-600 space-y-3">
          <p>
            <strong>User Growth:</strong> The platform experienced steady user growth over the past 6 months with an average of 180 new users per week. The growth rate is accelerating with week 4 showing 165 new users.
          </p>
          <p>
            <strong>Revenue Trends:</strong> Total platform revenue has grown significantly with an average monthly revenue of ETB 425 per user, showing a positive trend in monetization efforts.
          </p>
          <p>
            <strong>User Engagement:</strong> Active user count has increased from 950 in week 1 to 1,445 in week 4, indicating improved user retention and engagement metrics.
          </p>
          <p>
            <strong>Call Performance:</strong> Average call duration remains stable at 4m 32s with a slight 2% decrease, which is within normal variance.
          </p>
        </div>
      </div>
    </div>
  )
}
