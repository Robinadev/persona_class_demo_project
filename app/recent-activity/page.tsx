"use client"

import { useState, useEffect, useMemo } from "react"
import { format } from "date-fns"
import { ArrowLeft, Phone, SendHorizontal, Wallet, Plus, Package, ArrowUpDown, Filter, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layout } from "@/components/layout"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Activity = {
  id: number
  type: "Call" | "Recharge" | "Top-Up" | "Send Money" | "Plan Purchase"
  description: string
  amount: number
  duration?: string
  date: Date
  recipient?: string
  phoneNumber?: string
  planName?: string
  minutes?: number
}

export default function RecentActivityPage() {
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activityFilter, setActivityFilter] = useState<Activity["type"] | "All">("All")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const router = useRouter()

  useEffect(() => {
    const loadStoredActivities = () => {
      const storedActivities = localStorage.getItem("recentActivities")
      if (storedActivities) {
        const parsedActivities = JSON.parse(storedActivities)
        if (Array.isArray(parsedActivities) && parsedActivities.length > 0) {
          setRecentActivities(
            parsedActivities
              .map((activity) => ({
                ...activity,
                date: new Date(activity.date),
              }))
              .filter((activity) => !isNaN(activity.date.getTime())),
          )
        }
      }
      setIsLoading(false)
    }

    loadStoredActivities()
  }, [])

  const filteredAndSortedActivities = useMemo(() => {
    let filtered = recentActivities
    if (activityFilter !== "All") {
      filtered = recentActivities.filter((activity) => activity.type === activityFilter)
    }
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })
  }, [recentActivities, activityFilter, sortOrder])

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "Call":
        return <Phone className="h-5 w-5 text-blue-500" />
      case "Recharge":
        return <Plus className="h-5 w-5 text-green-500" />
      case "Top-Up":
        return <Wallet className="h-5 w-5 text-purple-500" />
      case "Send Money":
        return <SendHorizontal className="h-5 w-5 text-orange-500" />
      case "Plan Purchase":
        return <Package className="h-5 w-5 text-pink-500" />
      default:
        return null
    }
  }

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "Call":
        return "text-blue-500"
      case "Recharge":
        return "text-green-500"
      case "Top-Up":
        return "text-purple-500"
      case "Send Money":
        return "text-orange-500"
      case "Plan Purchase":
        return "text-pink-500"
      default:
        return "text-gray-500"
    }
  }

  const handleRepeatActivity = (activity: Activity) => {
    switch (activity.type) {
      case "Call":
        if (activity.phoneNumber) {
          router.push(`/call?number=${activity.phoneNumber}`)
        }
        break
      case "Recharge":
        router.push(`/?recharge=${activity.amount}`)
        break
      case "Top-Up":
        if (activity.phoneNumber) {
          router.push(`/top-up?number=${activity.phoneNumber}&amount=${activity.amount}`)
        }
        break
      case "Send Money":
        if (activity.phoneNumber) {
          router.push(`/send-money?number=${activity.phoneNumber}&amount=${activity.amount}`)
        }
        break
      case "Plan Purchase":
        if (activity.planName) {
          router.push(`/plans?plan=${activity.planName}`)
        }
        break
    }
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12 lg:py-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#038E7D]">Recent Activities</h1>
          <Button variant="outline" onClick={() => router.push("/")} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </div>

        <Card className="border-[#038E7D]/10 bg-[#F0FFF9]">
          <CardHeader>
            <CardTitle className="text-xl text-[#038E7D] flex justify-between items-center">
              <span>Activity List</span>
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      {activityFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setActivityFilter("All")}>All</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActivityFilter("Call")}>Call</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActivityFilter("Recharge")}>Recharge</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActivityFilter("Top-Up")}>Top-Up</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActivityFilter("Send Money")}>Send Money</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActivityFilter("Plan Purchase")}>
                      Plan Purchase
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  {sortOrder === "asc" ? "Oldest" : "Newest"}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-[#025E52]">Loading activities...</p>
            ) : filteredAndSortedActivities.length > 0 ? (
              <div className="space-y-4">
                {filteredAndSortedActivities.map((activity) => (
                  <div key={activity.id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="mr-4" aria-hidden="true">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <p className={`font-semibold ${getActivityColor(activity.type)}`}>{activity.type}</p>
                        <p className="text-sm text-[#025E52]">{activity.description}</p>
                        {activity.type === "Call" && activity.duration && (
                          <p className="text-xs text-[#025E52]">Duration: {activity.duration}</p>
                        )}
                        {activity.recipient && (
                          <p className="text-xs text-[#025E52]">Recipient: {activity.recipient}</p>
                        )}
                        {activity.phoneNumber && (
                          <p className="text-xs text-[#025E52]">Phone: {activity.phoneNumber}</p>
                        )}
                        {activity.planName && <p className="text-xs text-[#025E52]">Plan: {activity.planName}</p>}
                        {activity.minutes && <p className="text-xs text-[#025E52]">Minutes: {activity.minutes}</p>}
                        <p className="text-xs text-[#025E52]/70">{format(activity.date, "PPpp")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`font-semibold ${activity.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                        ${Math.abs(activity.amount).toFixed(2)}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#038E7D] hover:bg-[#038E7D] hover:text-white"
                        onClick={() => handleRepeatActivity(activity)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Repeat
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[#025E52]">No activities to display.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
