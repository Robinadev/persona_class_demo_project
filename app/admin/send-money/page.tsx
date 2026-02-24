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
  { id: 1, sender: "John Doe", recipient: "Jane Smith", amount: 100, date: "2023-06-15", status: "completed" },
  { id: 2, sender: "Bob Johnson", recipient: "Alice Brown", amount: 50, date: "2023-06-16", status: "pending" },
  { id: 3, sender: "Emma Wilson", recipient: "David Lee", amount: 75, date: "2023-06-17", status: "failed" },
  // Add more send money data as needed
]

export default function SendMoneyPage() {
  const [data, setData] = useState(initialData)
  const [newTransaction, setNewTransaction] = useState({ sender: "", recipient: "", amount: "" })
  const { toast } = useToast()

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    const newTransactionData = {
      id: data.length + 1,
      sender: newTransaction.sender,
      recipient: newTransaction.recipient,
      amount: Number.parseFloat(newTransaction.amount),
      date: new Date().toISOString().split("T")[0],
      status: "pending",
    }
    setData([...data, newTransactionData])
    setNewTransaction({ sender: "", recipient: "", amount: "" })
    toast({
      title: "Transaction Added",
      description: `New transaction from ${newTransactionData.sender} to ${newTransactionData.recipient} has been added.`,
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#038E7D]">Send Money Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender">Sender</Label>
                <Input
                  id="sender"
                  value={newTransaction.sender}
                  onChange={(e) => setNewTransaction({ ...newTransaction, sender: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient</Label>
                <Input
                  id="recipient"
                  value={newTransaction.recipient}
                  onChange={(e) => setNewTransaction({ ...newTransaction, recipient: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit">Add Transaction</Button>
          </form>
        </CardContent>
      </Card>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
