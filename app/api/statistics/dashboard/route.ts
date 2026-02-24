import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get("auth_session")

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get wallet balance
    const { data: wallet } = await supabase
      .from("wallets")
      .select("balance")
      .single()

    // Get total calls this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)

    const { count: callsCount } = await supabase
      .from("call_logs")
      .select("*", { count: "exact" })
      .gte("created_at", startOfMonth.toISOString())

    // Get total transactions
    const { data: transactions } = await supabase
      .from("transactions")
      .select("amount, type")
      .gte("created_at", startOfMonth.toISOString())

    let totalSpent = 0
    let totalReceived = 0

    transactions?.forEach((tx: any) => {
      if (
        tx.type === "call_charge" ||
        tx.type === "plan_purchase" ||
        tx.type === "send_money"
      ) {
        totalSpent += tx.amount
      } else if (tx.type === "receive_money") {
        totalReceived += tx.amount
      }
    })

    // Get active subscription
    const { data: subscription } = await supabase
      .from("user_subscriptions")
      .select("*, plans(*)")
      .eq("status", "active")
      .limit(1)
      .single()

    return NextResponse.json({
      success: true,
      data: {
        balance: wallet?.balance || 0,
        callsThisMonth: callsCount || 0,
        totalSpent,
        totalReceived,
        activeSubscription: subscription,
      },
    })
  } catch (error) {
    console.error("Statistics fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
