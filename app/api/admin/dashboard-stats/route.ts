import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Get active users (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count: activeUsers } = await supabase
      .from('call_logs')
      .select('*', { count: 'exact', head: true })
      .gt('created_at', yesterday)

    // Get total calls
    const { count: totalCalls } = await supabase
      .from('call_logs')
      .select('*', { count: 'exact', head: true })

    // Calculate total revenue (sum of all topups)
    const { data: revenueData } = await supabase
      .from('transactions')
      .select('amount')
      .eq('type', 'topup')

    const totalRevenue = revenueData?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0

    return NextResponse.json(
      {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalCalls: totalCalls || 0,
        totalRevenue,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
