import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

export async function GET() {
  try {
    // Get total users
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })

    // Get active users (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const { count: activeUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("updated_at", yesterday)

    // Get call count
    const { data: callData } = await supabase
      .from("calls")
      .select("id", { count: "exact" })

    // Get revenue (sum of transactions)
    const { data: transactions } = await supabase
      .from("transactions")
      .select("amount")

    const totalRevenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      activeUsers: activeUsers || 0,
      totalCalls: callData?.length || 0,
      totalRevenue,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
