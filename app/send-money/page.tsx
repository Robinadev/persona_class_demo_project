"use client"

import { useState, useEffect, useCallback, useMemo, useReducer, useRef } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, RotateCcw, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Contact = {
  id: string
  name: string
  phoneNumber: string
}

type RecentActivity = {
  id: string
  type: string
  recipient: string
  phoneNumber: string
  amount: number
  date: string
  walletCompany: string
}

type State = {
  contacts: Contact[]
  recentActivities: RecentActivity[]
  recipient: string
  amount: string
  phone: string
  walletCompany: string
  searchTerm: string
  newContactName: string
  newContactPhone: string
  isAddContactDialogOpen: boolean
}

type Action =
  | { type: "SET_CONTACTS"; payload: Contact[] }
  | { type: "SET_RECENT_ACTIVITIES"; payload: RecentActivity[] }
  | { type: "SET_RECIPIENT"; payload: string }
  | { type: "SET_AMOUNT"; payload: string }
  | { type: "SET_PHONE"; payload: string }
  | { type: "SET_WALLET_COMPANY"; payload: string }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_NEW_CONTACT_NAME"; payload: string }
  | { type: "SET_NEW_CONTACT_PHONE"; payload: string }
  | { type: "SET_ADD_CONTACT_DIALOG_OPEN"; payload: boolean }
  | { type: "ADD_CONTACT"; payload: Contact }
  | { type: "ADD_RECENT_ACTIVITY"; payload: RecentActivity }

const initialState: State = {
  contacts: [],
  recentActivities: [],
  recipient: "",
  amount: "",
  phone: "",
  walletCompany: "",
  searchTerm: "",
  newContactName: "",
  newContactPhone: "",
  isAddContactDialogOpen: false,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_CONTACTS":
      return { ...state, contacts: action.payload }
    case "SET_RECENT_ACTIVITIES":
      return { ...state, recentActivities: action.payload }
    case "SET_RECIPIENT":
      return { ...state, recipient: action.payload }
    case "SET_AMOUNT":
      return { ...state, amount: action.payload }
    case "SET_PHONE":
      return { ...state, phone: action.payload }
    case "SET_WALLET_COMPANY":
      return { ...state, walletCompany: action.payload }
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload }
    case "SET_NEW_CONTACT_NAME":
      return { ...state, newContactName: action.payload }
    case "SET_NEW_CONTACT_PHONE":
      return { ...state, newContactPhone: action.payload }
    case "SET_ADD_CONTACT_DIALOG_OPEN":
      return { ...state, isAddContactDialogOpen: action.payload }
    case "ADD_CONTACT":
      return { ...state, contacts: [...state.contacts, action.payload] }
    case "ADD_RECENT_ACTIVITY":
      return { ...state, recentActivities: [action.payload, ...state.recentActivities] }
    default:
      return state
  }
}

const walletCompanies = [
  { value: "telebirr", label: "TeleBirr" },
  { value: "hellocash", label: "HelloCash" },
  { value: "cbebirr", label: "CBE Birr" },
  { value: "amolebirr", label: "Amole" },
]

const initialContacts: Contact[] = [
  { id: "1", name: "John Doe", phoneNumber: "+251912345678" },
  { id: "2", name: "Jane Smith", phoneNumber: "+251987654321" },
  { id: "3", name: "Alice Johnson", phoneNumber: "+251123456789" },
  { id: "4", name: "Bob Williams", phoneNumber: "+251198765432" },
  { id: "5", name: "Eva Brown", phoneNumber: "+251187654321" },
]

export default function SendMoneyPage() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      const loadInitialData = () => {
        const storedContacts = localStorage.getItem("contacts")
        const storedActivities = localStorage.getItem("recentActivities")

        if (storedContacts) {
          dispatch({ type: "SET_CONTACTS", payload: JSON.parse(storedContacts) })
        } else {
          localStorage.setItem("contacts", JSON.stringify(initialContacts))
          dispatch({ type: "SET_CONTACTS", payload: initialContacts })
        }

        if (storedActivities) {
          dispatch({ type: "SET_RECENT_ACTIVITIES", payload: JSON.parse(storedActivities) })
        }
      }

      loadInitialData()
      isInitialMount.current = false
    }

    const numberFromQuery = searchParams.get("number")
    if (numberFromQuery) {
      dispatch({ type: "SET_PHONE", payload: numberFromQuery })
      dispatch({ type: "SET_RECIPIENT", payload: "" })
    }
  }, [searchParams])

  useEffect(() => {
    console.log("State updated:", state)
  }, [state])

  const handleContinue = useCallback(async () => {
    if (!state.recipient || !state.amount || !state.phone || !state.walletCompany) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const amountValue = Number.parseFloat(state.amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      })
      return
    }
    if (amountValue < 5) {
      toast({
        title: "Invalid Amount",
        description: "The minimum amount to send is $5.",
        variant: "destructive",
      })
      return
    }

    if (!/^[79]\d{8}$/.test(state.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 9-digit phone number starting with 7 or 9.",
        variant: "destructive",
      })
      return
    }

    // Check if the user has sufficient balance
    const currentBalance = Number(localStorage.getItem("accountBalance") || "0")
    if (currentBalance < amountValue) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance to complete this transaction.",
        variant: "destructive",
      })
      return
    }

    // If all validations pass, redirect to the payment page
    const paymentUrl = `/payment?type=send-money&recipient=${encodeURIComponent(state.recipient)}&amount=${encodeURIComponent(
      amountValue.toFixed(2),
    )}&phone=${encodeURIComponent(state.phone)}&wallet=${encodeURIComponent(state.walletCompany)}`
    const successUrl = `/payment-success?type=send-money&amount=${amountValue}&recipient=${encodeURIComponent(
      state.recipient,
    )}&phoneNumber=${encodeURIComponent(state.phone)}`

    router.push(`${paymentUrl}&success_url=${encodeURIComponent(successUrl)}`)
    return // Add this line to prevent further execution
  }, [state, toast, router])

  const handleSelectContact = useCallback(
    (contact: Contact) => {
      setSelectedContacts([contact.id])
      const formattedPhone = contact.phoneNumber.replace(/^(\+251|0)/, "")
      dispatch({ type: "SET_PHONE", payload: formattedPhone })
      dispatch({ type: "SET_RECIPIENT", payload: contact.name })
      toast({
        title: "Contact Selected",
        description: `${contact.name} has been selected as the recipient.`,
      })
    },
    [toast],
  )

  const handleResend = useCallback(
    (activity: RecentActivity) => {
      dispatch({ type: "SET_RECIPIENT", payload: activity.recipient })
      dispatch({ type: "SET_PHONE", payload: activity.phoneNumber })
      dispatch({ type: "SET_AMOUNT", payload: activity.amount.toString() })
      dispatch({ type: "SET_WALLET_COMPANY", payload: activity.walletCompany })
      toast({
        title: "Transaction Loaded",
        description: `Previous transaction to ${activity.recipient} has been loaded.`,
      })
    },
    [toast],
  )

  const handleAddContact = useCallback(() => {
    if (state.newContactName && state.newContactPhone) {
      const newContact: Contact = {
        id: Date.now().toString(),
        name: state.newContactName,
        phoneNumber: state.newContactPhone,
      }
      dispatch({ type: "ADD_CONTACT", payload: newContact })
      const updatedContacts = [...state.contacts, newContact]
      localStorage.setItem("contacts", JSON.stringify(updatedContacts))
      dispatch({ type: "SET_NEW_CONTACT_NAME", payload: "" })
      dispatch({ type: "SET_NEW_CONTACT_PHONE", payload: "" })
      dispatch({ type: "SET_ADD_CONTACT_DIALOG_OPEN", payload: false })
      toast({
        title: "Contact Added",
        description: `${state.newContactName} has been added to your contacts.`,
      })
      handleSelectContact(newContact)
    }
  }, [state.newContactName, state.newContactPhone, state.contacts, handleSelectContact, toast])

  const filteredContacts = useMemo(() => {
    return state.contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        contact.phoneNumber.includes(state.searchTerm),
    )
  }, [state.contacts, state.searchTerm])

  return (
    <Layout style={{ maxWidth: "calc(100% - 16px)", margin: "0 auto" }}>
      <div className="container-fluid px-2 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h1 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl text-[#038E7D]">Send Money</h1>
          <p className="max-w-[85%] leading-normal text-[#025E52] sm:text-lg sm:leading-7">
            Quickly and securely send money to your loved ones in Ethiopia
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-md">
          <Card className="border-[#038E7D]/10 bg-[#F0FFF9]">
            <CardHeader>
              <CardTitle className="text-[#038E7D]">Transfer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="form" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-[#E0FFF5] mb-4">
                  <TabsTrigger value="form" className="data-[state=active]:bg-[#038E7D] data-[state=active]:text-white">
                    Send Money
                  </TabsTrigger>
                  <TabsTrigger
                    value="recent"
                    className="data-[state=active]:bg-[#038E7D] data-[state=active]:text-white"
                  >
                    Recent Activities
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="form">
                  <Button
                    onClick={() => document.getElementById("contacts-section")?.scrollIntoView({ behavior: "smooth" })}
                    variant="outline"
                    className="w-full mb-4 border-[#038E7D] text-[#038E7D] hover:bg-[#038E7D] hover:text-white"
                  >
                    Select from Contacts
                  </Button>
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient's Name</Label>
                    <Input
                      id="recipient"
                      placeholder="Enter recipient's name"
                      className="border-[#038E7D]/20 bg-white text-[#038E7D]"
                      value={state.recipient}
                      onChange={(e) => dispatch({ type: "SET_RECIPIENT", payload: e.target.value })}
                      readOnly={selectedContacts.length > 0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (USD)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount (min $5)"
                      className="border-[#038E7D]/20 bg-white text-[#038E7D]"
                      value={state.amount}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === "" || (Number(value) >= 0 && !isNaN(Number(value)))) {
                          dispatch({ type: "SET_AMOUNT", payload: value })
                        }
                      }}
                      min="5"
                      step="0.01"
                      required
                    />
                    <p className="text-xs text-[#025E52]">Minimum amount: $5</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Recipient's Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+251 9XXXXXXXX"
                      className="border-[#038E7D]/20 bg-white text-[#038E7D]"
                      value={state.phone}
                      onChange={(e) => dispatch({ type: "SET_PHONE", payload: e.target.value })}
                      pattern="[79]\d{8}"
                      required
                      readOnly={selectedContacts.length > 0}
                    />
                    <p className="text-xs text-[#025E52]">Enter a 9-digit number starting with 7 or 9</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wallet-company">Receiver's Wallet Company</Label>
                    <Select
                      value={state.walletCompany}
                      onValueChange={(value) => dispatch({ type: "SET_WALLET_COMPANY", payload: value })}
                    >
                      <SelectTrigger id="wallet-company" className="border-[#038E7D]/20 bg-white text-[#038E7D]">
                        <SelectValue placeholder="Select wallet company" />
                      </SelectTrigger>
                      <SelectContent>
                        {walletCompanies.map((company) => (
                          <SelectItem key={company.value} value={company.value}>
                            {company.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full mt-4 bg-[#038E7D] hover:bg-[#025E52] text-white"
                    size="lg"
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
                </TabsContent>
                <TabsContent value="recent">
                  <ScrollArea className="h-[300px]">
                    {state.recentActivities
                      .filter((activity) => activity.type === "Send Money")
                      .map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-2 border-b border-[#038E7D]/10 last:border-b-0"
                        >
                          <div>
                            <p className="font-semibold text-[#038E7D]">{activity.recipient}</p>
                            <p className="text-sm text-[#025E52]">{activity.phoneNumber}</p>
                            <p className="text-xs text-[#025E52]/70">
                              ${activity.amount.toFixed(2)} - {activity.walletCompany} -{" "}
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
                            className="text-[#038E7D] hover:bg-[#038E7D] hover:text-white"
                            onClick={() => handleResend(activity)}
                          >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Resend
                          </Button>
                        </div>
                      ))}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="mt-8 border-[#038E7D]/10 bg-[#F0FFF9]" id="contacts-section">
            <CardHeader>
              <CardTitle className="text-[#038E7D] flex justify-between items-center">
                <span>Select from Contacts</span>
                <Dialog
                  open={state.isAddContactDialogOpen}
                  onOpenChange={(open) => dispatch({ type: "SET_ADD_CONTACT_DIALOG_OPEN", payload: open })}
                >
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
                          value={state.newContactName}
                          onChange={(e) => dispatch({ type: "SET_NEW_CONTACT_NAME", payload: e.target.value })}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          value={state.newContactPhone}
                          onChange={(e) => dispatch({ type: "SET_NEW_CONTACT_PHONE", payload: e.target.value })}
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
              <Input
                placeholder="Search contacts..."
                value={state.searchTerm}
                onChange={(e) => dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })}
                className="mb-4 border-[#038E7D]/20"
              />
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-[#038E7D] ${selectedContacts.includes(contact.id) ? "bg-[#038E7D]/10" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectContact(contact)
                      }}
                    >
                      {selectedContacts.includes(contact.id) ? "Selected" : "Select"}
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
