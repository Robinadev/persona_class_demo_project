"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RoleBasedComponent } from "../components/role-based-component"

const roles = [
  { value: "cfo", label: "Chief Financial Officer (CFO)" },
  { value: "technical_admin", label: "Technical Admin" },
  { value: "administrative_admin", label: "Administrative Admin" },
]

const initialAdmins = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Chief Financial Officer (CFO)", status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Technical Admin", status: "Active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Administrative Admin", status: "Active" },
]

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState(initialAdmins)
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", role: "", password: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/admin/check-auth", { credentials: "include" })
      const data = await res.json()
      if (!data.isLoggedIn) {
        router.push("/admin/login")
      }
    }
    checkAuth()
  }, [router])

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    const adminToAdd = {
      id: admins.length + 1,
      name: newAdmin.name,
      email: newAdmin.email,
      role: roles.find((r) => r.value === newAdmin.role)?.label || "",
      status: "Active",
    }
    setAdmins([...admins, adminToAdd])
    setNewAdmin({ name: "", email: "", role: "", password: "" })
    setIsDialogOpen(false)
    toast({
      title: "Admin Added",
      description: `${adminToAdd.name} has been successfully added as a ${adminToAdd.role}.`,
    })
  }

  return (
    <RoleBasedComponent requiredRole="cfo">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#038E7D]">Manage Admins</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Admin</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogDescription>Create a new admin user here. Click save when you're done.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAdmin}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Role
                    </Label>
                    <Select value={newAdmin.role} onValueChange={(value) => setNewAdmin({ ...newAdmin, role: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Admin</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={admins} />
          </CardContent>
        </Card>
      </div>
    </RoleBasedComponent>
  )
}
