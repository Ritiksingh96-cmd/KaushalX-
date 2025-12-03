import { auth } from "@/lib/auth"

import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = session.user.email === "admin@kaushalx.com"
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Mock analytics data - in real app, fetch from database
    const analytics = {
      apiMetrics: {
        totalRequests: 15420,
        successRate: 98.5,
        averageResponseTime: 245,
        errorRate: 1.5,
        requestsToday: 1250,
        requestsThisWeek: 8900,
        requestsThisMonth: 35600,
      },
      endpointStats: [
        { endpoint: "/api/skills", requests: 4500, avgResponseTime: 180, errorRate: 0.8 },
        { endpoint: "/api/chat", requests: 3200, avgResponseTime: 120, errorRate: 0.5 },
        { endpoint: "/api/payment", requests: 2100, avgResponseTime: 450, errorRate: 2.1 },
        { endpoint: "/api/earnings", requests: 1800, avgResponseTime: 200, errorRate: 1.2 },
        { endpoint: "/api/auth", requests: 3820, avgResponseTime: 300, errorRate: 3.5 },
      ],
      rateLimitStats: {
        totalBlocked: 245,
        blockedToday: 12,
        topBlockedIPs: [
          { ip: "192.168.1.100", blocks: 45 },
          { ip: "10.0.0.50", blocks: 32 },
          { ip: "172.16.0.25", blocks: 28 },
        ],
      },
      userActivity: {
        activeUsers: 1250,
        newUsersToday: 45,
        totalUsers: 8900,
        userGrowthRate: 12.5,
      },
      systemHealth: {
        uptime: "99.9%",
        memoryUsage: 65,
        cpuUsage: 45,
        diskUsage: 32,
        databaseConnections: 25,
      },
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Analytics fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
