import { auth } from "@/lib/auth"

import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock earnings data - in real app, fetch from database
    const earningsData = {
      totalEarnings: {
        KAUSHAL: 15750,
        ETH: 2.45,
        BTC: 0.08,
        INR: 716000,
      },
      monthlyEarnings: [
        { month: "Jan", amount: 1200 },
        { month: "Feb", amount: 1800 },
        { month: "Mar", amount: 2400 },
        { month: "Apr", amount: 3200 },
        { month: "May", amount: 2800 },
        { month: "Jun", amount: 4350 },
      ],
      skillPerformance: [
        {
          skillId: "1",
          title: "React Development",
          students: 89,
          earnings: 44500,
          rating: 4.9,
        },
        {
          skillId: "2",
          title: "Node.js Backend",
          students: 67,
          earnings: 33500,
          rating: 4.8,
        },
      ],
      recentTransactions: [
        {
          id: "tx_1",
          type: "earning",
          amount: 500,
          currency: "KAUSHAL",
          description: "Student enrollment - React Development",
          date: new Date().toISOString(),
          status: "completed",
        },
        {
          id: "tx_2",
          type: "withdrawal",
          amount: 0.1,
          currency: "ETH",
          description: "Crypto withdrawal",
          date: new Date(Date.now() - 86400000).toISOString(),
          status: "pending",
        },
      ],
    }

    return NextResponse.json(earningsData)
  } catch (error) {
    console.error("Earnings dashboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
