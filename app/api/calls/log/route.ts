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
    const {
      phone_number,
      contact_name,
      call_type,
      call_status,
      duration_seconds = 0,
      cost = 0,
    } = body

    if (!phone_number || !call_type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("call_logs")
      .insert([
        {
          phone_number,
          contact_name,
          call_type,
          call_status,
          duration_seconds,
          cost,
          started_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Deduct cost from wallet if call was completed
    if (call_status === "completed" && cost > 0) {
      const { data: wallet } = await supabase
        .from("wallets")
        .select("balance")
        .single()

      if (wallet) {
        await supabase
          .from("wallets")
          .update({ balance: Math.max(0, wallet.balance - cost) })

        await supabase.from("transactions").insert([
          {
            type: "call_charge",
            amount: cost,
            balance_before: wallet.balance,
            balance_after: Math.max(0, wallet.balance - cost),
            status: "completed",
            description: `Call to ${phone_number} - ${duration_seconds}s`,
          },
        ])
      }
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Call log error:", error)
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

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20")

    const { data, error } = await supabase
      .from("call_logs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Call logs fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
