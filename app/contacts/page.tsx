"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Search, Phone, SendHorizontal, Wallet } from "lucide-react"
import Link from "next/link"

type Contact = {
  id: string
  name: string
  phoneNumber: string
}

const initialContacts: Contact[] = [
  { id: "1", name: "John Doe", phoneNumber: "+251912345678" },
  { id: "2", name: "Jane Smith", phoneNumber: "+251987654321" },
  { id: "3", name: "Alice Johnson", phoneNumber: "+251123456789" },
]

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [searchTerm, setSearchTerm] = useState("")
  const [newName, setNewName] = useState("")
  const [newPhoneNumber, setNewPhoneNumber] = useState("")

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.phoneNumber.includes(searchTerm),
  )

  const handleAddContact = () => {
    if (newName && newPhoneNumber) {
      const newContact: Contact = {
        id: Date.now().toString(),
        name: newName,
        phoneNumber: newPhoneNumber,
      }
      setContacts([...contacts, newContact])
      setNewName("")
      setNewPhoneNumber("")
    }
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12 lg:py-24">
        <h1 className="text-3xl font-bold text-center text-[#038E7D] mb-8">Contacts</h1>

        <Card className="mb-8 border-[#038E7D]/10 bg-[#F0FFF9]">
          <CardHeader>
            <CardTitle className="text-xl text-[#038E7D]">Add New Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border-[#038E7D]/20"
            />
            <Input
              placeholder="Phone Number"
              value={newPhoneNumber}
              onChange={(e) => setNewPhoneNumber(e.target.value)}
              className="border-[#038E7D]/20"
            />
            <Button onClick={handleAddContact} className="w-full bg-[#038E7D] hover:bg-[#025E52] text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Contact
            </Button>
          </CardContent>
        </Card>

        <Card className="border-[#038E7D]/10 bg-[#F0FFF9]">
          <CardHeader>
            <CardTitle className="text-xl text-[#038E7D]">Contact List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-[#038E7D]/20"
                startIcon={<Search className="h-4 w-4 text-[#038E7D]" />}
              />
            </div>
            <ScrollArea className="h-[400px]">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-4 border-b border-[#038E7D]/10 last:border-b-0"
                >
                  <div>
                    <p className="font-semibold text-[#038E7D]">{contact.name}</p>
                    <p className="text-sm text-[#025E52]">{contact.phoneNumber}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/call?number=${contact.phoneNumber}`}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-[#038E7D] hover:bg-[#038E7D] hover:text-white"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/send-money?number=${contact.phoneNumber}`}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-[#038E7D] hover:bg-[#038E7D] hover:text-white"
                      >
                        <SendHorizontal className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/top-up?number=${contact.phoneNumber}`}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-[#038E7D] hover:bg-[#038E7D] hover:text-white"
                      >
                        <Wallet className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
