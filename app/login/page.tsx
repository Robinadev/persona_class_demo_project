"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SITE_NAME } from "@/lib/constants"

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const router = useRouter()

  const handleSendVerification = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the verification code
    console.log("Sending verification to:", phoneNumber)
    setIsVerificationSent(true)
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically verify the code and log in the user
    console.log("Verifying code:", verificationCode)
    router.push("/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
      <Card className="w-[350px] bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-[#038E7D]">Login</CardTitle>
        </CardHeader>
        <CardContent>
          {!isVerificationSent ? (
            <form onSubmit={handleSendVerification}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button className="w-full mt-6 bg-[#038E7D] hover:bg-[#025E52] text-white" type="submit">
                Send Verification Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button className="w-full mt-6 bg-[#038E7D] hover:bg-[#025E52] text-white" type="submit">
                Log In
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#038E7D] hover:text-[#025E52] hover:underline">
              Create Account
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            If you haven't received a verification code,{" "}
            <Link href="/request-code" className="text-[#038E7D] hover:text-[#025E52] hover:underline">
              request a new one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
