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
    const { recipient_id, amount, note } = body

    if (!recipient_id || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid recipient or amount" },
        { status: 400 }
      )
    }

    // Get sender's wallet
    const { data: senderWallet } = await supabase
      .from("wallets")
      .select("balance")
      .single()

    if (!senderWallet || senderWallet.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      )
    }

    // Start transaction
    const { data: transfer, error: transferError } = await supabase
      .from("money_transfers")
      .insert([
        {
          recipient_id,
          amount,
          note,
          status: "pending",
        },
      ])
      .select()
      .single()

    if (transferError) {
      return NextResponse.json({ error: transferError.message }, { status: 400 })
    }

    // Deduct from sender's wallet
    const newSenderBalance = senderWallet.balance - amount
    await supabase
      .from("wallets")
      .update({ balance: newSenderBalance })

    // Create sender transaction
    await supabase.from("transactions").insert([
      {
        type: "send_money",
        amount,
        balance_before: senderWallet.balance,
        balance_after: newSenderBalance,
        status: "completed",
        description: `Sent to ${recipient_id}`,
        reference_id: transfer.id,
      },
    ])

    // Get recipient's wallet
    const { data: recipientWallet } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", recipient_id)
      .single()

    if (recipientWallet) {
      const newRecipientBalance = recipientWallet.balance + amount
      await supabase
        .from("wallets")
        .update({ balance: newRecipientBalance })
        .eq("id", recipientWallet.id)

      // Create recipient transaction
      await supabase.from("transactions").insert([
        {
          user_id: recipient_id,
          wallet_id: recipientWallet.id,
          type: "receive_money",
          amount,
          balance_before: recipientWallet.balance,
          balance_after: newRecipientBalance,
          status: "completed",
          description: `Received from sender`,
          reference_id: transfer.id,
        },
      ])
    }

    // Update transfer status
    await supabase
      .from("money_transfers")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", transfer.id)

    return NextResponse.json({
      success: true,
      data: transfer,
      message: "Money transferred successfully",
    })
  } catch (error) {
    console.error("Money transfer error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
