"use client"

import type React from "react"

import { useState, useEffect, useCallback, useReducer, useMemo, useRef } from "react"
import { Phone, RotateCcw, Plus, Search, Loader2 } from "lucide-react"
import { Check } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Script from "next/script"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layout } from "@/components/layout"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

type Contact = {
  id: string
  name: string
  phoneNumber: string
}

type RecentActivity = {
  id: string
  recipient: string
  phoneNumber: string
  amount: number
  carrier: string
  date: string
}

const placeholderContacts: Contact[] = [
  { id: "1", name: "Abebe Kebede", phoneNumber: "911234567" },
  { id: "2", name: "Tigist Alemu", phoneNumber: "922345678" },
  { id: "3", name: "Dawit Tadesse", phoneNumber: "933456789" },
  { id: "4", name: "Hiwot Gebre", phoneNumber: "944567890" },
  { id: "5", name: "Yohannes Mulugeta", phoneNumber: "955678901" },
]

const amounts = [
  { value: "5", label: "$5 (600 ETB Airtime)" },
  { value: "10", label: "$10 (1,200 ETB Airtime)" },
  { value: "15", label: "$15 (1,800 ETB Airtime)" },
  { value: "20", label: "$20 (2,400 ETB Airtime)" },
  { value: "25", label: "$25 (3,000 ETB Airtime)" },
  { value: "50", label: "$50 (6,000 ETB Airtime)" },
  { value: "100", label: "$100 (12,000 ETB Airtime)" },
]

const carriers = [
  { value: "ethio-telecom", label: "Ethio Telecom" },
  { value: "safaricom-ethiopia", label: "Safaricom Ethiopia" },
]

type FormState = {
  amount: string
  carrier: string
  phone: string
}

type FormAction =
  | { type: "SET_AMOUNT"; payload: string }
  | { type: "SET_CARRIER"; payload: string }
  | { type: "SET_PHONE"; payload: string }
  | { type: "RESET_FORM" }

const initialFormState: FormState = {
  amount: "",
  carrier: "",
  phone: "",
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_AMOUNT":
      return { ...state, amount: action.payload }
    case "SET_CARRIER":
      return { ...state, carrier: action.payload }
    case "SET_PHONE":
      return { ...state, phone: action.payload }
    case "RESET_FORM":
      return initialFormState
    default:
      return state
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-buy-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

const GiftPackages = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [showPaymentButton, setShowPaymentButton] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const packages = [
    {
      name: "Unlimited All-in-One Pack",
      price: 15,
      duration: "per month",
      features: ["Unlimited internet", "Unlimited SMS", "Unlimited calls"],
      stripeBuyButtonId: "buy_btn_1QqiiO2NiV0jYzFEOLo8oQir",
    },
    {
      name: "1 Week Unlimited Internet",
      price: 5,
      duration: "for 1 week",
      features: ["Nonstop internet for one week"],
      stripeBuyButtonId: "buy_btn_1QqlIh2NiV0jYzFEzqsmOkJ5",
    },
    {
      name: "1 Month Unlimited Internet",
      price: 10,
      duration: "for 1 month",
      features: ["Continuous internet access for one month"],
      stripeBuyButtonId: "buy_btn_1Qqlgr2NiV0jYzFEmsMAq4Vx",
    },
    {
      name: "Weekly Essential Pack",
      price: 5,
      duration: "for 1 week",
      features: ["5 GB internet", "50 SMS", "30 minutes of calls"],
      stripeBuyButtonId: "buy_btn_1Qqloj2NiV0jYzFEhYc6dHpa",
    },
    {
      name: "Monthly Family Pack",
      price: 10,
      duration: "per month",
      features: ["Unlimited internet", "300 SMS", "500 minutes of calls"],
      stripeBuyButtonId: "buy_btn_1Qr3ct2NiV0jYzFErSRY18Jy",
    },
  ]

  const handleSelectPackage = (packageName: string) => {
    setSelectedPackage(packageName)
    setShowPaymentButton(false)
  }

  const handleContinue = async () => {
    setIsLoading(true)
    // Simulate a brief loading state
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setShowPaymentButton(true)
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-center text-[#038E7D] mb-6">Gift Packages</h3>
      <div className="space-y-6">
        {packages.map((pkg, index) => (
          <Card
            key={index}
            className={`w-full flex flex-col border-[#038E7D]/10 bg-[#F0FFF9] transition-all duration-300 ${
              selectedPackage === pkg.name ? "ring-2 ring-[#038E7D] shadow-lg" : "hover:shadow-md"
            }`}
          >
            <CardHeader>
              <CardTitle className="text-[#038E7D]">{pkg.name}</CardTitle>
              <CardDescription className="text-[#025E52]">
                ${pkg.price} {pkg.duration}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 px-6 py-4">
              <ul className="mt-4 space-y-2 text-[#025E52]">
                {pkg.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center text-sm text-[#025E52]">
                    <Check className="h-4 w-4 mr-2 text-[#038E7D]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 px-6 py-4">
              <Button
                className={`w-full ${
                  selectedPackage === pkg.name
                    ? "bg-[#025E52] hover:bg-[#025E52]/90"
                    : "bg-[#038E7D] hover:bg-[#025E52]"
                } text-white`}
                onClick={() => handleSelectPackage(pkg.name)}
              >
                {selectedPackage === pkg.name ? "Selected" : `Select ${pkg.name}`}
              </Button>
              {selectedPackage === pkg.name && !showPaymentButton && (
                <Button
                  className="w-full bg-[#038E7D] hover:bg-[#025E52] text-white"
                  onClick={handleContinue}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Continue with ${pkg.name}`
                  )}
                </Button>
              )}
              {showPaymentButton && selectedPackage === pkg.name && (
                <div className="w-full">
                  <stripe-buy-button
                    buy-button-id={pkg.stripeBuyButtonId}
                    publishable-key="pk_test_51QphF52NiV0jYzFE0YxJzAByfc0UeGklXELwxXCAZxf70ogDm7r4XMm80Huv6hnXf5kFxVX6JaLJ88MuBNabizPu008gvgvoQF"
                  />
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

const SendGiftDialog = ({ isOpen, onClose, gift, contacts, selectedContacts }) => {
  const [scheduledDate, setScheduledDate] = useState<string>("")

  const handleSendGift = () => {
    const selectedContact = contacts.find((c) => c.id === selectedContacts[0])
    console.log("Sending gift:", gift)
    console.log("To contact:", selectedContact)
    console.log("Scheduled for:", scheduledDate)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Gift: {gift?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="recipient">Recipient</Label>
            <Input id="recipient" value={contacts.find((c) => c.id === selectedContacts[0])?.name || ""} readOnly />
          </div>
          <div>
            <Label htmlFor="schedule">Schedule Delivery</Label>
            <Input
              id="schedule"
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSendGift}>Send Gift</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function TopUpPage() {
  const [contacts, setContacts] = useState<Contact[]>(placeholderContacts)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newContactName, setNewContactName] = useState("")
  const [newContactPhone, setNewContactPhone] = useState("")
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false)
  const [selectedGift, setSelectedGift] = useState<any>(null)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [showStripeButton, setShowStripeButton] = useState(false)
  const [showStripeButton10, setShowStripeButton10] = useState(false)
  const [showStripeButton15, setShowStripeButton15] = useState(false)
  const [showStripeButton20, setShowStripeButton20] = useState(false)
  const [showStripeButton25, setShowStripeButton25] = useState(false)
  const [showStripeButton50, setShowStripeButton50] = useState(false)
  const [showStripeButton100, setShowStripeButton100] = useState(false)

  const [formState, dispatch] = useReducer(formReducer, initialFormState)
  const { amount, carrier, phone } = formState

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const stripeBuyButtonRef = useRef<HTMLElement | null>(null)

  // Load local data only once on mount
  useEffect(() => {
    const storedContacts = localStorage.getItem("contacts")
    const storedActivities = localStorage.getItem("topUpActivities")

    if (storedContacts) {
      const parsedContacts = JSON.parse(storedContacts)
      setContacts((prevContacts) => [
        ...prevContacts,
        ...parsedContacts.filter(
          (contact: Contact) => !prevContacts.some((pc) => pc.phoneNumber === contact.phoneNumber),
        ),
      ])
    }

    if (storedActivities) {
      setRecentActivities(JSON.parse(storedActivities))
    }
  }, [])

  // Memoize the 'number' search param value
  const numberFromQuery = useMemo(() => searchParams.get("number"), [searchParams])

  // Apply the number from query only once to avoid loops/overwrites
  const hasAppliedNumberFromQueryRef = useRef(false)
  useEffect(() => {
    if (hasAppliedNumberFromQueryRef.current) return
    if (!numberFromQuery) return

    dispatch({ type: "SET_PHONE", payload: numberFromQuery })
    hasAppliedNumberFromQueryRef.current = true
  }, [numberFromQuery])

  useEffect(() => {
    if (phone) {
      const contact = contacts.find(
        (c) => c.phoneNumber === phone || c.phoneNumber === `+251${phone}` || c.phoneNumber.endsWith(phone),
      )
      if (contact && (!selectedContact || selectedContact.id !== contact.id)) {
        setSelectedContact(contact)
      }
    } else if (selectedContact) {
      setSelectedContact(null)
    }
  }, [phone, contacts, selectedContact])

  useEffect(() => {
    if (isScriptLoaded && stripeBuyButtonRef.current) {
      const buyButton = stripeBuyButtonRef.current as any
      if (amount) {
        buyButton.amount = Number(amount) * 100
        buyButton.currency = "usd"
      }
    }
  }, [isScriptLoaded, amount])

  const handleContinue = useCallback(async () => {
    if (!carrier || !amount || !phone) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (!/^[79]\d{8}$/.test(phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 9-digit phone number starting with 7 or 9.",
        variant: "destructive",
      })
      return
    }

    const amountValue = Number(amount)
    if (isNaN(amountValue) || amountValue < 5) {
      toast({
        title: "Invalid Amount",
        description: "Please select a valid amount of $5 or more.",
        variant: "destructive",
      })
      return
    }

    if (amountValue === 5) {
      setShowStripeButton(true)
      setShowStripeButton10(false)
      setShowStripeButton15(false)
      setShowStripeButton20(false)
      setShowStripeButton25(false)
      setShowStripeButton50(false)
      setShowStripeButton100(false)
      return
    }

    if (amountValue === 10) {
      setShowStripeButton(false)
      setShowStripeButton10(true)
      setShowStripeButton15(false)
      setShowStripeButton20(false)
      setShowStripeButton25(false)
      setShowStripeButton50(false)
      setShowStripeButton100(false)
      return
    }

    if (amountValue === 15) {
      setShowStripeButton(false)
      setShowStripeButton10(false)
      setShowStripeButton15(true)
      setShowStripeButton20(false)
      setShowStripeButton25(false)
      setShowStripeButton50(false)
      setShowStripeButton100(false)
      return
    }

    if (amountValue === 20) {
      setShowStripeButton(false)
      setShowStripeButton10(false)
      setShowStripeButton15(false)
      setShowStripeButton20(true)
      setShowStripeButton25(false)
      setShowStripeButton50(false)
      setShowStripeButton100(false)
      return
    }

    if (amountValue === 25) {
      setShowStripeButton(false)
      setShowStripeButton10(false)
      setShowStripeButton15(false)
      setShowStripeButton20(false)
      setShowStripeButton25(true)
      setShowStripeButton50(false)
      setShowStripeButton100(false)
      return
    }

    if (amountValue === 50) {
      setShowStripeButton(false)
      setShowStripeButton10(false)
      setShowStripeButton15(false)
      setShowStripeButton20(false)
      setShowStripeButton25(false)
      setShowStripeButton50(true)
      setShowStripeButton100(false)
      return
    }

    if (amountValue === 100) {
      setShowStripeButton(false)
      setShowStripeButton10(false)
      setShowStripeButton15(false)
      setShowStripeButton20(false)
      setShowStripeButton25(false)
      setShowStripeButton50(false)
      setShowStripeButton100(true)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountValue,
          carrier,
          phone,
          recipient: selectedContact?.name || "Unknown",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const { url } = await response.json()
      if (url) {
        const successUrl = `/payment-success?type=top-up&amount=${amountValue}&recipient=${encodeURIComponent(
          selectedContact?.name || "Unknown",
        )}&phoneNumber=${encodeURIComponent(phone)}`

        router.push(`${url}&success_url=${encodeURIComponent(successUrl)}`)
      } else {
        throw new Error("No URL returned from checkout session creation")
      }
    } catch (error) {
      console.error("Error creating checkout session:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [amount, carrier, phone, selectedContact, router, toast])

  const handleSelectContact = useCallback((contact: Contact) => {
    setSelectedContacts((prev) => (prev.includes(contact.id) ? [] : [contact.id]))
    const formattedPhone = contact.phoneNumber.replace(/^(\+251|0)/, "")
    dispatch({ type: "SET_PHONE", payload: formattedPhone })
  }, [])

  const handleRepeat = useCallback(
    (activity: RecentActivity) => {
      dispatch({ type: "SET_PHONE", payload: activity.phoneNumber })
      dispatch({ type: "SET_AMOUNT", payload: activity.amount.toString() })
      dispatch({ type: "SET_CARRIER", payload: activity.carrier })
      const contact = contacts.find((c) => c.phoneNumber === activity.phoneNumber)
      setSelectedContact(contact || null)
    },
    [contacts],
  )

  const handleAddContact = useCallback(() => {
    if (newContactName && newContactPhone) {
      const newContact: Contact = {
        id: Date.now().toString(),
        name: newContactName,
        phoneNumber: newContactPhone,
      }

      const contactExists = contacts.some((contact) => contact.phoneNumber === newContact.phoneNumber)

      if (!contactExists) {
        setContacts((prev) => {
          const updatedContacts = [...prev, newContact]
          localStorage.setItem("contacts", JSON.stringify(updatedContacts))
          return updatedContacts
        })
        setNewContactName("")
        setNewContactPhone("")
        setIsAddContactDialogOpen(false)
        handleSelectContact(newContact)
        toast({
          title: "Contact Added",
          description: `${newContactName} has been added to your contacts.`,
        })
      } else {
        toast({
          title: "Contact Already Exists",
          description: "A contact with this phone number already exists.",
          variant: "destructive",
        })
      }
    }
  }, [newContactName, newContactPhone, contacts, handleSelectContact, toast])

  const handleClearForm = useCallback(() => {
    dispatch({ type: "RESET_FORM" })
    setSelectedContact(null)
    setSearchTerm("")
    setShowStripeButton(false)
    setShowStripeButton10(false)
    setShowStripeButton15(false)
    setShowStripeButton20(false)
    setShowStripeButton25(false)
    setShowStripeButton50(false)
    setShowStripeButton100(false)
  }, [])

  const [searchTerm, setSearchTerm] = useState("")

  const filteredContacts = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase()
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(lowercasedSearchTerm) || contact.phoneNumber.includes(searchTerm),
    )
  }, [contacts, searchTerm])

  const handlePaymentComplete = useCallback(() => {
    if (!amount || !carrier || !phone) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding with the payment.",
        variant: "destructive",
      })
      return
    }

    const newActivity: RecentActivity = {
      id: Date.now().toString(),
      recipient: selectedContact?.name || "Unknown",
      phoneNumber: phone,
      amount: Number(amount),
      carrier,
      date: new Date().toISOString(),
    }

    setRecentActivities((prev) => {
      const updatedActivities = [newActivity, ...prev]
      localStorage.setItem("topUpActivities", JSON.stringify(updatedActivities))
      return updatedActivities
    })

    toast({
      title: "Top-Up Successful",
      description: `Topped up $${amount} for ${selectedContact?.name || "Unknown"} (+251${phone})`,
    })

    // Reset form
    dispatch({ type: "RESET_FORM" })
    setSelectedContact(null)
    setSearchTerm("")

    // Redirect to home page
    router.push("/")
  }, [amount, carrier, phone, selectedContact, router, toast])

  if (!contacts.length) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Script async src="https://js.stripe.com/v3/buy-button.js" onLoad={() => setIsScriptLoaded(true)} />
      <Layout>
        <div className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl text-[#038E7D]">
              Mobile Top-Up
            </h1>
            <p className="max-w-[85%] leading-normal text-[#025E52] sm:text-lg sm:leading-7">
              Instantly recharge any Ethiopian mobile number
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-md">
            <Card className="border-primary/10 bg-[#F0FFF9]">
              <CardHeader>
                <CardTitle className="text-[#038E7D]">Top-Up Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="form" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-[#E0FFF5] mb-4">
                    <TabsTrigger
                      value="form"
                      className="data-[state=active]:bg-[#038E7D] data-[state=active]:text-white"
                    >
                      Top-Up
                    </TabsTrigger>
                    <TabsTrigger
                      value="recent"
                      className="data-[state=active]:bg-[#038E7D] data-[state=active]:text-white"
                    >
                      Recent Activities
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="form">
                    <div className="space-y-4">
                      <Card className="border-[#038E7D]/10 bg-[#F0FFF9]">
                        <CardHeader>
                          <CardTitle className="text-[#038E7D] flex justify-between items-center">
                            <span className="text-base whitespace-nowrap">Select from Contacts</span>
                            <Dialog open={isAddContactDialogOpen} onOpenChange={setIsAddContactDialogOpen}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Contact
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add New Contact</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                      Name
                                    </Label>
                                    <Input
                                      id="name"
                                      value={newContactName}
                                      onChange={(e) => setNewContactName(e.target.value)}
                                      className="col-span-3"
                                    />
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="phone" className="text-right">
                                      Phone
                                    </Label>
                                    <Input
                                      id="phone"
                                      value={newContactPhone}
                                      onChange={(e) => setNewContactPhone(e.target.value)}
                                      className="col-span-3"
                                    />
                                  </div>
                                </div>
                                <Button onClick={handleAddContact}>Add Contact</Button>
                              </DialogContent>
                            </Dialog>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center space-x-2 mb-4">
                            <Search className="text-[#038E7D]" />
                            <Input
                              placeholder="Search contacts..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="border-[#038E7D]/20"
                            />
                          </div>
                          <ScrollArea className="h-[200px]">
                            {filteredContacts.map((contact) => (
                              <div
                                key={contact.id}
                                className={`flex items-center justify-between p-2 hover:bg-[#038E7D]/10 cursor-pointer ${
                                  selectedContacts.includes(contact.id) ? "bg-[#038E7D]/20" : ""
                                }`}
                                onClick={() => handleSelectContact(contact)}
                              >
                                <div>
                                  <p className="font-semibold text-[#038E7D]">{contact.name}</p>
                                  <p className="text-sm text-[#025E52]">{contact.phoneNumber}</p>
                                </div>
                                <Button variant="outline" size="sm" className="text-[#038E7D] bg-transparent">
                                  {selectedContacts.includes(contact.id) ? "Selected" : "Select"}
                                </Button>
                              </div>
                            ))}
                          </ScrollArea>
                        </CardContent>
                      </Card>

                      <div className="space-y-2">
                        <Label htmlFor="carrier">Carrier</Label>
                        <Select
                          value={carrier}
                          onValueChange={(value) => dispatch({ type: "SET_CARRIER", payload: value })}
                        >
                          <SelectTrigger id="carrier" className="border-[#038E7D]/20 bg-white text-[#038E7D]">
                            <SelectValue placeholder="Select carrier" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-[#038E7D]/20">
                            {carriers.map((c) => (
                              <SelectItem key={c.value} value={c.value} className="text-[#038E7D]">
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="recipient">Recipient</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="recipient"
                            placeholder="Recipient's name"
                            className="border-[#038E7D]/20 bg-white text-[#038E7D]"
                            value={selectedContact?.name || ""}
                            onChange={(e) => {
                              if (selectedContact) {
                                setSelectedContact({ ...selectedContact, name: e.target.value })
                              }
                            }}
                          />
                          {selectedContact && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedContact(null)
                                dispatch({ type: "SET_PHONE", payload: "" })
                              }}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="flex">
                          <Button
                            variant="outline"
                            className="rounded-r-none px-3 border-primary/10 bg-transparent"
                            disabled
                          >
                            <Phone className="h-4 w-4 text-primary" />
                            <span className="ml-2">+251</span>
                          </Button>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="9XXXXXXXX"
                            className="rounded-l-none border-[#038E7D]/20 bg-white text-[#038E7D]"
                            value={phone}
                            onChange={(e) => {
                              const newPhone = e.target.value
                              dispatch({ type: "SET_PHONE", payload: newPhone })
                              if (selectedContact && !selectedContact.phoneNumber.endsWith(newPhone)) {
                                setSelectedContact(null)
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Select
                          value={amount}
                          onValueChange={(value) => dispatch({ type: "SET_AMOUNT", payload: value })}
                        >
                          <SelectTrigger id="amount" className="border-[#038E7D]/20 bg-white text-[#038E7D]">
                            <SelectValue placeholder="Select amount" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-[#038E7D]/20">
                            {amounts.map((a) => (
                              <SelectItem key={a.value} value={a.value} className="text-[#038E7D]">
                                {a.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4 mt-8">
                        <div className="flex space-x-4">
                          <Button
                            variant="outline"
                            className="flex-1 border-[#038E7D] text-[#038E7D] hover:bg-[#038E7D] hover:text-white bg-transparent"
                            onClick={handleClearForm}
                          >
                            Clear Form
                          </Button>
                          {(showStripeButton ||
                            showStripeButton10 ||
                            showStripeButton15 ||
                            showStripeButton20 ||
                            showStripeButton25 ||
                            showStripeButton50 ||
                            showStripeButton100) && (
                            <Button
                              variant="outline"
                              className="flex-1 border-[#038E7D] text-[#038E7D] hover:bg-[#038E7D] hover:text-white bg-transparent"
                              onClick={() => {
                                setShowStripeButton(false)
                                setShowStripeButton10(false)
                                setShowStripeButton15(false)
                                setShowStripeButton20(false)
                                setShowStripeButton25(false)
                                setShowStripeButton50(false)
                                setShowStripeButton100(false)
                              }}
                            >
                              Go Back
                            </Button>
                          )}
                          {!showStripeButton &&
                            !showStripeButton10 &&
                            !showStripeButton15 &&
                            !showStripeButton20 &&
                            !showStripeButton25 &&
                            !showStripeButton50 &&
                            !showStripeButton100 && (
                              <Button
                                className="flex-1 bg-[#038E7D] hover:bg-[#025E52] text-white"
                                onClick={handleContinue}
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  "Continue to Payment"
                                )}
                              </Button>
                            )}
                        </div>
                        {showStripeButton && (
                          <div
                            ref={stripeBuyButtonRef}
                            className="w-fullmax-w-md mx-auto flex justify-center items-center"
                          >
                            <div className="w-full">
                              <Script
                                async
                                src="https://js.stripe.com/v3/buy-button.js"
                                onLoad={() => setIsScriptLoaded(true)}
                              />
                              <stripe-buy-button
                                buy-button-id="buy_btn_1QqeY12NiV0jYzFEMWYyW4s2"
                                publishable-key="pk_test_51QphF52NiV0jYzFE0YxJzAByfc0UeGklXELwxXCAZxf70ogDm7r4XMm80Huv6hnXf5kFxVX6JaLJ88MuBNabizPu008gvgvoQF"
                              />
                            </div>
                          </div>
                        )}
                        {showStripeButton10 && (
                          <div
                            ref={stripeBuyButtonRef}
                            className="w-full max-w-md mx-auto flex justify-center items-center"
                          >
                            <div className="w-full">
                              <Script
                                async
                                src="https://js.stripe.com/v3/buy-button.js"
                                onLoad={() => setIsScriptLoaded(true)}
                              />
                              <stripe-buy-button
                                buy-button-id="buy_btn_1QqgLl2NiV0jYzFEytF8xn0G"
                                publishable-key="pk_test_51QphF52NiV0jYzFE0YxJzAByfc0UeGklXELwxXCAZxf70ogDm7r4XMm80Huv6hnXf5kFxVX6JaLJ88MuBNabizPu008gvgvoQF"
                              />
                            </div>
                          </div>
                        )}
                        {showStripeButton15 && (
                          <div
                            ref={stripeBuyButtonRef}
                            className="w-full max-w-md mx-auto flex justify-center items-center"
                          >
                            <div className="w-full">
                              <Script
                                async
                                src="https://js.stripe.com/v3/buy-button.js"
                                onLoad={() => setIsScriptLoaded(true)}
                              />
                              <stripe-buy-button
                                buy-button-id="buy_btn_1Qqh982NiV0jYzFEGVsSRt5Z"
                                publishable-key="pk_test_51QphF52NiV0jYzFE0YxJzAByfc0UeGklXELwxXCAZxf70ogDm7r4XMm80Huv6hnXf5kFxVX6JaLJ88MuBNabizPu008gvgvoQF"
                              />
                            </div>
                          </div>
                        )}
                        {showStripeButton20 && (
                          <div
                            ref={stripeBuyButtonRef}
                            className="w-full max-w-md mx-auto flex justify-center items-center"
                          >
                            <div className="w-full">
                              <Script
                                async
                                src="https://js.stripe.com/v3/buy-button.js"
                                onLoad={() => setIsScriptLoaded(true)}
                              />
                              <stripe-buy-button
                                buy-button-id="buy_btn_1Qqhyh2NiV0jYzFEnMB2Uo3B"
                                publishable-key="pk_test_51QphF52NiV0jYzFE0YxJzAByfc0UeGklXELwxXCAZxf70ogDm7r4XMm80Huv6hnXf5kFxVX6JaLJ88MuBNabizPu008gvgvoQF"
                              />
                            </div>
                          </div>
                        )}
                        {showStripeButton25 && (
                          <div
                            ref={stripeBuyButtonRef}
                            className="w-full max-w-md mx-auto flex justify-center items-center"
                          >
                            <div className="w-full">
                              <Script
                                async
                                src="https://js.stripe.com/v3/buy-button.js"
                                onLoad={() => setIsScriptLoaded(true)}
                              />
                              <stripe-buy-button
                                buy-button-id="buy_btn_1Qqi7t2NiV0jYzFEKnx761hZ"
                                publishable-key="pk_test_51QphF52NiV0jYzFE0YxJzAByfc0UeGklXELwxXCAZxf70ogDm7r4XMm80Huv6hnXf5kFxVX6JaLJ88MuBNabizPu008gvgvoQF"
                              />
                            </div>
                          </div>
                        )}
                        {showStripeButton50 && (
                          <div
                            ref={stripeBuyButtonRef}
                            className="w-full max-w-md mx-auto flex justify-center items-center"
                          >
                            <div className="w-full">
                              <Script
                                async
                                src="https://js.stripe.com/v3/buy-button.js"
                                onLoad={() => setIsScriptLoaded(true)}
                              />
                              <stripe-buy-button
                                buy-button-id="buy_btn_1QqiMd2NiV0jYzFExXJg0DwZ"
                                publishable-key="pk_test_51QphF52NiV0jYzFE0YxJzAByfc0UeGklXELwxXCAZxf70ogDm7r4XMm80Huv6hnXf5kFxVX6JaLJ88MuBNabizPu008gvgvoQF"
                              />
                            </div>
                          </div>
                        )}
                        {showStripeButton100 && (
                          <div
                            ref={stripeBuyButtonRef}
                            className="w-full max-w-md mx-auto flex justify-center items-center"
                          >
                            <div className="w-full">
                              <Script
                                async
                                src="https://js.stripe.com/v3/buy-button.js"
                                onLoad={() => setIsScriptLoaded(true)}
                              />
                              <stripe-buy-button
                                buy-button-id="buy_btn_1QqiXi2NiV0jYzFEuoFm4L9e"
                                publishable-key="pk_test_51QphF52NiV0jYzFE0YxJzAByfc0UeGklXELwxXCAZxf70ogDm7r4XMm80Huv6hnXf5kFxVX6JaLJ88MuBNabizPu008gvgvoQF"
                              />
                            </div>
                          </div>
                        )}
                        <div>
                          <GiftPackages />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="recent">
                    <ScrollArea className="h-[300px]">
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-2 border-b border-[#038E7D]/10 last:border-b-0"
                        >
                          <div>
                            <p className="font-semibold text-[#038E7D]">{activity.recipient}</p>
                            <p className="text-sm text-[#025E52]">{activity.phoneNumber}</p>
                            <p className="text-xs text-[#025E52]/70">
                              ${activity.amount.toFixed(2)} - {activity.carrier} -{" "}
                              {new Date(activity.date).toLocaleString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[#038E7D] hover:bg-[#038E7D] hover:textwhite bg-transparent"
                            onClick={() => handleRepeat(activity)}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Repeat
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
      <SendGiftDialog
        isOpen={isGiftDialogOpen}
        onClose={() => setIsGiftDialogOpen(false)}
        gift={selectedGift}
        contacts={contacts}
        selectedContacts={selectedContacts}
      />
      <style jsx global>{`
      stripe-buy-button {
        display: block;
        width: 100%;
        margin-bottom: 1rem;
      }
    `}</style>
    </>
  )
}
