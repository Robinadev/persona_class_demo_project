"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Edit2 } from "lucide-react"

interface Activity {
  id: number
  type: string
  description: string
  amount: number
  date: string
  recipient?: string
  phoneNumber?: string
  planName?: string
  walletCompany?: string
}

export default function PaymentPage() {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("new")
  const [isEditing, setIsEditing] = useState(false)
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const planName = searchParams.get("plan")
  const planPrice = searchParams.get("price")
  const type = searchParams.get("type")
  const amount = searchParams.get("amount")
  const recipient = searchParams.get("recipient")
  const phone = searchParams.get("phone")
  const wallet = searchParams.get("wallet")

  // Simulated previous card data
  const previousCard = {
    number: "**** **** **** 1234",
    expiry: "12/24",
  }

  const addActivity = (newActivity: Activity) => {
    const updatedActivities = [newActivity, ...recentActivities]
    localStorage.setItem("recentActivities", JSON.stringify(updatedActivities))
    setRecentActivities(updatedActivities)
  }

  useEffect(() => {
    const loadStoredActivities = () => {
      const storedActivities = localStorage.getItem("recentActivities")
      if (storedActivities) {
        const parsedActivities = JSON.parse(storedActivities)
        if (Array.isArray(parsedActivities) && parsedActivities.length > 0) {
          setRecentActivities(parsedActivities)
        }
      }
      setIsLoading(false)
    }

    loadStoredActivities()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (type === "send-money" && amount && recipient && phone && wallet) {
        const amountValue = Number.parseFloat(amount)
        if (!isNaN(amountValue)) {
          // Update account balance
          const currentBalance = Number(localStorage.getItem("accountBalance") || "0")
          const newBalance = currentBalance - amountValue
          localStorage.setItem("accountBalance", newBalance.toString())

          // Add activity
          const newActivity = {
            id: Date.now(),
            type: "Send Money",
            description: `Sent money to ${recipient}`,
            amount: -amountValue,
            date: new Date().toISOString(),
            recipient: recipient,
            phoneNumber: phone,
            walletCompany: wallet,
          }
          const activities = JSON.parse(localStorage.getItem("recentActivities") || "[]")
          activities.unshift(newActivity)
          localStorage.setItem("recentActivities", JSON.stringify(activities))

          toast({
            title: "Payment Successful",
            description: `You have successfully sent $${amountValue.toFixed(2)} to ${recipient}.`,
          })

          router.push("/")
        } else {
          throw new Error("Invalid amount")
        }
      } else {
        throw new Error("Invalid transaction data")
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      toast({
        title: "Payment Failed",
        description: "An error occurred while processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setPaymentMethod("new")
  }

  if (isSuccess) {
    return (
      <Layout>
        <div className="container py-8 md:py-12 lg:py-24">
          <Card className="mx-auto max-w-md border-[#038E7D]/10 bg-[#F0FFF9]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-[#038E7D]">Payment Successful</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-[#025E52] mb-4">
                {searchParams.get("type") === "send-money"
                  ? `You have successfully sent $${searchParams.get("amount")} to ${searchParams.get("recipient")} (${searchParams.get("phone")}) via ${searchParams.get("wallet")}.`
                  : `Thank you for your payment of $${searchParams.get("amount")}.`}
              </p>
              <Button className="w-full bg-[#038E7D] hover:bg-[#025E52] text-white" onClick={() => router.push("/")}>
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12 lg:py-24">
        <Card className="mx-auto max-w-md border-[#038E7D]/10 bg-[#F0FFF9]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#038E7D]">Payment Details</CardTitle>
            <CardDescription className="text-center text-[#025E52]">
              {searchParams.get("type") === "send-money"
                ? `Sending $${searchParams.get("amount")} to ${searchParams.get("recipient")}`
                : `${planName} Plan - $${planPrice}/month`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="previous" id="previous" />
                    <Label htmlFor="previous" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Use previous card ({previousCard.number})
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new">Use a new card</Label>
                  </div>
                </RadioGroup>

                {(paymentMethod === "new" || isEditing) && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber" className="text-[#025E52]">
                        Card Number
                      </Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="border-[#038E7D]/20 bg-white text-[#038E7D]"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate" className="text-[#025E52]">
                          Expiry Date
                        </Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="border-[#038E7D]/20 bg-white text-[#038E7D]"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv" className="text-[#025E52]">
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="border-[#038E7D]/20 bg-white text-[#038E7D]"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {paymentMethod === "previous" && !isEditing && (
                  <div className="flex justify-between items-center p-2 border border-[#038E7D]/20 rounded">
                    <div>
                      <p className="font-semibold text-[#038E7D]">{previousCard.number}</p>
                      <p className="text-sm text-[#025E52]">Expires: {previousCard.expiry}</p>
                    </div>
                    <Button type="button" variant="outline" onClick={handleEdit}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full mt-6 bg-[#038E7D] hover:bg-[#025E52] text-white"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : `Pay $${searchParams.get("amount") || planPrice}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
