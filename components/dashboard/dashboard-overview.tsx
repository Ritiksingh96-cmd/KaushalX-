"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivityChart } from "./activity-chart"
import { RecentActivity } from "./recent-activity"
import { SkillProgress } from "./skill-progress"
import { QuickActions } from "./quick-actions"
import { TokenStats } from "./token-stats"
import { WalletConnect } from "@/components/wallet/wallet-connect"
import { TrendingUp, BookOpen, Award, Coins, Target, Calendar, Star } from "lucide-react"

interface DashboardAnalytics {
  overview: {
    totalCredits: number
    kaushalTokenBalance: number
    totalEarned: number
    weeklyEarnings: number
    level: number
    reputation: number
    badgeCount: number
  }
  activity: {
    teachingSessions: number
    learningSessions: number
    totalSessions: number
    recentActivity: number
    monthlyActivity: number
  }
  skills: {
    offered: string[]
    wanted: string[]
    categories: { skill: string; count: number }[]
  }
  charts: {
    dailyActivity: { date: string; earned: number; sessions: number }[]
    earningsGrowth: string
  }
  recentMatches: any[]
}

export function DashboardOverview() {
  const { data: session } = useSession()
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)
  const [showDetailedStats, setShowDetailedStats] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      fetchAnalytics()
    }
  }, [session])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/dashboard/analytics")
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
        setError(null)
      } else {
        setError("Failed to load dashboard data.")
        setAnalytics(null)
      }
    } catch (err) {
      console.error("Error fetching analytics:", err)
      setError("Error fetching dashboard data.")
      setAnalytics(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        {error}
        <button
          onClick={fetchAnalytics}
          className="mt-2 px-4 py-2 bg-primary text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) return null;

  const levelProgress = ((analytics.overview.reputation % 1000) / 1000) * 100

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name}!</h1>
          <p className="text-muted-foreground">Here's your learning journey overview</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-sm">
              Level {analytics.overview.level}
            </Badge>
            <Badge variant="outline" className="text-sm">
              {analytics.overview.badgeCount} Badges
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetailedStats(!showDetailedStats)}
          >
            {showDetailedStats ? "Show Less" : "Show Details"}
          </Button>
          <WalletConnect />
        </div>
      </div>

      {/* Stats Overview */}
      <TokenStats userBalance={analytics.overview.kaushalTokenBalance || 0} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <Coins className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{analytics.overview.totalCredits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{analytics.overview.weeklyEarnings} this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analytics.activity.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activity.teachingSessions} taught, {analytics.activity.learningSessions} learned
            </p>
          </CardContent>
        </Card>

        {showDetailedStats && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reputation</CardTitle>
                <Star className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{analytics.overview.reputation}</div>
                <div className="mt-2">
                  <Progress value={levelProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{Math.floor(levelProgress)}% to next level</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+{analytics.charts.earningsGrowth}%</div>
                <p className="text-xs text-muted-foreground">Weekly earnings growth</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ActivityChart data={analytics.charts.dailyActivity} />
            </div>
            <div>
              <QuickActions />
            </div>
          </div>
          <RecentActivity />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Week</span>
                    <Badge variant="secondary">{analytics.activity.recentActivity} activities</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Month</span>
                    <Badge variant="outline">{analytics.activity.monthlyActivity} activities</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Session Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Teaching Sessions</span>
                      <span>{analytics.activity.teachingSessions}</span>
                    </div>
                    <Progress
                      value={
                        (analytics.activity.teachingSessions / Math.max(analytics.activity.totalSessions, 1)) * 100
                      }
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Learning Sessions</span>
                      <span>{analytics.activity.learningSessions}</span>
                    </div>
                    <Progress
                      value={
                        (analytics.activity.learningSessions / Math.max(analytics.activity.totalSessions, 1)) * 100
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <SkillProgress
            offeredSkills={analytics.skills.offered}
            wantedSkills={analytics.skills.wanted}
            topSkills={analytics.skills.categories}
          />
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Monthly Goal</span>
                      <span>8/10 sessions</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Credit Goal</span>
                      <span>750/1000 credits</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">First Teaching Session</span>
                    <Award className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">100 Credits Earned</span>
                    <Award className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="text-sm">Community Helper</span>
                    <Award className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
