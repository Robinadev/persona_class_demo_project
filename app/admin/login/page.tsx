"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically make an API call to verify credentials
    if (username === "admin" && password === "password") {
      // For demonstration purposes only. In a real app, use proper authentication
      router.push("/admin/dashboard")
    } else {
      alert("Invalid credentials")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0ffff]">
      <Card className="w-[400px] bg-white shadow-md">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-normal text-center text-[#038E7D] mb-6">Admin Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-600">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-gray-200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-600">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-gray-200"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#038E7D] hover:bg-[#027165] text-white font-normal h-11">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
