"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

interface ActivityChartProps {
  data: { date: string; earned: number; sessions: number }[]
}

export function ActivityChart({ data }: ActivityChartProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Weekly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDate} fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              labelFormatter={(value) => formatDate(value as string)}
              formatter={(value, name) => [value, name === "earned" ? "Credits Earned" : "Sessions"]}
            />
            <Bar dataKey="earned" fill="#3b82f6" name="earned" />
            <Bar dataKey="sessions" fill="#10b981" name="sessions" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
