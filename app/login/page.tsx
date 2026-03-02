"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SITE_NAME } from "@/lib/constants"
import { validateAndNormalizePhone, maskPhone } from "@/lib/phone-utils"
import { toast } from "sonner"

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [expiresIn, setExpiresIn] = useState(0)
  const router = useRouter()

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const normalized = validateAndNormalizePhone(phoneNumber)
      if (!normalized) {
        setError("Invalid phone number format. Please use a valid USA number.")
        setIsLoading(false)
        return
      }

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

      setIsVerificationSent(true)
      setExpiresIn(data.expiresIn || 600)
      toast.success("Verification code sent to " + maskPhone(normalized))
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("Send OTP error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
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
        setError(data.error || "Failed to verify code")
        setIsLoading(false)
        return
      }

      // Store token and user info
      localStorage.setItem("auth_token", data.token)
      localStorage.setItem("user_id", data.userId)
      localStorage.setItem("phone_number", data.phoneNumber)

      toast.success("Login successful!")
      router.push("/")
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("Verify OTP error:", err)
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

      toast.success("New code sent to " + maskPhone(normalized))
      setVerificationCode("")
      setExpiresIn(data.expiresIn || 600)
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("Resend OTP error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-[400px] bg-white/90 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">Login</CardTitle>
          <p className="text-center text-sm text-muted-foreground mt-2">International Phone Verification</p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          )}

          {!isVerificationSent ? (
            <form onSubmit={handleSendVerification}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567 or 5551234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">USA numbers only</p>
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
          ) : (
            <form onSubmit={handleVerify}>
              <div className="grid w-full items-center gap-4">
                <p className="text-sm text-accent">
                  Verification code sent to {maskPhone(validateAndNormalizePhone(phoneNumber) || phoneNumber)}
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
                    required
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    {expiresIn > 0 ? `Expires in ${Math.ceil(expiresIn / 60)} minutes` : "Code expired"}
                  </p>
                </div>
              </div>
              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground" 
                type="submit"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? "Verifying..." : "Log In"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={handleResendCode}
                disabled={isLoading}
              >
                Resend Code
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:text-accent hover:underline font-medium">
              Create Account
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            If you haven't received a verification code,{" "}
            <Link href="/request-code" className="text-primary hover:text-accent hover:underline font-medium">
              request a new one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
