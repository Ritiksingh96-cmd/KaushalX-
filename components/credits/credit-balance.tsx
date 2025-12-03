"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, TrendingUp, Gift } from "lucide-react"

interface CreditStats {
  balance: number
  totalEarned: number
  totalSpent: number
  weeklyEarnings: number
}

export function CreditBalance() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<CreditStats>({
    balance: 0,
    totalEarned: 0,
    totalSpent: 0,
    weeklyEarnings: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchCreditStats()
    }
  }, [session])

  const fetchCreditStats = async () => {
    try {
      const response = await fetch("/api/credits/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching credit stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Credit Balance</CardTitle>
          <Coins className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.balance.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Available credits</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.totalEarned.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Lifetime earnings</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Earnings</CardTitle>
          <Gift className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.weeklyEarnings.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">This week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
          <Badge variant="secondary">Active</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {stats.balance >= 1000 ? "Premium" : stats.balance >= 500 ? "Gold" : "Silver"} Member
          </div>
          <p className="text-xs text-muted-foreground">Current tier</p>
        </CardContent>
      </Card>
    </div>
  )
}
