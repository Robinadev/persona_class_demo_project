"use client"

import { useState } from "react"
import { DataTable } from "../components/data-table"
import { columns } from "./columns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

// Simulated data - in a real app, this would come from an API
const initialData = [
  { id: 1, user: "John Doe", amount: 50, date: "2023-06-15", status: "completed" },
  { id: 2, user: "Jane Smith", amount: 100, date: "2023-06-16", status: "pending" },
  { id: 3, user: "Bob Johnson", amount: 25, date: "2023-06-17", status: "failed" },
  // Add more top-up data as needed
]

export default function TopUpPage() {
  const [data, setData] = useState(initialData)
  const [newTopUp, setNewTopUp] = useState({ user: "", amount: "" })
  const { toast } = useToast()

  const handleAddTopUp = (e: React.FormEvent) => {
    e.preventDefault()
    const newTopUpData = {
      id: data.length + 1,
      user: newTopUp.user,
      amount: Number.parseFloat(newTopUp.amount),
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    }
    setData([...data, newTopUpData])
    setNewTopUp({ user: "", amount: "" })
    toast({
      title: "Top-Up Added",
      description: `New top-up for ${newTopUpData.user} has been added.`,
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#038E7D]">Top-Up Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Top-Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTopUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user">User</Label>
                <Input
                  id="user"
                  value={newTopUp.user}
                  onChange={(e) => setNewTopUp({ ...newTopUp, user: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newTopUp.amount}
                  onChange={(e) => setNewTopUp({ ...newTopUp, amount: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit">Add Top-Up</Button>
          </form>
        </CardContent>
      </Card>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
