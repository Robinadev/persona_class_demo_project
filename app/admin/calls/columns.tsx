"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Call = {
  id: number
  caller: string
  recipient: string
  duration: string
  date: string
  status: "completed" | "missed"
}

export const columns: ColumnDef<Call>[] = [
  {
    accessorKey: "caller",
    header: "Caller",
  },
  {
    accessorKey: "recipient",
    header: "Recipient",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      return <span className={status === "completed" ? "text-green-600" : "text-red-600"}>{status}</span>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const call = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(call.id.toString())}>
              Copy call ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View call details</DropdownMenuItem>
            <DropdownMenuItem>Download recording</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
