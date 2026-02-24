"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const router = useRouter()

  const handleSendVerification = (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptedTerms) {
      alert("Please accept the Terms and Conditions to continue.")
      return
    }
    // Here you would typically send the verification code via SMS
    console.log("Sending verification code via SMS to:", phoneNumber)
    setStep(2)
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically verify the code
    console.log("Verifying code:", verificationCode)
    setStep(3)
  }

  const handleConfirmAndContinue = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically confirm the account and proceed
    console.log("Confirming account and continuing for:", firstName, lastName, email, phoneNumber)
    router.push("/")
  }

  const handleGoBack = () => {
    setStep((prevStep) => prevStep - 1)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
      <Card className="w-[400px] bg-white/80 backdrop-blur-sm border-green-200">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-[#038E7D]">
            {step === 1 ? "Create Account" : step === 2 ? "Verify Phone Number" : "Confirm and Continue"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form onSubmit={handleSendVerification}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I accept the{" "}
                    <Link href="/legal" className="text-[#038E7D] hover:text-[#025E52] hover:underline">
                      Terms and Conditions
                    </Link>
                  </Label>
                </div>
              </div>
              <Button className="w-full mt-6 bg-[#038E7D] hover:bg-[#025E52] text-white" type="submit">
                Send Verification Code
              </Button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleVerifyCode}>
              <div className="grid w-full items-center gap-4">
                <p className="text-center text-sm text-[#025E52]">
                  We've sent a verification code to your phone number: {phoneNumber}
                </p>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter the 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button type="button" variant="outline" onClick={handleGoBack} className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="submit" className="bg-[#038E7D] hover:bg-[#025E52] text-white">
                  Verify Code
                </Button>
              </div>
              <p className="text-center mt-4 text-sm text-[#025E52]">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleSendVerification}
                  className="text-[#038E7D] hover:text-[#025E52] hover:underline"
                >
                  Resend
                </button>
              </p>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handleConfirmAndContinue}>
              <div className="text-center">
                <p className="mb-4 text-[#025E52]">Your account is ready to be created.</p>
                <p className="mb-2 text-[#038E7D]">
                  Name: {firstName} {lastName}
                </p>
                <p className="mb-2 text-[#038E7D]">Email: {email}</p>
                <p className="mb-4 text-[#038E7D]">Phone: {phoneNumber}</p>
              </div>
              <div className="flex justify-between mt-6">
                <Button type="button" variant="outline" onClick={handleGoBack} className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="submit" className="bg-[#038E7D] hover:bg-[#025E52] text-white">
                  Confirm and Continue
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-[#038E7D] hover:text-[#025E52] hover:underline">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
