import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get("auth_session")

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { plan_id } = body

    if (!plan_id) {
      return NextResponse.json({ error: "Plan ID required" }, { status: 400 })
    }

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("id", plan_id)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    // Get user's wallet
    const { data: wallet } = await supabase
      .from("wallets")
      .select("*")
      .single()

    if (!wallet || wallet.balance < plan.price) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      )
    }

    // Deduct from wallet
    const newBalance = wallet.balance - plan.price
    await supabase
      .from("wallets")
      .update({ balance: newBalance })

    // Create subscription
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + plan.duration_days)

    const { data: subscription, error: subError } = await supabase
      .from("user_subscriptions")
      .insert([
        {
          plan_id,
          status: "active",
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          auto_renew: true,
        },
      ])
      .select()
      .single()

    if (subError) {
      return NextResponse.json({ error: subError.message }, { status: 400 })
    }

    // Create transaction record
    await supabase.from("transactions").insert([
      {
        type: "plan_purchase",
        amount: plan.price,
        balance_before: wallet.balance,
        balance_after: newBalance,
        status: "completed",
        description: `Purchased ${plan.name} plan`,
        reference_id: subscription.id,
      },
    ])

    return NextResponse.json({
      success: true,
      data: subscription,
      message: "Plan purchased successfully",
    })
  } catch (error) {
    console.error("Plan purchase error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const session = cookieStore.get("auth_session")

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("*, plans(*)")
      .eq("status", "active")
      .order("start_date", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("User subscriptions fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
