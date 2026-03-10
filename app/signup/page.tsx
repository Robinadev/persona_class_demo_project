"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { validateAndNormalizePhone, maskPhone } from "@/lib/phone-utils"

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [expiresIn, setExpiresIn] = useState(0)
  const router = useRouter()

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!acceptedTerms) {
      setError("Please accept the Terms and Conditions to continue.")
      return
    }

    if (!firstName || !lastName || !email || !phoneNumber) {
      setError("All fields are required.")
      return
    }

    setIsLoading(true)

    try {
      const normalized = validateAndNormalizePhone(phoneNumber)
      if (!normalized) {
        setError("Invalid phone number format. Please use a valid USA number.")
        setIsLoading(false)
        return
      }

      // Send OTP to phone
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: normalized })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to send verification code")
        setIsLoading(false)
        return
      }

      setExpiresIn(data.expiresIn || 600)
      setStep(2)
      toast.success("Verification code sent to " + maskPhone(normalized))
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("Send OTP error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const normalized = validateAndNormalizePhone(phoneNumber)
      if (!normalized) {
        setError("Invalid phone number")
        setIsLoading(false)
        return
      }

      // Verify OTP
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: normalized,
          code: verificationCode
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Invalid or expired verification code")
        setIsLoading(false)
        return
      }

      setStep(3)
      toast.success("Phone number verified!")
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("Verify OTP error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmAndContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const normalized = validateAndNormalizePhone(phoneNumber)
      if (!normalized) {
        setError("Invalid phone number")
        setIsLoading(false)
        return
      }

      // Create user account
      const response = await fetch("/api/auth/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber: normalized,
          verificationCode
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create account")
        setIsLoading(false)
        return
      }

      // Store token and user info
      localStorage.setItem("auth_token", data.token)
      localStorage.setItem("user_id", data.userId)
      localStorage.setItem("phone_number", data.phoneNumber)

      toast.success("Account created successfully!")
      router.push("/")
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("Create account error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setError("")
    setIsLoading(true)

    try {
      const normalized = validateAndNormalizePhone(phoneNumber)
      if (!normalized) {
        setError("Invalid phone number")
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: normalized })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to resend code")
        setIsLoading(false)
        return
      }

      setVerificationCode("")
      setExpiresIn(data.expiresIn || 600)
      toast.success("New code sent!")
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("Resend OTP error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoBack = () => {
    setStep((prevStep) => prevStep - 1)
    setError("")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-[400px] bg-white/90 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">
            {step === 1 ? "Create Account" : step === 2 ? "Verify Phone Number" : "Confirm Account"}
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground mt-2">
            {step === 1 && "Sign up for Talari to get started"}
            {step === 2 && "Enter the code sent to your phone"}
            {step === 3 && "Review your information before creating account"}
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}
          
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567 or 5551234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <p className="text-xs text-muted-foreground">USA numbers only</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    I accept the{" "}
                    <Link href="/legal" className="text-primary hover:text-accent hover:underline font-medium">
                      Terms and Conditions
                    </Link>
                  </Label>
                </div>
              </div>
              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
          )}
          
          {step === 2 && (
            <form onSubmit={handleVerifyCode}>
              <div className="grid w-full items-center gap-4">
                <p className="text-center text-sm text-accent">
                  Code sent to {maskPhone(validateAndNormalizePhone(phoneNumber) || phoneNumber)}
                </p>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="code">6-Digit Code</Label>
                  <Input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    disabled={isLoading}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {expiresIn > 0 ? `Expires in ${Math.ceil(expiresIn / 60)} minutes` : "Code expired"}
                  </p>
                </div>
              </div>
              <div className="flex justify-between gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGoBack} 
                  disabled={isLoading}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading || verificationCode.length !== 6}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="w-full mt-3 text-primary hover:bg-primary/10"
                onClick={handleResendCode}
                disabled={isLoading}
              >
                Resend Code
              </Button>
            </form>
          )}
          
          {step === 3 && (
            <form onSubmit={handleConfirmAndContinue}>
              <div className="bg-primary/5 rounded-lg p-4 space-y-3 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium text-foreground">{firstName} {lastName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">{maskPhone(validateAndNormalizePhone(phoneNumber) || phoneNumber)}</p>
                </div>
              </div>
              <div className="flex justify-between gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGoBack}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-accent hover:underline font-medium">
              Log In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
