import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId)

    const paymentDetails = {
      amount: session.amount_total ? session.amount_total / 100 : 0,
      recipient: lineItems.data[0]?.description?.split("(")[0].trim() || "Unknown",
      phone: lineItems.data[0]?.description?.match(/$$([^)]+)$$/)?.[1] || "Unknown",
      transactionId: session.payment_intent as string,
    }

    return NextResponse.json(paymentDetails)
  } catch (error) {
    console.error("Error fetching payment details:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
