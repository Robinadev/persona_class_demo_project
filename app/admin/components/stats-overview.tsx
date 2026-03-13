"use client"

import { Users, Phone, DollarSign, TrendingUp } from "lucide-react"
import { AdminCard } from "./admin-card"

interface StatsOverviewProps {
  totalUsers?: number
  activeUsers?: number
  totalCalls?: number
  totalRevenue?: number
  isLoading?: boolean
}

export function StatsOverview({
  totalUsers = 0,
  activeUsers = 0,
  totalCalls = 0,
  totalRevenue = 0,
  isLoading = false,
}: StatsOverviewProps) {
  const stats = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      subtitle: `${activeUsers} active today`,
      trend: "up" as const,
      trendValue: "+12% from last month",
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Total Calls",
      value: totalCalls.toLocaleString(),
      subtitle: "All-time volume",
      trend: "up" as const,
      trendValue: "+8% from last month",
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Total Revenue",
      value: `ETB ${totalRevenue.toLocaleString()}`,
      subtitle: "This month",
      trend: "up" as const,
      trendValue: "+23% from last month",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Growth Rate",
      value: "+15%",
      subtitle: "Quarter-over-quarter",
      trend: "up" as const,
      trendValue: "Accelerating",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <AdminCard key={index} {...stat} />
      ))}
    </div>
  )
}
