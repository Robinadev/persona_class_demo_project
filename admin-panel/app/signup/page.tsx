"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/auth-service"
import { toast } from "sonner"
import { Lock, Mail, ArrowRight, Shield, Users, Headphones } from "lucide-react"

type AccountType = "admin" | "super_admin" | "support"

interface SignUpFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  accountType: AccountType
}

export default function SignupPage() {
  const [step, setStep] = useState<"type" | "form">("type")
  const [formData, setFormData] = useState<SignUpFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "admin",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const selectAccountType = (type: AccountType) => {
    setFormData({ ...formData, accountType: type })
    setStep("form")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate inputs
      if (!formData.fullName.trim()) {
        toast.error("Full name is required")
        return
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match")
        return
      }

      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters")
        return
      }

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      if (data.user) {
        // Create profile in database
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([
            {
              id: data.user.id,
              email: formData.email,
              full_name: formData.fullName,
              role: formData.accountType,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])

        if (profileError) throw profileError

        toast.success("Account created successfully! Please log in.")
        router.push("/login")
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      toast.error(error.message || "Signup failed")
    } finally {
      setIsLoading(false)
    }
  }

  const accountTypes = [
    {
      type: "super_admin" as AccountType,
      title: "Super Admin",
      description: "Full platform control with all permissions",
      icon: Shield,
      color: "from-red-600 to-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      type: "admin" as AccountType,
      title: "Admin",
      description: "Manage users, transactions, and analytics",
      icon: Users,
      color: "from-blue-600 to-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      type: "support" as AccountType,
      title: "Support Staff",
      description: "Handle user support and inquiries",
      icon: Headphones,
      color: "from-green-600 to-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {step === "type" ? (
          // Account Type Selection
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full opacity-20 blur-xl" />
                <div className="relative bg-white rounded-full flex items-center justify-center border-4 border-teal-100 shadow-lg">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Talarite%20new%20logo-02-LqLwTaQj77YS1jGv22EJZL2OuBuXAB.png"
                    alt="Talaritel"
                    width={80}
                    height={80}
                    className="object-contain p-2"
                  />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Admin Account</h1>
              <p className="text-gray-600">Select your account type to get started</p>
            </div>

            {/* Account Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {accountTypes.map(({ type, title, description, icon: Icon, color, bgColor, borderColor }) => (
                <button
                  key={type}
                  onClick={() => selectAccountType(type)}
                  className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${bgColor} ${borderColor} group`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-3 bg-gradient-to-br ${color} rounded-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition" />
                  </div>
                </button>
              ))}
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        ) : (
          // Sign Up Form
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                <p className="text-gray-600 mt-1">
                  Role: <span className="font-semibold text-teal-600">{formData.accountType.replace("_", " ").toUpperCase()}</span>
                </p>
              </div>
              <button
                onClick={() => setStep("type")}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@talaritel.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 rounded-lg transition"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
