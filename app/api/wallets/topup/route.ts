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
    const { amount, currency = "ETB", method = "stripe" } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Get or create wallet
    const { data: wallet, error: walletError } = await supabase
      .from("wallets")
      .select("*")
      .single()

    if (walletError && walletError.code !== "PGRST116") {
      return NextResponse.json({ error: walletError.message }, { status: 400 })
    }

    // Create wallet if it doesn't exist
    if (!wallet) {
      const { data: newWallet } = await supabase
        .from("wallets")
        .insert([{ balance: 0, currency }])
        .select()
        .single()

      if (!newWallet) {
        return NextResponse.json({ error: "Failed to create wallet" }, { status: 500 })
      }
    }

    // Create transaction record
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .insert([
        {
          type: "top_up",
          amount,
          balance_before: wallet?.balance || 0,
          balance_after: (wallet?.balance || 0) + amount,
          status: "pending",
          description: `Top-up via ${method}`,
          metadata: { method },
        },
      ])
      .select()
      .single()

    if (txError) {
      return NextResponse.json({ error: txError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: transaction,
      message: "Top-up initiated",
    })
  } catch (error) {
    console.error("Top-up error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
