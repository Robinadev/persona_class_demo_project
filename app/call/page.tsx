"use client"

import { useState, useEffect, useCallback, Fragment } from "react"
import { Phone, ArrowLeft, Mic, VolumeX, User, UserPlus } from "lucide-react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { PaymentForm } from "@/components/payment-form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSearchParams } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

const mockUserId = "USR12345"

type Contact = {
  id: string
  name: string
  phoneNumber: string
  avatarUrl?: string
}

type RecentActivity = {
  id: string
  type: "incoming" | "outgoing" | "missed"
  name: string
  phoneNumber: string
  date: string | Date
}

type Activity = {
  id: number
  type: string
  description: string
  amount: number
  duration: string
  date: Date
  phoneNumber: string
}

const initialContacts: Contact[] = [
  { id: "1", name: "John Doe", phoneNumber: "+251912345678", avatarUrl: "/placeholder.svg?height=100&width=100" },
  { id: "2", name: "Jane Smith", phoneNumber: "+251987654321", avatarUrl: "/placeholder.svg?height=100&width=100" },
  { id: "3", name: "Alice Johnson", phoneNumber: "+251123456789", avatarUrl: "/placeholder.svg?height=100&width=100" },
]

const initialRecentActivities: RecentActivity[] = [
  { id: "1", type: "outgoing", name: "John Doe", phoneNumber: "+251912345678", date: "2023-10-28 10:00" },
  { id: "2", type: "incoming", name: "Jane Smith", phoneNumber: "+251987654321", date: "2023-10-27 15:30" },
  { id: "3", type: "missed", name: "Unknown", phoneNumber: "+251123456789", date: "2023-10-26 09:15" },
]

export default function CallPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isCalling, setIsCalling] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [accountBalance, setAccountBalance] = useState(0)
  const [autoRechargeEnabled, setAutoRechargeEnabled] = useState(false)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(initialRecentActivities)
  const [searchTerm, setSearchTerm] = useState("")
  const [newContactName, setNewContactName] = useState("")
  const [showAddContactDialog, setShowAddContactDialog] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [activeTab, setActiveTab] = useState("dialpad")
  const [planMinutes, setPlanMinutes] = useState(180)
  const [callingMinutes, setCallingMinutes] = useState(0)
  const searchParams = useSearchParams()

  useEffect(() => {
    const numberFromQuery = searchParams.get("number")
    if (numberFromQuery) {
      setPhoneNumber(numberFromQuery)
      const contact = contacts.find((c) => c.phoneNumber === numberFromQuery)
      if (contact) {
        setSelectedContact(contact)
      }
    }
    setAutoRechargeEnabled(true)
    const storedBalance = localStorage.getItem("accountBalance")
    const storedMinutes = localStorage.getItem("callingMinutes")
    if (storedBalance) setAccountBalance(Number.parseFloat(storedBalance))
    if (storedMinutes) setCallingMinutes(Number.parseInt(storedMinutes, 10))
  }, [searchParams, contacts])

  useEffect(() => {
    // Load stored values
    const storedPlanMinutes = localStorage.getItem("planMinutes")
    const storedAccountBalance = localStorage.getItem("accountBalance")
    if (storedPlanMinutes) setPlanMinutes(Number.parseFloat(storedPlanMinutes))
    if (storedAccountBalance) setAccountBalance(Number.parseFloat(storedAccountBalance))

    let timer: NodeJS.Timeout
    if (isCalling) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1)
        if (planMinutes > 0) {
          setPlanMinutes((prev) => {
            const updated = Math.max(prev - 1 / 60, 0)
            localStorage.setItem("planMinutes", updated.toString())
            return updated
          })
        } else {
          setAccountBalance((prev) => {
            const updated = Math.max(prev - 0.01 / 60, 0)
            localStorage.setItem("accountBalance", updated.toString())
            if (updated <= 0.5 && autoRechargeEnabled) {
              handleAutoRecharge()
            }
            return updated
          })
        }
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isCalling, autoRechargeEnabled, planMinutes])

  const handleNumberClick = (digit: string) => {
    setPhoneNumber((prev) => {
      if (digit === "+" && prev.length === 0) {
        return "+"
      }
      return prev + digit
    })
    setSelectedContact(null)
  }

  const handleDelete = () => {
    setPhoneNumber((prev) => prev.slice(0, -1))
    setSelectedContact(null)
  }

  const handleCall = useCallback(
    (duration: number) => {
      const minutesUsed = Math.ceil(duration / 60)
      if (callingMinutes >= minutesUsed) {
        setCallingMinutes((prev) => {
          const newMinutes = prev - minutesUsed
          localStorage.setItem("callingMinutes", newMinutes.toString())
          return newMinutes
        })
        // Log activity for using plan minutes
      } else {
        const planMinutesUsed = callingMinutes
        const accountMinutesUsed = minutesUsed - callingMinutes
        setCallingMinutes(0)
        localStorage.setItem("callingMinutes", "0")
        const callCost = accountMinutesUsed * 0.1 // Assuming $0.1 per minute
        setAccountBalance((prev) => {
          const newBalance = Math.max(prev - callCost, 0)
          localStorage.setItem("accountBalance", newBalance.toString())
          return newBalance
        })
        // Log activity for using both plan minutes and account balance
      }
      // Add logic to log the call activity
    },
    [callingMinutes, setCallingMinutes, setAccountBalance],
  )

  const handleCallOld = () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number or select a contact to call",
        variant: "destructive",
      })
      return
    }

    if (planMinutes === 0 && accountBalance < 0.01) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough minutes or credit to make a call.",
        variant: "destructive",
      })
      return
    }

    setIsCalling(true)
    setCallDuration(0)
    if (!selectedContact) {
      setSelectedContact({
        id: Date.now().toString(),
        name: "Unknown",
        phoneNumber: phoneNumber,
      })
    }
    addRecentActivity("outgoing", phoneNumber) // Add recent activity on call initiation
  }

  const handleAutoRecharge = () => {
    setShowPaymentForm(true)
  }

  const handlePaymentComplete = () => {
    setAccountBalance((prev) => prev + 5)
    setShowPaymentForm(false)
    toast({
      title: "Auto-recharge Successful",
      description: "Your account has been recharged with $5.",
    })
  }

  const handlePaymentCancel = () => {
    setShowPaymentForm(false)
    handleEndCall()
  }

  const redirectToRecentActivities = () => {
    const recentTab = document.querySelector('[data-state="inactive"][value="recent"]') as HTMLButtonElement | null
    if (recentTab) {
      recentTab.click()
    }
  }

  const addActivity = (newActivity: Activity) => {
    // Update localStorage
    const storedActivities = JSON.parse(localStorage.getItem("recentActivities") || "[]")
    const updatedActivities = [newActivity, ...storedActivities].slice(0, 100) // Keep only the last 100 activities
    localStorage.setItem("recentActivities", JSON.stringify(updatedActivities))

    // Update local state
    setRecentActivities((prevActivities) => [newActivity, ...prevActivities])
  }

  const handleEndCall = () => {
    setIsCalling(false)
    if (selectedContact) {
      handleCall(callDuration)
      const newActivity: Activity = {
        id: Date.now(),
        type: "Call",
        description: `Call to ${selectedContact.name}`,
        amount: -(callDuration / 60) * 0.1, // Assuming $0.1 per minute
        duration: formatDuration(callDuration),
        date: new Date(),
        phoneNumber: selectedContact.phoneNumber,
      }
      addActivity(newActivity)
      toast({
        title: "Call Ended",
        description: `Call to ${selectedContact.name} has ended. Duration: ${formatDuration(callDuration)}`,
      })
    }
    setCallDuration(0)
    setActiveTab("recent")
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.phoneNumber.includes(searchTerm),
  )

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact)
    setPhoneNumber(contact.phoneNumber)
  }

  const addRecentActivity = (type: "incoming" | "outgoing" | "missed", phoneNumber: string) => {
    const contact = contacts.find((c) => c.phoneNumber === phoneNumber)
    const newActivity: RecentActivity = {
      id: Date.now().toString(),
      type,
      name: contact ? contact.name : "Unknown",
      phoneNumber,
      date: new Date().toLocaleString(),
    }
    setRecentActivities((prev) => [newActivity, ...prev.slice(0, 9)])
  }

  const handleRedial = (phoneNumber: string) => {
    const contact = contacts.find((c) => c.phoneNumber === phoneNumber)
    if (contact) {
      setSelectedContact(contact)
      setPhoneNumber(contact.phoneNumber)
    } else {
      setSelectedContact(null)
      setPhoneNumber(phoneNumber)
    }
  }

  const handleAddContact = () => {
    if (newContactName && phoneNumber) {
      const newContact: Contact = {
        id: Date.now().toString(),
        name: newContactName,
        phoneNumber: phoneNumber,
      }
      setContacts((prev) => [...prev, newContact])
      setSelectedContact(newContact)
      setNewContactName("")
      setShowAddContactDialog(false)
      toast({
        title: "Contact Added",
        description: `${newContactName} has been added to your contacts.`,
      })
    }
  }

  const isNumberInContacts = contacts.some((contact) => contact.phoneNumber === phoneNumber)

  const dialPadNumbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["+", "0", "#"],
  ]

  return (
    <Layout userId={mockUserId} userName="User">
      <div className="container max-w-md mx-auto py-8">
        <Card className="border-[#038E7D]/10 bg-[#F0FFF9]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-[#038E7D]">
              {isCalling ? "Ongoing Call" : "Call"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showPaymentForm ? (
              <PaymentForm amount={5} onPaymentComplete={handlePaymentComplete} onCancel={handlePaymentCancel} />
            ) : isCalling ? (
              <div className="text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4">
                  {selectedContact?.avatarUrl ? (
                    <AvatarImage src={selectedContact.avatarUrl} alt={selectedContact.name} />
                  ) : (
                    <AvatarFallback>
                      <User className="w-16 h-16 text-[#038E7D]" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <h2 className="text-2xl font-bold text-[#038E7D] mb-2">{selectedContact?.name}</h2>
                <p className="text-[#025E52] mb-4">{selectedContact?.phoneNumber}</p>
                <p className="text-xl font-semibold text-[#038E7D] mb-8">{formatDuration(callDuration)}</p>
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-12 h-12"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </Button>
                  <Button variant="destructive" size="icon" className="rounded-full w-12 h-12" onClick={handleEndCall}>
                    <Phone className="h-6 w-6 rotate-135" />
                  </Button>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-[#025E52]">Remaining Plan Minutes</p>
                  <p className="text-lg font-semibold text-[#038E7D]">{planMinutes.toFixed(2)}</p>
                  <p className="text-sm font-medium text-[#025E52] mt-2">Remaining Credit Balance</p>
                  <p className="text-lg font-semibold text-[#038E7D]">${accountBalance.toFixed(2)}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm font-medium text-[#025E52]">Calling Plan</p>
                  <p className="text-xl font-bold text-[#038E7D]">{planMinutes.toFixed(2)} minutes</p>
                  <p className="text-sm font-medium text-[#025E52] mt-2">Account Balance</p>
                  <p className="text-xl font-bold text-[#038E7D]">${accountBalance.toFixed(2)}</p>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full text-[#038E7D]">
                  <TabsList className="grid w-full grid-cols-3 bg-[#E0FFF5] mb-4">
                    <TabsTrigger
                      value="dialpad"
                      className="data-[state=active]:bg-[#038E7D] data-[state=active]:text-white"
                    >
                      Dial Pad
                    </TabsTrigger>
                    <TabsTrigger
                      value="contacts"
                      className="data-[state=active]:bg-[#038E7D] data-[state=active]:text-white"
                    >
                      Contacts
                    </TabsTrigger>
                    <TabsTrigger
                      value="recent"
                      className="data-[state=active]:bg-[#038E7D] data-[state=active]:text-white"
                    >
                      Recent
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="dialpad">
                    <div className="flex items-center mb-4">
                      <Input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value)
                          setSelectedContact(null)
                        }}
                        className="text-2xl text-center border-[#038E7D] flex-grow h-16 font-bold placeholder:font-normal"
                        placeholder="Enter phone number"
                      />
                      {phoneNumber && !isNumberInContacts && (
                        <Dialog open={showAddContactDialog} onOpenChange={setShowAddContactDialog}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="ml-2">
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Add New Contact</DialogTitle>
                              <DialogDescription>
                                Enter a name for this contact. Click save when you're done.
                              </DialogDescription>
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
                                <Input id="phone" value={phoneNumber} className="col-span-3" disabled />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleAddContact}>Save Contact</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {dialPadNumbers.map((row, rowIndex) => (
                        <Fragment key={rowIndex}>
                          {row.map((number) => (
                            <Button
                              key={number}
                              onClick={() => handleNumberClick(number)}
                              variant="outline"
                              className="text-3xl font-bold h-20 hover:bg-[#038E7D] hover:text-white border-[#038E7D] text-[#038E7D]"
                            >
                              {number}
                            </Button>
                          ))}
                        </Fragment>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="contacts">
                    <Input
                      placeholder="Search contacts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-4 border-[#038E7D]/20"
                    />
                    <ScrollArea className="h-[300px]">
                      {filteredContacts.map((contact) => (
                        <div
                          key={contact.id}
                          className={`flex items-center justify-between p-2 cursor-pointer ${
                            selectedContact?.id === contact.id ? "bg-[#038E7D]/20" : "hover:bg-[#038E7D]/10"
                          }`}
                          onClick={() => handleSelectContact(contact)}
                        >
                          <div className="flex items-center">
                            <Avatar className="w-10 h-10 mr-3">
                              {contact.avatarUrl ? (
                                <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                              ) : (
                                <AvatarFallback>
                                  <User className="w-6 h-6 text-[#038E7D]" />
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <p className="font-semibold text-[#038E7D]">{contact.name}</p>
                              <p className="text-sm text-[#025E52]">{contact.phoneNumber}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-[#038E7D]">
                            Select
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="recent">
                    <ScrollArea className="h-[300px]">
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-2 border-b border-[#038E7D]/10 last:border-b-0"
                        >
                          <div>
                            <p className="font-semibold text-[#038E7D]">{activity.name}</p>
                            <p className="text-sm text-[#025E52]">{activity.phoneNumber}</p>
                            <p className="text-xs text-[#025E52]/70">
                              {typeof activity.date === "string"
                                ? activity.date
                                : format(new Date(activity.date), "PPpp")}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#038E7D]"
                            onClick={() => handleRedial(activity.phoneNumber)}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {isCalling ? (
              <Button onClick={handleEndCall} className="w-full bg-red-500 hover:bg-red-600 text-white" size="lg">
                End Call
              </Button>
            ) : (
              <>
                <Button onClick={handleDelete} variant="outline" className="flex-1 mr-2 h-16 text-lg">
                  <ArrowLeft className="w-6 h-6 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleCallOld}
                  className="flex-1 ml-2 bg-[#038E7D] hover:bg-[#025E52] text-white h-16 text-lg"
                  disabled={!phoneNumber}
                >
                  <Phone className="w-6 h-6 mr-2" />
                  Call
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  )
}
