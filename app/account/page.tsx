"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const mockUserId = "USR12345"

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState("John")
  const [lastName, setLastName] = useState("Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [phoneNumber, setPhoneNumber] = useState("+251912345678")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [autoRechargeEnabled, setAutoRechargeEnabled] = useState(false)
  const [accountHolderName, setAccountHolderName] = useState("John Doe")
  const { toast } = useToast()

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    })
    localStorage.setItem("accountHolderName", accountHolderName)
  }

  const handleToggleNotifications = (checked: boolean) => {
    setNotificationsEnabled(checked)
    toast({
      title: checked ? "Notifications Enabled" : "Notifications Disabled",
      description: checked
        ? "You will now receive notifications about your account."
        : "You will no longer receive notifications about your account.",
    })
  }

  const handleToggleAutoRecharge = (checked: boolean) => {
    setAutoRechargeEnabled(checked)
    toast({
      title: checked ? "Auto-recharge Enabled" : "Auto-recharge Disabled",
      description: checked
        ? "Your account will be automatically recharged when your balance is low."
        : "Auto-recharge has been disabled for your account.",
    })
  }

  useEffect(() => {
    const storedName = localStorage.getItem("accountHolderName")
    if (storedName) {
      setAccountHolderName(storedName)
    }
  }, [])

  return (
    <Layout userId={mockUserId} userName={accountHolderName || "User"}>
      <div className="container py-8 md:py-12 lg:py-24">
        <h1 className="text-3xl font-bold text-center text-[#038E7D] mb-8">Account Settings</h1>

        <Tabs defaultValue="profile" className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#038E7D]">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">Account Holder Name</Label>
                    <Input
                      id="accountHolderName"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      className="border-[#038E7D]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border-[#038E7D]/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="border-[#038E7D]/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-[#038E7D]/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="border-[#038E7D]/20"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#038E7D] hover:bg-[#025E52] text-white">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#038E7D]">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" className="border-[#038E7D]/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" className="border-[#038E7D]/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" className="border-[#038E7D]/20" />
                </div>
                <Button className="w-full bg-[#038E7D] hover:bg-[#025E52] text-white">Change Password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#038E7D]">Account Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email notifications about your account</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={handleToggleNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoRecharge">Auto-recharge</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically recharge your account when balance is low
                    </p>
                  </div>
                  <Switch id="autoRecharge" checked={autoRechargeEnabled} onCheckedChange={handleToggleAutoRecharge} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
