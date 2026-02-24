import { DataTable } from "./data-table"
import { columns } from "./columns"

// Simulated data - in a real app, this would come from an API
const data = [
  { id: 1, caller: "John Doe", recipient: "Jane Smith", duration: "5:23", date: "2023-06-15", status: "completed" },
  { id: 2, caller: "Bob Johnson", recipient: "Alice Brown", duration: "3:45", date: "2023-06-16", status: "missed" },
  { id: 3, caller: "Emma Wilson", recipient: "David Lee", duration: "8:12", date: "2023-06-17", status: "completed" },
  // Add more call data as needed
]

export default function CallsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#038E7D]">Call Logs</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
