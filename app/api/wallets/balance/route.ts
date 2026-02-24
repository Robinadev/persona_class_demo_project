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

    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .single()

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // If wallet doesn't exist, return zero balance
    if (!data) {
      return NextResponse.json({
        success: true,
        data: { balance: 0, currency: "ETB" },
      })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Balance fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
