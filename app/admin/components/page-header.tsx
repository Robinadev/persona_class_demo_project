import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  isLoading?: boolean
}

export function PageHeader({
  title,
  description,
  actionLabel = "Refresh",
  onAction,
  isLoading = false,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">
          {title}
        </h2>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>
      {onAction && (
        <Button
          onClick={onAction}
          disabled={isLoading}
          className="bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 text-white"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Loading..." : actionLabel}
        </Button>
      )}
    </div>
  )
}
