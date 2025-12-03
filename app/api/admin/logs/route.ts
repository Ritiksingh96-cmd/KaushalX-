import { auth } from "@/lib/auth"

import { type NextRequest, NextResponse } from "next/server"
import { apiLogger } from "@/lib/api/logger"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin (in real app, check user role)
    const isAdmin = session.user.email === "admin@kaushalx.com" // Replace with proper admin check

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const level = searchParams.get("level") as "info" | "warn" | "error" | "debug" | null
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    let logs
    if (level) {
      logs = apiLogger.getLogsByLevel(level, limit)
    } else if (userId) {
      logs = apiLogger.getLogsByUser(userId, limit)
    } else {
      logs = apiLogger.getRecentLogs(limit)
    }

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Logs fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
