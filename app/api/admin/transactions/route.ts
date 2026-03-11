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
    const type = searchParams.get("type") || null

    let query = supabase
      .from("transactions")
      .select("id, user_id, type, amount, status, created_at", { count: "exact" })
      .order("created_at", { ascending: false })

    if (type) {
      query = query.eq("type", type)
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1)

    if (error) throw error

    // Get transaction stats
    const { data: allTransactions } = await supabase
      .from("transactions")
      .select("type, amount")

    const stats = {
      topup: allTransactions?.filter((t) => t.type === "top_up").length || 0,
      sendMoney: allTransactions?.filter((t) => t.type === "send_money").length || 0,
      recharge: allTransactions?.filter((t) => t.type === "recharge").length || 0,
      totalRevenue: allTransactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
    }

    return NextResponse.json({
      data: data || [],
      total: count || 0,
      stats,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Transactions API error:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}
