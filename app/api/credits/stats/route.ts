import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

import { getUserTransactions } from "@/lib/database/transactions"
import { getUserById } from "@/lib/database/users"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserById(new ObjectId(session.user.id))
    const transactions = await getUserTransactions(new ObjectId(session.user.id), 1000)

    const totalEarned = transactions
      .filter((t: any) => t.type === "earn" && t.status === "completed")
      .reduce((sum: number, t: any) => sum + t.amount, 0)

    const totalSpent = transactions
      .filter((t: any) => (t.type === "spend" || t.type === "convert") && t.status === "completed")
      .reduce((sum: number, t: any) => sum + t.amount, 0)

    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const weeklyEarnings = transactions
      .filter((t: any) => t.type === "earn" && t.status === "completed" && new Date(t.createdAt) >= weekAgo)
      .reduce((sum: number, t: any) => sum + t.amount, 0)

    const stats = {
      balance: user?.skillCredits || 0,
      totalEarned,
      totalSpent,
      weeklyEarnings,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching credit stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
