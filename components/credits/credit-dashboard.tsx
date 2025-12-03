"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Coins,
  TrendingUp,
  Award,
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownLeft,
  Star,
  BookOpen,
  Video,
  MessageCircle,
} from "lucide-react"

interface CreditStats {
  totalEarned: number
  totalSpent: number
  currentBalance: number
  topEarningSources: { source: string; amount: number }[]
  monthlyEarnings: { month: string; amount: number }[]
}

interface Transaction {
  _id: string
  type: "earned" | "spent" | "bonus" | "penalty"
  amount: number
  source: string
  description: string
  createdAt: string
}

const sourceIcons: Record<string, any> = {
  session_complete: BookOpen,
  badge_earned: Award,
  skill_verified: Star,
  daily_streak: Calendar,
  video_upload: Video,
  comment_helpful: MessageCircle,
  quality_bonus: TrendingUp,
}

const sourceLabels: Record<string, string> = {
  session_complete: "Session Complete",
  badge_earned: "Badge Earned",
  skill_verified: "Skill Verified",
  daily_streak: "Daily Streak",
  video_upload: "Video Upload",
  comment_helpful: "Helpful Comment",
  quality_bonus: "Quality Bonus",
}

export default function CreditDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<CreditStats | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchCreditData()
    }
  }, [session])

  const fetchCreditData = async () => {
    try {
      const [statsRes, transactionsRes] = await Promise.all([
        fetch("/api/credits?action=stats"),
        fetch("/api/credits?action=transactions&limit=20"),
      ])

      const statsData = await statsRes.json()
      const transactionsData = await transactionsRes.json()

      setStats(statsData.stats)
      setTransactions(transactionsData.transactions)
    } catch (error) {
      console.error("Failed to fetch credit data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  if (!stats) {
    return <div className="text-center p-8">Failed to load credit data</div>
  }

  return (
    <div className="space-y-6">
      {/* Credit Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentBalance}</div>
            <p className="text-xs text-muted-foreground">Skill Credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalEarned}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalSpent}</div>
            <p className="text-xs text-muted-foreground">Learning investments</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="earning">Earning Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Top Earning Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Top Earning Sources</CardTitle>
              <CardDescription>Your most profitable activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.topEarningSources.map((source, index) => {
                const Icon = sourceIcons[source.source] || Coins
                const percentage = (source.amount / stats.totalEarned) * 100

                return (
                  <div key={source.source} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 flex-1">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{sourceLabels[source.source] || source.source}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={percentage} className="w-20" />
                      <span className="text-sm font-bold w-12 text-right">{source.amount}</span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Monthly Earnings Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings</CardTitle>
              <CardDescription>Your earning trend over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.monthlyEarnings.map((month) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{month.month}</span>
                    <span className="font-medium">{month.amount} credits</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest credit activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => {
                  const Icon = transaction.type === "earned" ? ArrowUpRight : ArrowDownLeft
                  const IconSource = sourceIcons[transaction.source] || Coins

                  return (
                    <div key={transaction._id} className="flex items-center space-x-4 p-3 rounded-lg border">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.type === "earned" ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 ${transaction.type === "earned" ? "text-green-600" : "text-red-600"}`}
                          />
                        </div>
                        <IconSource className="h-4 w-4 text-muted-foreground" />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div
                        className={`text-sm font-bold ${
                          transaction.type === "earned" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {transaction.type === "earned" ? "+" : "-"}
                        {transaction.amount}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earning" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Teaching Sessions</span>
                </CardTitle>
                <CardDescription>Earn credits by sharing your skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Base rate:</span>
                  <span className="font-medium">20-35 credits/session</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality bonus (4.5+ ⭐):</span>
                  <span className="font-medium">+50% credits</span>
                </div>
                <div className="flex justify-between">
                  <span>Perfect rating (5.0 ⭐):</span>
                  <span className="font-medium">+20% extra</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Badge Achievements</span>
                </CardTitle>
                <CardDescription>Earn credits for unlocking badges</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Common badges:</span>
                  <span className="font-medium">1-5 credits</span>
                </div>
                <div className="flex justify-between">
                  <span>Rare badges:</span>
                  <span className="font-medium">25-50 credits</span>
                </div>
                <div className="flex justify-between">
                  <span>Legendary badges:</span>
                  <span className="font-medium">100-200 credits</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Daily Streaks</span>
                </CardTitle>
                <CardDescription>Consistency rewards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>3-day streak:</span>
                  <span className="font-medium">10 credits</span>
                </div>
                <div className="flex justify-between">
                  <span>7-day streak:</span>
                  <span className="font-medium">15 credits</span>
                </div>
                <div className="flex justify-between">
                  <span>30-day streak:</span>
                  <span className="font-medium">50 credits</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="h-5 w-5" />
                  <span>Community Contributions</span>
                </CardTitle>
                <CardDescription>Help others and earn credits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Upload tutorial video:</span>
                  <span className="font-medium">15 credits</span>
                </div>
                <div className="flex justify-between">
                  <span>Helpful comment:</span>
                  <span className="font-medium">3 credits</span>
                </div>
                <div className="flex justify-between">
                  <span>Skill verification:</span>
                  <span className="font-medium">30+ credits</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
