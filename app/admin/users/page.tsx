"use client"
import { useToast } from "@/components/ui/use-toast"
import { DataTable } from "./data-table"
import { columns } from "./columns"

type User = {
  id: string
  name: string
  email: string
  phoneNumber: string
  status: "active" | "inactive"
  registrationDate: string
}

// Simulated data - in a real app, this would come from an API
const data = [
  { id: 1, name: "John Doe", email: "john@example.com", status: "active", joinDate: "2023-01-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: "inactive", joinDate: "2023-02-20" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", status: "active", joinDate: "2023-03-10" },
  // Add more user data as needed
]

export default function UsersPage() {
  //const [users, setUsers] = useState<User[]>([])
  //const [isLoading, setIsLoading] = useState(true)
  //const [searchTerm, setSearchTerm] = useState("")
  //const [newUser, setNewUser] = useState({ name: "", email: "", phoneNumber: "" })
  //const [isAddingUser, setIsAddingUser] = useState(false)
  const { toast } = useToast()

  //useEffect(() => {
  //  fetchUsers()
  //}, [])

  //const fetchUsers = async () => {
  //  setIsLoading(true)
  //  // Simulating API call
  //  await new Promise((resolve) => setTimeout(resolve, 1000))
  //  const mockUsers: User[] = [
  //    {
  //      id: "1",
  //      name: "John Doe",
  //      email: "john@example.com",
  //      phoneNumber: "+251912345678",
  //      status: "active",
  //      registrationDate: "2023-01-15",
  //    },
  //    {
  //      id: "2",
  //      name: "Jane Smith",
  //      email: "jane@example.com",
  //      phoneNumber: "+251923456789",
  //      status: "active",
  //      registrationDate: "2023-02-20",
  //    },
  //    {
  //      id: "3",
  //      name: "Alice Johnson",
  //      email: "alice@example.com",
  //      phoneNumber: "+251934567890",
  //      status: "inactive",
  //      registrationDate: "2023-03-10",
  //    },
  //  ]
  //  setUsers(mockUsers)
  //  setIsLoading(false)
  //}

  //const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  //  setSearchTerm(event.target.value)
  //}

  //const filteredUsers = users.filter(
  //  (user) =>
  //    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //    user.phoneNumber.includes(searchTerm),
  //)

  //const handleAddUser = async (e: React.FormEvent) => {
  //  e.preventDefault()
  //  setIsAddingUser(true)
  //  // Simulating API call
  //  await new Promise((resolve) => setTimeout(resolve, 1000))
  //  const newUserData: User = {
  //    id: (users.length + 1).toString(),
  //    ...newUser,
  //    status: "active",
  //    registrationDate: new Date().toISOString().split("T")[0],
  //  }
  //  setUsers([...users, newUserData])
  //  setNewUser({ name: "", email: "", phoneNumber: "" })
  //  setIsAddingUser(false)
  //  toast({
  //    title: "User Added",
  //    description: `${newUserData.name} has been successfully added.`,
  //  })
  //}

  //const handleStatusChange = async (userId: string, newStatus: "active" | "inactive") => {
  //  // Simulating API call
  //  await new Promise((resolve) => setTimeout(resolve, 500))
  //  setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
  //  toast({
  //    title: "Status Updated",
  //    description: `User status has been updated to ${newStatus}.`,
  //  })
  //}

  //const handleDeleteUser = async (userId: string) => {
  //  // Simulating API call
  //  await new Promise((resolve) => setTimeout(resolve, 500))
  //  setUsers(users.filter((user) => user.id !== userId))
  //  toast({
  //    title: "User Deleted",
  //    description: "The user has been successfully deleted.",
  //    variant: "destructive",
  //  })
  //}

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#038E7D]">User Management</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
