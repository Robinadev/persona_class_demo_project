'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Phone, TrendingUp, Wallet, RefreshCw } from 'lucide-react'

// Mock analytics data
const dailyData = [
  { date: 'Mon', calls: 2400, topups: 2210, transfers: 229 },
  { date: 'Tue', calls: 1398, topups: 2290, transfers: 200 },
  { date: 'Wed', calls: 9800, topups: 2290, transfers: 229 },
  { date: 'Thu', calls: 3908, topups: 2000, transfers: 200 },
  { date: 'Fri', calls: 4800, topups: 2181, transfers: 220 },
  { date: 'Sat', calls: 3800, topups: 2500, transfers: 229 },
  { date: 'Sun', calls: 4300, topups: 2100, transfers: 200 },
]

const usersByCountry = [
  { name: 'USA', value: 4200 },
  { name: 'Canada', value: 3200 },
  { name: 'UK', value: 2800 },
  { name: 'Others', value: 2000 },
]

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalCalls: number
  totalRevenue: number
  lastUpdated: string
  isLoading: boolean
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 12450,
    activeUsers: 3200,
    totalCalls: 124500,
    totalRevenue: 254800,
    lastUpdated: new Date().toISOString(),
    isLoading: false,
  })

  const refreshStats = async () => {
    setStats(prev => ({ ...prev, isLoading: true }))
    try {
      const response = await fetch('/api/admin/dashboard-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(prev => ({
          ...prev,
          totalUsers: data.totalUsers || prev.totalUsers,
          activeUsers: data.activeUsers || prev.activeUsers,
          totalCalls: data.totalCalls || prev.totalCalls,
          totalRevenue: data.totalRevenue || prev.totalRevenue,
          lastUpdated: new Date().toISOString(),
        }))
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setStats(prev => ({ ...prev, isLoading: false }))
    }
  }

  useEffect(() => {
    refreshStats()
    const interval = setInterval(refreshStats, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const StatCard = ({ icon: Icon, title, value, description }: any) => (
    <Card className='border-primary/10'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className='h-4 w-4 text-primary' />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold text-primary'>{value.toLocaleString()}</div>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-primary'>Dashboard</h1>
          <p className='text-sm text-muted-foreground mt-1'>
            Real-time analytics for Talari platform
          </p>
        </div>
        <Button 
          onClick={refreshStats}
          disabled={stats.isLoading}
          className='bg-primary hover:bg-primary/90'
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${stats.isLoading ? 'animate-spin' : ''}`} />
          {stats.isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Last updated */}
      <p className='text-xs text-muted-foreground'>
        Last updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
      </p>

      {/* Stats Grid */}
      <div className='grid gap-4 md:grid-cols-4'>
        <StatCard
          icon={Users}
          title='Total Users'
          value={stats.totalUsers}
          description='Active and inactive users'
        />
        <StatCard
          icon={Users}
          title='Active Users'
          value={stats.activeUsers}
          description='Last 24 hours'
        />
        <StatCard
          icon={Phone}
          title='Total Calls'
          value={stats.totalCalls}
          description='All-time call volume'
        />
        <StatCard
          icon={Wallet}
          title='Total Revenue'
          value={`$${(stats.totalRevenue / 1000).toFixed(1)}K`}
          description='All-time revenue'
        />
      </div>

      {/* Charts */}
      <div className='grid gap-4 md:grid-cols-2'>
        {/* Activity Chart */}
        <Card className='border-primary/10'>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Last 7 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='calls' stroke='#038E7D' name='Calls' />
                <Line type='monotone' dataKey='topups' stroke='#0ea5e9' name='Top-ups' />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className='border-primary/10'>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
            <CardDescription>By transaction type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='topups' fill='#038E7D' name='Top-ups' />
                <Bar dataKey='transfers' fill='#0ea5e9' name='Transfers' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Users by Country */}
      <Card className='border-primary/10'>
        <CardHeader>
          <CardTitle>Users by Country</CardTitle>
          <CardDescription>Distribution of users worldwide</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {usersByCountry.map((country) => (
              <div key={country.name} className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-primary rounded-full' />
                  <span className='text-sm font-medium'>{country.name}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-32 h-2 bg-primary/20 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-primary'
                      style={{ width: `${(country.value / 4200) * 100}%` }}
                    />
                  </div>
                  <span className='text-sm text-muted-foreground w-12 text-right'>
                    {country.value.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
