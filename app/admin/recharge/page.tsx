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
  { id: 1, user: "John Doe", amount: 20, date: "2023-06-15", method: "Credit Card", status: "completed" },
  { id: 2, user: "Jane Smith", amount: 50, date: "2023-06-16", method: "PayPal", status: "pending" },
  { id: 3, user: "Bob Johnson", amount: 30, date: "2023-06-17", method: "Bank Transfer", status: "failed" },
  // Add more recharge data as needed
]

export default function RechargePage() {
  const [data, setData] = useState(initialData)
  const [newRecharge, setNewRecharge] = useState({ user: "", amount: "", method: "" })
  const { toast } = useToast()

  const handleAddRecharge = (e: React.FormEvent) => {
    e.preventDefault()
    const newRechargeData = {
      id: data.length + 1,
      user: newRecharge.user,
      amount: Number.parseFloat(newRecharge.amount),
      date: new Date().toISOString().split("T")[0],
      method: newRecharge.method,
      status: "pending",
    }
    setData([...data, newRechargeData])
    setNewRecharge({ user: "", amount: "", method: "" })
    toast({
      title: "Recharge Added",
      description: `New recharge for ${newRechargeData.user} has been added.`,
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#038E7D]">Recharge Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Recharge</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddRecharge} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user">User</Label>
                <Input
                  id="user"
                  value={newRecharge.user}
                  onChange={(e) => setNewRecharge({ ...newRecharge, user: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newRecharge.amount}
                  onChange={(e) => setNewRecharge({ ...newRecharge, amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">Method</Label>
                <Input
                  id="method"
                  value={newRecharge.method}
                  onChange={(e) => setNewRecharge({ ...newRecharge, method: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit">Add Recharge</Button>
          </form>
        </CardContent>
      </Card>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
