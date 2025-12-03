"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  IndianRupee,
  Users,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  CreditCard,
  Download,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface EarningsData {
  totalEarnings: {
    KAUSHAL: number
    ETH: number
    BTC: number
    INR: number
  }
  monthlyEarnings: Array<{ month: string; amount: number }>
  skillPerformance: Array<{
    skillId: string
    title: string
    students: number
    earnings: number
    rating: number
  }>
  recentTransactions: Array<{
    id: string
    type: "earning" | "withdrawal"
    amount: number
    currency: string
    description: string
    date: string
    status: "completed" | "pending" | "failed"
  }>
}

export default function EarningsPage() {
  const { data: session } = useSession()
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        const response = await fetch("/api/earnings/dashboard")
        if (response.ok) {
          const data = await response.json()
          setEarningsData(data)
        }
      } catch (error) {
        console.error("Error fetching earnings:", error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchEarningsData()
    }
  }, [session])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!earningsData) {
    return <div>Error loading earnings data</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Earnings Dashboard</h1>
          <p className="text-xl text-muted-foreground">Track your crypto earnings and skill performance</p>
        </div>

        {/* Total Earnings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-primary to-primary/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm">KAUSHAL Tokens</p>
                  <p className="text-2xl font-bold text-primary-foreground">
                    {earningsData.totalEarnings.KAUSHAL.toLocaleString()}
                  </p>
                </div>
                <Coins className="h-8 w-8 text-primary-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Ethereum</p>
                  <p className="text-2xl font-bold text-white">{earningsData.totalEarnings.ETH} ETH</p>
                </div>
                <CreditCard className="h-8 w-8 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Bitcoin</p>
                  <p className="text-2xl font-bold text-white">{earningsData.totalEarnings.BTC} BTC</p>
                </div>
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">INR Value</p>
                  <p className="text-2xl font-bold text-white">₹{earningsData.totalEarnings.INR.toLocaleString()}</p>
                </div>
                <IndianRupee className="h-8 w-8 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Monthly Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Earnings Trend</CardTitle>
                <CardDescription>Your earnings over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={earningsData.monthlyEarnings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            {/* Skill Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Skill Performance</CardTitle>
                <CardDescription>How your skills are performing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earningsData.skillPerformance.map((skill) => (
                    <div key={skill.skillId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{skill.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {skill.students} students
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {skill.rating}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{skill.earnings.toLocaleString()} KAUSHAL</p>
                        <p className="text-sm text-muted-foreground">Total Earned</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest earning and withdrawal activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earningsData.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${transaction.type === "earning" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                            }`}
                        >
                          {transaction.type === "earning" ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${transaction.type === "earning" ? "text-green-600" : "text-blue-600"}`}
                        >
                          {transaction.type === "earning" ? "+" : "-"}
                          {transaction.amount} {transaction.currency}
                        </p>
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "default"
                              : transaction.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-6">
            {/* Withdrawal Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crypto Withdrawal</CardTitle>
                  <CardDescription>Convert and withdraw your earnings to crypto</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Withdraw to Ethereum
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Withdraw to Bitcoin
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bank Transfer</CardTitle>
                  <CardDescription>Withdraw to your bank account (INR)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="secondary" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Withdraw to Bank
                  </Button>
                  <p className="text-sm text-muted-foreground">Processing time: 2-3 business days</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
