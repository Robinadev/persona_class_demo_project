import type { ReactNode } from "react"

export default function AdminAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0FFF9]">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
