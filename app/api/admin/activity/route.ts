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

    // Get activity logs
    const { data, error, count } = await supabase
      .from("activity_logs")
      .select("id, user_id, action, details, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    // Get activity stats
    const { data: allActivity } = await supabase
      .from("activity_logs")
      .select("action, created_at")

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayActivity = allActivity?.filter(
      (a) => new Date(a.created_at) >= today
    ) || []

    const stats = {
      totalLogins: allActivity?.filter((a) => a.action === "login").length || 0,
      today: todayActivity.length,
      activeNow: Math.floor(Math.random() * 100) + 20, // Placeholder
    }

    return NextResponse.json({
      data: data || [],
      total: count || 0,
      stats,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Activity API error:", error)
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 })
  }
}
