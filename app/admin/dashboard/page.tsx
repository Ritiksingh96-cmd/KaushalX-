"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Users, AlertTriangle, Server, Database, Cpu, HardDrive, RefreshCw, Download } from "lucide-react"
import { useSession } from "next-auth/react"

interface Analytics {
  apiMetrics: {
    totalRequests: number
    successRate: number
    averageResponseTime: number
    errorRate: number
    requestsToday: number
    requestsThisWeek: number
    requestsThisMonth: number
  }
  endpointStats: Array<{
    endpoint: string
    requests: number
    avgResponseTime: number
    errorRate: number
  }>
  rateLimitStats: {
    totalBlocked: number
    blockedToday: number
    topBlockedIPs: Array<{ ip: string; blocks: number }>
  }
  userActivity: {
    activeUsers: number
    newUsersToday: number
    totalUsers: number
    userGrowthRate: number
  }
  systemHealth: {
    uptime: string
    memoryUsage: number
    cpuUsage: number
    diskUsage: number
    databaseConnections: number
  }
}

interface LogEntry {
  timestamp: string
  level: "info" | "warn" | "error" | "debug"
  message: string
  metadata?: Record<string, any>
  userId?: string
  requestId?: string
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [selectedLogLevel, setSelectedLogLevel] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/admin/analytics")
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        }
      } catch (error) {
        console.error("Error fetching analytics:", error)
      }
    }

    const fetchLogs = async () => {
      try {
        const url = selectedLogLevel === "all" ? "/api/admin/logs" : `/api/admin/logs?level=${selectedLogLevel}`
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setLogs(data.logs)
        }
      } catch (error) {
        console.error("Error fetching logs:", error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchAnalytics()
      fetchLogs()
    }
  }, [session, selectedLogLevel])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analytics) {
    return <div>Error loading analytics data</div>
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Admin Dashboard</h1>
            <p className="text-xl text-muted-foreground">KAUSHALX API Management & Analytics</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total API Requests</p>
                  <p className="text-2xl font-bold">{analytics.apiMetrics.totalRequests.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.apiMetrics.successRate}%</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Users</p>
                  <p className="text-2xl font-bold">{analytics.userActivity.activeUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Avg Response Time</p>
                  <p className="text-2xl font-bold">{analytics.apiMetrics.averageResponseTime}ms</p>
                </div>
                <Server className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Request Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{analytics.apiMetrics.requestsToday}</p>
                      <p className="text-sm text-muted-foreground">Today</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{analytics.apiMetrics.requestsThisWeek}</p>
                      <p className="text-sm text-muted-foreground">This Week</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{analytics.apiMetrics.requestsThisMonth}</p>
                      <p className="text-sm text-muted-foreground">This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Users</span>
                      <span className="font-bold">{analytics.userActivity.totalUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Users Today</span>
                      <span className="font-bold text-green-600">+{analytics.userActivity.newUsersToday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth Rate</span>
                      <Badge className="bg-green-100 text-green-800">+{analytics.userActivity.userGrowthRate}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Endpoint Performance</CardTitle>
                <CardDescription>API endpoint statistics and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.endpointStats.map((endpoint, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{endpoint.endpoint}</h4>
                        <p className="text-sm text-muted-foreground">{endpoint.requests.toLocaleString()} requests</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-medium">{endpoint.avgResponseTime}ms</p>
                          <p className="text-muted-foreground">Avg Response</p>
                        </div>
                        <div className="text-center">
                          <Badge
                            variant={
                              endpoint.errorRate < 1 ? "secondary" : endpoint.errorRate < 3 ? "default" : "destructive"
                            }
                          >
                            {endpoint.errorRate}% errors
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Rate Limiting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Blocked Requests</span>
                      <span className="font-bold text-red-600">{analytics.rateLimitStats.totalBlocked}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Blocked Today</span>
                      <span className="font-bold">{analytics.rateLimitStats.blockedToday}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Blocked IPs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.rateLimitStats.topBlockedIPs.map((ip, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <code className="text-sm bg-muted px-2 py-1 rounded">{ip.ip}</code>
                        <Badge variant="destructive">{ip.blocks} blocks</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  System Logs
                  <div className="flex items-center gap-2">
                    <Select value={selectedLogLevel} onValueChange={setSelectedLogLevel}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="error">Errors</SelectItem>
                        <SelectItem value="warn">Warnings</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="p-3 border rounded-lg text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <Badge
                          variant={
                            log.level === "error"
                              ? "destructive"
                              : log.level === "warn"
                                ? "default"
                                : log.level === "info"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {log.level.toUpperCase()}
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="font-medium">{log.message}</p>
                      {log.metadata && (
                        <pre className="text-xs text-muted-foreground mt-2 bg-muted p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">System Uptime</p>
                      <p className="text-2xl font-bold text-green-600">{analytics.systemHealth.uptime}</p>
                    </div>
                    <Server className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Memory Usage</p>
                      <p className="text-2xl font-bold">{analytics.systemHealth.memoryUsage}%</p>
                    </div>
                    <Database className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">CPU Usage</p>
                      <p className="text-2xl font-bold">{analytics.systemHealth.cpuUsage}%</p>
                    </div>
                    <Cpu className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Disk Usage</p>
                      <p className="text-2xl font-bold">{analytics.systemHealth.diskUsage}%</p>
                    </div>
                    <HardDrive className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
