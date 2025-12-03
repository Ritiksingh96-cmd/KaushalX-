"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, BookOpen, Users, Coins } from "lucide-react"
import { format } from "date-fns"

interface Activity {
  _id: string
  type: "earn" | "spend" | "convert"
  amount: number
  description: string
  category: string
  createdAt: string
  metadata?: {
    skillName?: string
  }
}

export function RecentActivity() {
  const { data: session } = useSession()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchRecentActivity()
    }
  }, [session])

  const fetchRecentActivity = async () => {
    try {
      const response = await fetch("/api/credits/transactions?limit=10")
      if (response.ok) {
        const data = await response.json()
        setActivities(data.transactions.slice(0, 5))
      }
    } catch (error) {
      console.error("Error fetching recent activity:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (category: string) => {
    switch (category) {
      case "skill_teaching":
      case "skill_learning":
        return <BookOpen className="h-4 w-4 text-blue-600" />
      case "crypto_conversion":
        return <Coins className="h-4 w-4 text-yellow-600" />
      default:
        return <Users className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
                <p className="text-sm">Start learning or teaching to see your activity here!</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity._id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="flex-shrink-0">{getActivityIcon(activity.category)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(activity.createdAt), "MMM dd, HH:mm")}
                      </p>
                      {activity.metadata?.skillName && (
                        <Badge variant="outline" className="text-xs">
                          {activity.metadata.skillName}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        activity.type === "earn" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {activity.type === "earn" ? "+" : "-"}
                      {activity.amount}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
