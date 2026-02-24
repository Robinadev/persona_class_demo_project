"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import {
  ArrowRight,
  Phone,
  SendHorizontal,
  Wallet,
  Plus,
  AlertCircle,
  ArrowUpDown,
  Filter,
  RotateCcw,
  Check,
  Loader2,
  Package,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Layout } from "@/components/layout"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const mockUserId = "USR12345"

const features = [
  {
    title: "Call",
    description: "Make international calls",
    icon: Phone,
    href: "/call",
  },
  {
    title: "Top-Up",
    description: "Recharge your balance",
    icon: Wallet,
    href: "/top-up",
  },
  {
    title: "Send Money",
    description: "Transfer funds securely",
    icon: SendHorizontal,
    href: "/send-money",
  },
  {
    title: "Plans",
    description: "Choose a calling plan",
    icon: Package,
    href: "/plans",
  },
]

const plans = [
  {
    name: "Basic",
    price: 9.99,
    minutes: 100,
    features: ["100 minutes to Ethiopia", "30 days validity", "No hidden fees", "24/7 customer support"],
    recommended: false,
  },
  {
    name: "Standard",
    price: 19.99,
    minutes: 300,
    features: [
      "300 minutes to Ethiopia",
      "30 days validity",
      "No hidden fees",
      "24/7 customer support",
      "Rollover minutes",
    ],
    recommended: true,
  },
  {
    name: "Premium",
    price: 29.99,
    minutes: 600,
    features: [
      "600 minutes to Ethiopia",
      "30 days validity",
      "No hidden fees",
      "24/7 customer support",
      "Rollover minutes",
      "Free SMS",
    ],
    recommended: false,
  },
]

type Contact = {
  id: string
  name: string
  phoneNumber: string
}

type Activity = {
  id: number
  type: "Call" | "Recharge" | "Top-Up" | "Send Money" | "Plan Purchase"
  description: string
  amount: number
  duration?: string
  date: string | Date
  recipient?: string
  phoneNumber?: string
  planName?: string
  minutes?: number
}

const initialContacts: Contact[] = [
  { id: "1", name: "John Doe", phoneNumber: "+251912345678" },
  { id: "2", name: "Jane Smith", phoneNumber: "+251987654321" },
  { id: "3", name: "Alice Johnson", phoneNumber: "+251123456789" },
  { id: "4", name: "Bob Williams", phoneNumber: "+251198765432" },
  { id: "5", name: "Eva Brown", phoneNumber: "+251187654321" },
]

const addActivity = (newActivity: Activity, setRecentActivities: React.Dispatch<React.SetStateAction<Activity[]>>) => {
  setRecentActivities((prevActivities) => {
    const updatedActivity = {
      ...newActivity,
      date: format(new Date(newActivity.date), "PPpp"),
    }
    const updatedActivities = [updatedActivity, ...prevActivities.slice(0, 99)]
    localStorage.setItem("recentActivities", JSON.stringify(updatedActivities))
    return updatedActivities
  })
}

export default function DashboardPage() {
  const [accountBalance, setAccountBalance] = useState(25.5)
  const [rechargeAmount, setRechargeAmount] = useState<string>("")
  const [callingMinutes, setCallingMinutes] = useState(0)
  const [autoRechargeEnabled, setAutoRechargeEnabled] = useState(false)
  const { toast } = useToast()
  const [recentActivities, setRecentActivities] = useState<Activity[]>([
    {
      id: 1,
      type: "Call",
      description: "Call to John Doe",
      amount: -2.5,
      duration: "5:23",
      date: format(new Date(2023, 9, 15, 14, 30), "PPpp"),
      phoneNumber: "+251912345678",
    },
    {
      id: 2,
      type: "Plan Purchase",
      description: "Purchased Standard plan",
      amount: 19.99,
      date: format(new Date(2023, 9, 14, 10, 15), "PPpp"),
      planName: "Standard",
      minutes: 300,
    },
    {
      id: 3,
      type: "Top-Up",
      description: "Top-up for Jane Smith",
      amount: 10,
      date: format(new Date(2023, 9, 13, 18, 45), "PPpp"),
      recipient: "Jane Smith",
      phoneNumber: "+251987654321",
    },
    {
      id: 4,
      type: "Send Money",
      description: "Sent money to Alice Johnson",
      amount: 50,
      date: format(new Date(2023, 9, 12, 9, 20), "PPpp"),
      recipient: "Alice Johnson",
      phoneNumber: "+251123456789",
    },
    {
      id: 5,
      type: "Recharge",
      description: "Account recharge",
      amount: 25,
      date: format(new Date(2023, 9, 11, 16, 0), "PPpp"),
    },
  ])
  const [contacts] = useState<Contact[]>(initialContacts)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAmountAlert, setShowAmountAlert] = useState(false)
  const [activityFilter, setActivityFilter] = useState<Activity["type"] | "All">("All")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)
  const isInitialMount = useRef(true)
  const [accountHolderName, setAccountHolderName] = useState("") // Added state for account holder name
  const [userName, setUserName] = useState("User") // Default to "User" if no name is set
  const router = useRouter()

  useEffect(() => {
    if (isInitialMount.current) {
      const loadStoredData = () => {
        const storedMinutes = localStorage.getItem("callingMinutes")
        const storedBalance = localStorage.getItem("accountBalance")
        const storedActivities = localStorage.getItem("recentActivities")
        const storedName = localStorage.getItem("accountHolderName") // Load account holder name

        if (storedMinutes) {
          const parsedMinutes = Number.parseFloat(storedMinutes)
          setCallingMinutes(parsedMinutes)
        }

        if (storedBalance) {
          const parsedBalance = Number.parseFloat(storedBalance)
          setAccountBalance(parsedBalance)
        }

        if (storedActivities) {
          const parsedActivities = JSON.parse(storedActivities)
          if (Array.isArray(parsedActivities) && parsedActivities.length > 0) {
            setRecentActivities(
              parsedActivities.map((activity: Activity) => ({
                ...activity,
                date: typeof activity.date === "string" ? activity.date : format(new Date(activity.date), "PPpp"),
              })),
            )
          }
        }
        if (storedName) {
          setUserName(storedName.split(" ")[0]) // Use only the first name
        }
        setIsLoadingActivities(false)
      }

      loadStoredData()
      isInitialMount.current = false
    }
  }, []) // Empty dependency array

  useEffect(() => {
    localStorage.setItem("callingMinutes", callingMinutes.toString())
    localStorage.setItem("accountBalance", accountBalance.toString())
    localStorage.setItem("accountHolderName", accountHolderName) // Store account holder name
  }, [callingMinutes, accountBalance, accountHolderName])

  const updateCallingMinutes = useCallback((minutes: number) => {
    setCallingMinutes((prevMinutes) => prevMinutes + minutes)
    localStorage.setItem("callingMinutes", (callingMinutes + minutes).toString())
  }, [])

  const handleQuickRecharge = () => {
    if (!rechargeAmount) {
      setShowAmountAlert(true)
      return
    }

    setShowAmountAlert(false)
    const amount = Number.parseFloat(rechargeAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please select a valid recharge amount.",
        variant: "destructive",
      })
      return
    }

    // Redirect to the recharge payment page
    router.push(`/recharge?amount=${amount}`)
  }

  const handleAutoRechargeToggle = useCallback(
    (checked: boolean) => {
      setAutoRechargeEnabled(checked)
      toast({
        title: checked ? "Auto-recharge enabled" : "Auto-recharge disabled",
        description: checked
          ? "Your account will be automatically recharged when your balance is low during a call."
          : "You've disabled automatic recharging during calls.",
      })
    },
    [toast],
  )

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => contact.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [contacts, searchTerm])

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "Call":
        return <Phone className="h-4 w-4 text-blue-500" />
      case "Recharge":
        return <Plus className="h-4 w-4 text-green-500" />
      case "Top-Up":
        return <Wallet className="h-4 w-4 text-purple-500" />
      case "Send Money":
        return <SendHorizontal className="h-4 w-4 text-orange-500" />
      case "Plan Purchase":
        return <Package className="h-4 w-4 text-pink-500" />
      default:
        return null
    }
  }

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "Call":
        return "text-blue-500"
      case "Recharge":
        return "text-green-500"
      case "Top-Up":
        return "text-purple-500"
      case "Send Money":
        return "text-orange-500"
      case "Plan Purchase":
        return "text-pink-500"
      default:
        return "text-gray-500"
    }
  }

  const filteredAndSortedActivities = useMemo(() => {
    let filtered = recentActivities
    if (activityFilter !== "All") {
      filtered = recentActivities.filter((activity) => activity.type === activityFilter)
    }
    return filtered
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA
      })
      .map((activity) => ({
        ...activity,
        date: typeof activity.date === "string" ? activity.date : format(new Date(activity.date), "PPpp"),
      }))
  }, [recentActivities, activityFilter, sortOrder])

  const handlePlanPurchase = useCallback(
    (plan: (typeof plans)[0]) => {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        try {
          updateCallingMinutes(plan.minutes)

          const newActivity: Activity = {
            id: Date.now(),
            type: "Plan Purchase",
            description: `Purchased ${plan.name} plan`,
            amount: plan.price,
            date: new Date(),
            planName: plan.name,
            minutes: plan.minutes,
          }
          addActivity(newActivity, setRecentActivities)

          toast({
            title: "Plan Purchased",
            description: `${plan.minutes} minutes have been added to your calling plan.`,
          })

          // Redirect to payment page
          router.push(
            `/payment?type=plan&plan=${encodeURIComponent(plan.name)}&price=${encodeURIComponent(plan.price.toFixed(2))}`,
          )
        } catch (error) {
          console.error("Error purchasing plan:", error)
          toast({
            title: "Error",
            description: "There was an error processing your purchase. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
          setSelectedPlan(null)
        }
      }, 1000)
    },
    [updateCallingMinutes, toast, router, addActivity, setRecentActivities],
  )

  const handleRepeatActivity = (activity: Activity) => {
    switch (activity.type) {
      case "Call":
        if (activity.phoneNumber) {
          router.push(`/call?number=${activity.phoneNumber}`)
        }
        break
      case "Recharge":
        setRechargeAmount(Math.abs(activity.amount).toString())
        handleQuickRecharge()
        break
      case "Top-Up":
        if (activity.phoneNumber) {
          router.push(`/top-up?number=${activity.phoneNumber}&amount=${Math.abs(activity.amount)}`)
        }
        break
      case "Send Money":
        if (activity.phoneNumber && activity.recipient) {
          router.push(
            `/send-money?number=${activity.phoneNumber}&amount=${Math.abs(activity.amount)}&recipient=${activity.recipient}`,
          )
        }
        break
      case "Plan Purchase":
        if (activity.planName) {
          const plan = plans.find((p) => p.name === activity.planName)
          if (plan) {
            handlePlanPurchase(plan)
          }
        }
        break
    }
  }

  console.log("Current recent activities:", recentActivities)

  return (
    <Layout userId={mockUserId} userName={userName}>
      <div className="container py-8 md:py-12 lg:py-24">
        <>
          <h1 className="text-3xl font-normal text-center text-[#038E7D] mb-8">Hello, {userName}</h1>
          {/* Account Overview Card */}
          <Card className="mb-8 border-[#038E7D]/10 bg-[#F0FFF9]">
            <CardHeader>
              <CardTitle className="text-xl text-[#038E7D]">Account Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-[#025E52]">Balance</p>
                  <p className="text-2xl font-bold text-[#038E7D]">${accountBalance.toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <Select
                      value={rechargeAmount}
                      onValueChange={(value) => {
                        setRechargeAmount(value)
                        setShowAmountAlert(false)
                      }}
                    >
                      <SelectTrigger className="w-[120px] border-[#038E7D]/20 bg-white">
                        <SelectValue placeholder="Amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">$5</SelectItem>
                        <SelectItem value="10">$10</SelectItem>
                        <SelectItem value="20">$20</SelectItem>
                        <SelectItem value="50">$50</SelectItem>
                        <SelectItem value="100">$100</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="bg-[#038E7D] hover:bg-[#025E52] text-white" onClick={handleQuickRecharge}>
                      <Plus className="mr-2 h-4 w-4" /> Recharge
                    </Button>
                  </div>
                  {showAmountAlert && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Select Amount</AlertTitle>
                      <AlertDescription>Please select an amount.</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-[#025E52]">Calling Plan Balance</p>
                <p className="text-xl font-bold text-[#038E7D]">{callingMinutes.toFixed(0)} minutes</p>
                <p className="text-xs text-[#025E52]">Valid for 30 days from last purchase</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#025E52]">Auto-recharge during calls</p>
                  <p className="text-sm text-[#025E52]/70">Automatically recharge $5 when balance is low</p>
                </div>
                <Switch checked={autoRechargeEnabled} onCheckedChange={handleAutoRechargeToggle} />
              </div>
            </CardContent>
          </Card>
          {/* Recent Activities Card */}
          <Card className="mb-8 border-[#038E7D]/10 bg-[#F0FFF9]">
            <CardHeader>
              <CardTitle className="text-xl text-[#038E7D] flex justify-between items-center">
                <span>Recent Activities</span>
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        {activityFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setActivityFilter("All")}>All</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setActivityFilter("Call")}>Call</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setActivityFilter("Recharge")}>Recharge</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setActivityFilter("Top-Up")}>Top-Up</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setActivityFilter("Send Money")}>Send Money</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setActivityFilter("Plan Purchase")}>
                        Plan Purchase
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    {sortOrder === "asc" ? "Oldest" : "Newest"}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingActivities ? (
                <div className="flex justify-center items-center h-[300px]">
                  <Loader2 className="h-8 w-8 animate-spin text-[#038E7D]" />
                </div>
              ) : filteredAndSortedActivities.length > 0 ? (
                <div className="h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#038E7D] scrollbar-track-[#F0FFF9]">
                  {filteredAndSortedActivities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex justify-between items-center py-2 border-b border-[#038E7D]/10 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <div className="mr-3" aria-hidden="true">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <p className={`font-semibold ${getActivityColor(activity.type)}`}>{activity.type}</p>
                          <p className="text-sm text-[#025E52]">{activity.description}</p>
                          {activity.type === "Call" && activity.duration && (
                            <p className="text-xs text-[#025E52]">Duration: {activity.duration}</p>
                          )}
                          {activity.recipient && (
                            <p className="text-xs text-[#025E52]">Recipient: {activity.recipient}</p>
                          )}
                          {activity.phoneNumber && (
                            <p className="text-xs text-[#025E52]">Phone: {activity.phoneNumber}</p>
                          )}
                          {activity.planName && <p className="text-xs text-[#025E52]">Plan: {activity.planName}</p>}
                          {activity.minutes && <p className="text-xs text-[#025E52]">Minutes: {activity.minutes}</p>}
                          <p className="text-xs text-[#025E52]/70">{activity.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold ${activity.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                          ${Math.abs(activity.amount).toFixed(2)}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#038E7D] hover:bg-[#038E7D] hover:text-white w-24"
                          onClick={() => handleRepeatActivity(activity)}
                          aria-label={`Repeat ${activity.type} activity`}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" aria-hidden="true" />
                          Repeat
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[#025E52]">No recent activities to display.</p>
              )}
            </CardContent>
          </Card>
          {/* Contacts Card */}
          <Card className="mb-8 border-[#038E7D]/10 bg-[#F0FFF9]">
            <CardHeader>
              <CardTitle className="text-xl text-[#038E7D]">Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-[#038E7D]/20"
                />
              </div>
              <div className="h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#038E7D] scrollbar-track-[#F0FFF9]">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex justify-between items-center mb-4 pb-4 border-b border-[#038E7D]/10 last:border-b-0 last:mb-0 last:pb-0"
                  >
                    <div>
                      <p className="font-semibold text-[#038E7D]">{contact.name}</p>
                      <p className="text-sm text-[#025E52]">{contact.phoneNumber}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#038E7D] hover:bg-[#038E7D] hover:text-white"
                        asChild
                      >
                        <Link href={`/call?number=${contact.phoneNumber}`} aria-label={`Call ${contact.name}`}>
                          <Phone className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#038E7D] hover:bg-[#038E7D] hover:text-white"
                        asChild
                      >
                        <Link
                          href={`/send-money?number=${contact.phoneNumber}`}
                          aria-label={`Send money to ${contact.name}`}
                        >
                          <SendHorizontal className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#038E7D] hover:bg-[#038E7D] hover:text-white"
                        asChild
                      >
                        <Link href={`/top-up?number=${contact.phoneNumber}`} aria-label={`Top-up for ${contact.name}`}>
                          <Wallet className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Plans Section */}
          <Card className="mb-8 border-[#038E7D]/10 bg-[#F0FFF9]">
            <CardHeader>
              <CardTitle className="text-xl text-[#038E7D]">Calling Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan) => (
                  <Card
                    key={plan.name}
                    className={`border-[#038E7D]/10 bg-white relative ${
                      selectedPlan === plan ? "ring-2 ring-[#038E7D]" : ""
                    }`}
                  >
                    {plan.recommended && <Badge className="absolute top-2 right-2 bg-[#038E7D]">Recommended</Badge>}
                    <CardHeader>
                      <CardTitle className="text-[#038E7D]">{plan.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-[#038E7D] mb-2">${plan.price.toFixed(2)}</p>
                      <p className="text-sm text-[#025E52] mb-4">{plan.minutes} minutes to Ethiopia</p>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-5 w-5 text-[#038E7D] mr-2 flex-shrink-0" />
                            <span className="text-sm text-[#025E52]">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                      <Button
                        className={`w-full ${
                          selectedPlan === plan
                            ? "bg-[#025E52] hover:bg-[#025E52]/90"
                            : "bg-[#038E7D] hover:bg-[#025E52]"
                        } text-white`}
                        onClick={() => setSelectedPlan(plan)}
                      >
                        {selectedPlan === plan ? "Selected" : `Choose ${plan.name}`}
                      </Button>
                      {selectedPlan === plan && (
                        <Button
                          className="w-full bg-[#038E7D] hover:bg-[#025E52] text-white"
                          onClick={() => handlePlanPurchase(plan)}
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
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          {/* Features Section */}
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-[#038E7D]/10 bg-[#F0FFF9]">
                <CardContent className="p-4">
                  <feature.icon className="h-8 w-8 text-[#038E7D] mb-2" />
                  <h3 className="text-lg font-semibold text-[#038E7D] mb-1">{feature.title}</h3>
                  <p className="text-sm text-[#025E52] mb-4">{feature.description}</p>
                  <Button
                    variant="outline"
                    className="w-full border-[#038E7D] text-[#038E7D] hover:bg-[#038E7D] hover:text-white"
                    asChild
                  >
                    <Link href={feature.href}>
                      Go to {feature.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      </div>
    </Layout>
  )
}
const handleAutoRecharge = () => {
  //setShowPaymentForm(true)  //This function is not used in the provided code.  No need to move it.
}
