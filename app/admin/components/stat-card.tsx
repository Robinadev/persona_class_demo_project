import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  title: string
  value: string | number
  trend?: string
  trendPositive?: boolean
  gradientFrom: string
  gradientTo: string
  borderColor: string
  textColor: string
}

export function StatCard({
  icon: Icon,
  title,
  value,
  trend,
  trendPositive = true,
  gradientFrom,
  gradientTo,
  borderColor,
  textColor,
}: StatCardProps) {
  return (
    <Card className={`border-2 ${borderColor} bg-white/80 backdrop-blur hover:shadow-lg transition-all`}>
      <CardHeader className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} border-b`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-sm font-semibold">{title}</CardTitle>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        {trend && (
          <p className={`text-xs mt-2 flex items-center gap-1 ${trendPositive ? "text-green-600" : "text-red-600"}`}>
            <ArrowUpRight className="h-3 w-3" />
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
