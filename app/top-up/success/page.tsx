"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TopUpSuccessPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const sessionId = searchParams.get("session_id")
    if (sessionId) {
      fetchPaymentDetails(sessionId)
    }
  }, [searchParams])

  const fetchPaymentDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/payment-details?session_id=${sessionId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch payment details")
      }
      const data = await response.json()
      setPaymentDetails(data)
    } catch (error) {
      console.error("Error fetching payment details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12 lg:py-24">
        <Card className="max-w-md mx-auto border-[#038E7D]/10 bg-[#F0FFF9]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#038E7D]">Top-Up Successful</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-[#025E52]">Loading payment details...</p>
            ) : paymentDetails ? (
              <div className="space-y-4">
                <p className="text-center text-[#025E52]">
                  Your top-up of ${paymentDetails.amount} for {paymentDetails.recipient} ({paymentDetails.phone}) has
                  been processed successfully.
                </p>
                <p className="text-center text-[#025E52]">Transaction ID: {paymentDetails.transactionId}</p>
              </div>
            ) : (
              <p className="text-center text-[#025E52]">
                Unable to fetch payment details. Please check your account for confirmation.
              </p>
            )}
            <Button className="w-full mt-6 bg-[#038E7D] hover:bg-[#025E52] text-white" asChild>
              <Link href="/">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
