import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface ChartProps {
  title: string
  data: any[]
  dataKey: string | string[]
  type: "line" | "bar" | "pie"
  colors?: string[]
  borderColor?: string
  headerGradient?: string
}

export function AdminChart({
  title,
  data,
  dataKey,
  type = "line",
  colors = ["#D62828", "#F59E0B", "#10B981", "#3B82F6"],
  borderColor = "border-red-100",
  headerGradient = "from-red-50 to-yellow-50",
}: ChartProps) {
  return (
    <Card className={`border-2 ${borderColor} bg-white/80 backdrop-blur`}>
      <CardHeader className={`bg-gradient-to-r ${headerGradient} border-b`}>
        <CardTitle className="text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          {type === "line" && (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              {Array.isArray(dataKey) ? (
                dataKey.map((key, idx) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[idx]}
                    strokeWidth={2}
                    dot={{ fill: colors[idx], r: 4 }}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={colors[0]}
                  strokeWidth={2}
                  dot={{ fill: colors[0], r: 4 }}
                />
              )}
            </LineChart>
          )}

          {type === "bar" && (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              {Array.isArray(dataKey) ? (
                dataKey.map((key, idx) => <Bar key={key} dataKey={key} fill={colors[idx]} />)
              ) : (
                <Bar dataKey={dataKey} fill={colors[0]} />
              )}
            </BarChart>
          )}

          {type === "pie" && (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
