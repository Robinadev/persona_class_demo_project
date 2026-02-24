"use client"

import { useState } from "react"
import { DataTable } from "../components/data-table"
import { columns } from "./columns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Simulated data - in a real app, this would come from an API
const initialPlans = [
  {
    id: 1,
    name: "Basic",
    price: 9.99,
    minutes: 100,
    validity: 30,
    features: ["100 minutes to Ethiopia", "No hidden fees"],
  },
  {
    id: 2,
    name: "Standard",
    price: 19.99,
    minutes: 300,
    validity: 30,
    features: ["300 minutes to Ethiopia", "Rollover minutes"],
  },
  {
    id: 3,
    name: "Premium",
    price: 29.99,
    minutes: 600,
    validity: 30,
    features: ["600 minutes to Ethiopia", "Free SMS"],
  },
]

export default function PlansPage() {
  const [plans, setPlans] = useState(initialPlans)
  const [newPlan, setNewPlan] = useState({ name: "", price: "", minutes: "", validity: "", features: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault()
    const planToAdd = {
      id: plans.length + 1,
      name: newPlan.name,
      price: Number.parseFloat(newPlan.price),
      minutes: Number.parseInt(newPlan.minutes),
      validity: Number.parseInt(newPlan.validity),
      features: newPlan.features.split(",").map((feature) => feature.trim()),
    }
    setPlans([...plans, planToAdd])
    setNewPlan({ name: "", price: "", minutes: "", validity: "", features: "" })
    setIsDialogOpen(false)
    toast({
      title: "Plan Added",
      description: `${planToAdd.name} plan has been successfully added.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#038E7D]">Plans Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Plan</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Plan</DialogTitle>
              <DialogDescription>Create a new calling plan here. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPlan}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="minutes" className="text-right">
                    Minutes
                  </Label>
                  <Input
                    id="minutes"
                    type="number"
                    value={newPlan.minutes}
                    onChange={(e) => setNewPlan({ ...newPlan, minutes: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="validity" className="text-right">
                    Validity (days)
                  </Label>
                  <Input
                    id="validity"
                    type="number"
                    value={newPlan.validity}
                    onChange={(e) => setNewPlan({ ...newPlan, validity: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="features" className="text-right">
                    Features
                  </Label>
                  <Input
                    id="features"
                    value={newPlan.features}
                    onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
                    className="col-span-3"
                    placeholder="Comma-separated list of features"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Plan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={plans} />
        </CardContent>
      </Card>
    </div>
  )
}
