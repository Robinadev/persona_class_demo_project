"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle } from "lucide-react"

type TransactionDetails = {
  type: "top-up" | "plan" | "recharge" | "send-money"
  amount: number
  recipient?: string
  planName?: string
  phoneNumber?: string
}

export default function PaymentSuccessPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      // In a real application, you would fetch the transaction details from your backend
      // using the transaction ID or session ID from the URL parameters
      const type = searchParams.get("type") as TransactionDetails["type"]
      const amount = Number.parseFloat(searchParams.get("amount") || "0")
      const recipient = searchParams.get("recipient") || undefined
      const planName = searchParams.get("planName") || undefined
      const phoneNumber = searchParams.get("phoneNumber") || undefined

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setTransactionDetails({ type, amount, recipient, planName, phoneNumber })
      setIsLoading(false)
    }

    fetchTransactionDetails()
  }, [searchParams])

  const getTitle = () => {
    switch (transactionDetails?.type) {
      case "top-up":
        return "Top-Up Successful"
      case "plan":
        return "Plan Purchase Successful"
      case "recharge":
        return "Recharge Successful"
      case "send-money":
        return "Money Sent Successfully"
      default:
        return "Payment Successful"
    }
  }

  const getDescription = () => {
    if (!transactionDetails) return ""

    switch (transactionDetails.type) {
      case "top-up":
        return `You have successfully topped up $${transactionDetails.amount.toFixed(2)} for ${
          transactionDetails.recipient
        } (${transactionDetails.phoneNumber}).`
      case "plan":
        return `You have successfully purchased the ${transactionDetails.planName} plan for $${transactionDetails.amount.toFixed(
          2,
        )}.`
      case "recharge":
        return `Your account has been recharged with $${transactionDetails.amount.toFixed(2)}.`
      case "send-money":
        return `You have successfully sent $${transactionDetails.amount.toFixed(2)} to ${
          transactionDetails.recipient
        } (${transactionDetails.phoneNumber}).`
      default:
        return `Your payment of $${transactionDetails.amount.toFixed(2)} has been processed successfully.`
    }
  }

  const handleRedirect = (path: string) => {
    router.push(path)
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8 md:py-12 lg:py-24 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#038E7D]" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12 lg:py-24">
        <Card className="max-w-md mx-auto border-[#038E7D]/10 bg-[#F0FFF9]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#038E7D] flex items-center justify-center">
              <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
              {getTitle()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-[#025E52] mb-6">{getDescription()}</p>
            <p className="text-center text-[#025E52] text-sm">
              Transaction ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full bg-[#038E7D] hover:bg-[#025E52] text-white" onClick={() => handleRedirect("/")}>
              Return to Dashboard
            </Button>
            {transactionDetails?.type === "top-up" && (
              <Button
                variant="outline"
                className="w-full border-[#038E7D] text-[#038E7D] hover:bg-[#038E7D] hover:text-white"
                onClick={() => handleRedirect("/top-up")}
              >
                Top-Up Again
              </Button>
            )}
            {transactionDetails?.type === "plan" && (
              <Button
                variant="outline"
                className="w-full border-[#038E7D] text-[#038E7D] hover:bg-[#038E7D] hover:text-white"
                onClick={() => handleRedirect("/plans")}
              >
                View Plans
              </Button>
            )}
            {transactionDetails?.type === "recharge" && (
              <Button
                variant="outline"
                className="w-full border-[#038E7D] text-[#038E7D] hover:bg-[#038E7D] hover:text-white"
                onClick={() => handleRedirect("/recharge")}
              >
                Recharge Again
              </Button>
            )}
            {transactionDetails?.type === "send-money" && (
              <Button
                variant="outline"
                className="w-full border-[#038E7D] text-[#038E7D] hover:bg-[#038E7D] hover:text-white"
                onClick={() => handleRedirect("/send-money")}
              >
                Send Money Again
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  )
}
