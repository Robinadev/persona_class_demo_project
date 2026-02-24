"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import Script from "next/script"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-buy-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

export default function RechargePage() {
  const [amount, setAmount] = useState<number | null>(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const stripeButtonRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const amountParam = searchParams.get("amount")
    if (amountParam) {
      setAmount(Number(amountParam))
    }
  }, [searchParams])

  useEffect(() => {
    if (isScriptLoaded && stripeButtonRef.current) {
      stripeButtonRef.current.addEventListener("buy-button-completed", handlePaymentComplete)
    }

    return () => {
      if (stripeButtonRef.current) {
        stripeButtonRef.current.removeEventListener("buy-button-completed", handlePaymentComplete)
      }
    }
  }, [isScriptLoaded])

  const handlePaymentComplete = (event: Event) => {
    // Update account balance in localStorage
    const currentBalance = Number(localStorage.getItem("accountBalance") || "0")
    const newBalance = currentBalance + (amount || 0)
    localStorage.setItem("accountBalance", newBalance.toString())

    // Add recharge activity
    const rechargeActivity = {
      id: Date.now(),
      type: "Recharge",
      description: "Account recharge",
      amount: amount || 0,
      date: new Date().toISOString(),
    }
    const activities = JSON.parse(localStorage.getItem("recentActivities") || "[]")
    activities.unshift(rechargeActivity)
    localStorage.setItem("recentActivities", JSON.stringify(activities))

    router.push(`/payment-success?type=recharge&amount=${amount}`)
  }

  if (amount === null) {
    return <div>Invalid recharge amount</div>
  }

  return (
    <Layout userId="USR12345" userName="User">
      <Script
        async
        src="https://js.stripe.com/v3/buy-button.js"
        onLoad={() => {
          console.log("Stripe script loaded successfully")
          setIsScriptLoaded(true)
        }}
      />
      <div className="container py-8 md:py-12 lg:py-24">
        <Card className="max-w-md mx-auto border-[#038E7D]/10 bg-[#F0FFF9]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#038E7D]">Recharge Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <p className="text-lg font-semibold text-[#025E52]">Amount to Recharge</p>
              <p className="text-3xl font-bold text-[#038E7D]">${amount.toFixed(2)}</p>
            </div>
            <div className="flex justify-center">
              <stripe-buy-button
                ref={stripeButtonRef}
                buy-button-id="buy_btn_1Qpilj2NiV0jYzFEFs7EU7Jc"
                publishable-key="pk_test_51QphF52NiV0jYzFE0YxJzAByfc0UeGklXELwxXCAZxf70ogDm7r4XMm80Huv6hnXf5kFxVX6JaLJ88MuBNabizPu008gvgvoQF"
              ></stripe-buy-button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
