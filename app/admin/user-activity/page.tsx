"use client"

import { useState } from "react"
import { DataTable } from "../components/data-table"
import { columns } from "./columns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Simulated data - in a real app, this would come from an API
const initialData = [
  { id: 1, user: "John Doe", service: "Call", trackingNumber: "CALL001", date: "2023-06-15", duration: "5:23" },
  { id: 2, user: "Jane Smith", service: "Top-Up", trackingNumber: "TOPUP001", date: "2023-06-16", amount: 50 },
  { id: 3, user: "Bob Johnson", service: "Send Money", trackingNumber: "SEND001", date: "2023-06-17", amount: 100 },
  { id: 4, user: "Alice Brown", service: "Recharge", trackingNumber: "RECH001", date: "2023-06-18", amount: 25 },
  { id: 5, user: "Charlie Davis", service: "Call", trackingNumber: "CALL002", date: "2023-06-19", duration: "3:45" },
]

const activityData = [
  { name: "Calls", count: 45 },
  { name: "Top-Ups", count: 30 },
  { name: "Send Money", count: 20 },
  { name: "Recharges", count: 15 },
]

export default function UserActivityPage() {
  const [data, setData] = useState(initialData)
  const [filterService, setFilterService] = useState("all")
  const [filterTrackingNumber, setFilterTrackingNumber] = useState("")

  const handleFilter = () => {
    let filteredData = initialData

    if (filterService !== "all") {
      filteredData = filteredData.filter((item) => item.service === filterService)
    }

    if (filterTrackingNumber) {
      filteredData = filteredData.filter((item) =>
        item.trackingNumber.toLowerCase().includes(filterTrackingNumber.toLowerCase()),
      )
    }

    setData(filteredData)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#038E7D]">User Activity</h1>

      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#038E7D" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filter Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service">Service Type</Label>
              <Select value={filterService} onValueChange={setFilterService}>
                <SelectTrigger id="service">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="Call">Call</SelectItem>
                  <SelectItem value="Top-Up">Top-Up</SelectItem>
                  <SelectItem value="Send Money">Send Money</SelectItem>
                  <SelectItem value="Recharge">Recharge</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                value={filterTrackingNumber}
                onChange={(e) => setFilterTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleFilter}>Apply Filter</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable columns={columns} data={data} />
    </div>
  )
}
