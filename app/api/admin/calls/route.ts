import { createClient } from "@supabase/supabase-js"
import { NextResponse, NextRequest } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")
    const days = parseInt(searchParams.get("days") || "7")

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error, count } = await supabase
      .from("calls")
      .select("id, user_id, recipient_phone, duration, amount, status, created_at", { count: "exact" })
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    // Get aggregated stats
    const { data: allCalls } = await supabase
      .from("calls")
      .select("duration, amount")
      .gte("created_at", startDate.toISOString())

    const totalDuration = allCalls?.reduce((sum, c) => sum + (c.duration || 0), 0) || 0
    const totalRevenue = allCalls?.reduce((sum, c) => sum + (c.amount || 0), 0) || 0
    const avgDuration = allCalls ? totalDuration / allCalls.length : 0

    return NextResponse.json({
      data: data || [],
      total: count || 0,
      stats: {
        totalDuration,
        totalRevenue,
        avgDuration,
        callCount: allCalls?.length || 0,
      },
      limit,
      offset,
    })
  } catch (error) {
    console.error("Calls API error:", error)
    return NextResponse.json({ error: "Failed to fetch calls" }, { status: 500 })
  }
}
