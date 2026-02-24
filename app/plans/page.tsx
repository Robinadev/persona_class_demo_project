"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Layout } from "@/components/layout"
import { useToast } from "@/components/ui/use-toast"

const plans = [
  {
    name: "Basic",
    price: "9.99",
    description: "Perfect for occasional calls",
    features: ["100 minutes to Ethiopia", "30 days validity", "No hidden fees", "24/7 customer support"],
    stripeBuyButtonId: "buy_btn_1Qr4j92NiV0jYzFEG1gZmViH",
  },
  {
    name: "Standard",
    price: "19.99",
    description: "Most popular plan",
    features: [
      "300 minutes to Ethiopia",
      "30 days validity",
      "No hidden fees",
      "24/7 customer support",
      "Rollover minutes",
    ],
    stripeBuyButtonId: "buy_btn_1Qr4zZ2NiV0jYzFE68RoIoON",
  },
  {
    name: "Premium",
    price: "29.99",
    description: "Best value for regular callers",
    features: [
      "600 minutes to Ethiopia",
      "30 days validity",
      "No hidden fees",
      "24/7 customer support",
      "Rollover minutes",
      "Free SMS",
    ],
    stripeBuyButtonId: "buy_btn_1Qr55G2NiV0jYzFEYQ294Gi1",
  },
]

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showStripeButton, setShowStripeButton] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName)
    setShowStripeButton(false)
    toast({
      title: "Plan Selected",
      description: `You have selected the ${planName} plan.`,
    })
  }

  const handleContinue = async (plan: { name: string; price: string; stripeBuyButtonId?: string }) => {
    setIsLoading(true)
    // Simulate a brief loading state
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (!plan.stripeBuyButtonId) {
      const successUrl = `/payment-success?type=plan&amount=${plan.price}&planName=${encodeURIComponent(plan.name)}`
      router.push(
        `/payment?plan=${encodeURIComponent(plan.name)}&price=${encodeURIComponent(plan.price)}&success_url=${encodeURIComponent(successUrl)}`,
      )
      return
    }

    setShowStripeButton(true)
    setIsLoading(false)
  }

  useEffect(() => {
    // This effect will run when the component mounts
    const script = document.createElement("script")
    script.src = "https://js.stripe.com/v3/buy-button.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Clean up the script when the component unmounts
      document.body.removeChild(script)
    }
  }, [])

  return (
    <Layout>
      <div className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl text-[#038E7D]">Calling Plans</h1>
          <p className="max-w-[85%] leading-normal text-[#025E52] sm:text-lg sm:leading-7">
            Choose the perfect plan for staying connected with your loved ones
          </p>
        </div>

        <div className="mx-auto grid gap-6 md:max-w-[64rem] md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col border-[#038E7D]/10 bg-[#F0FFF9] transition-all duration-300 ${
                selectedPlan === plan.name ? "ring-2 ring-[#038E7D] shadow-lg" : "hover:shadow-md"
              }`}
            >
              <CardHeader>
                <CardTitle className="text-[#038E7D]">{plan.name}</CardTitle>
                <CardDescription className="text-[#025E52]">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-3xl font-bold text-[#038E7D]">${plan.price}</div>
                <p className="text-sm text-[#025E52]/70">per month</p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-[#025E52]">
                      <Check className="h-4 w-4 text-[#038E7D]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button
                  className={`w-full ${
                    selectedPlan === plan.name
                      ? "bg-[#025E52] hover:bg-[#025E52]/90"
                      : "bg-[#038E7D] hover:bg-[#025E52]"
                  } text-white`}
                  onClick={() => handleSelectPlan(plan.name)}
                >
                  {selectedPlan === plan.name ? "Selected" : `Choose ${plan.name}`}
                </Button>
                {selectedPlan === plan.name && (
                  <Button
                    className="w-full bg-[#038E7D] hover:bg-[#025E52] text-white"
                    onClick={() => handleContinue(plan)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Continue with ${plan.name} Plan`
                    )}
                  </Button>
                )}
                {showStripeButton && selectedPlan === plan.name && plan.stripeBuyButtonId && (
                  <div className="w-full">
                    <stripe-buy-button
                      buy-button-id={plan.stripeBuyButtonId}
                      publishable-key="pk_test_51QphF52NiV0jYzFE0YxJzAByfc0UeGklXELwxXCAZxf70ogDm7r4XMm80Huv6hnXf5kFxVX6JaLJ88MuBNabizPu008gvgvoQF"
                    />
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
