import { ReactNode } from "react"

interface AdminCardProps {
  icon?: ReactNode
  title: string
  value: string | number
  subtitle?: string
  trend?: "up" | "down"
  trendValue?: string
  className?: string
}

export function AdminCard({
  icon,
  title,
  value,
  subtitle,
  trend,
  trendValue,
  className = "",
}: AdminCardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {icon && <div className="text-teal-600 ml-4">{icon}</div>}
      </div>
      {trend && trendValue && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span
            className={`text-sm font-medium ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend === "up" ? "↑" : "↓"} {trendValue}
          </span>
        </div>
      )}
    </div>
  )
}
