import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

import { getUserTransactions } from "@/lib/database/transactions"
import { getUserById, findUserByEmail } from "@/lib/database/users"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    // Validate the session user ID before converting to ObjectId
    const userIdString = session.user.id as string
    let userId: any = null
    if (ObjectId.isValid(userIdString)) {
      userId = new ObjectId(userIdString)
    } else {
      // Fallback: try to find user by email if ID is not a Mongo ObjectId (e.g., Google ID)
      console.warn('Session user ID not a valid ObjectId, attempting email lookup')
      const userByEmail = await findUserByEmail(session.user.email as string)
      if (!userByEmail) {
        console.error('User not found by email:', session.user.email)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      userId = userByEmail._id
    }

    // Get user data
    const user = await getUserById(userId)
    const transactions = await getUserTransactions(userId, 1000)

    // Calculate analytics
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Recent activity
    const recentTransactions = transactions.filter((t: any) => new Date(t.createdAt) >= sevenDaysAgo)
    const monthlyTransactions = transactions.filter((t: any) => new Date(t.createdAt) >= thirtyDaysAgo)

    // Teaching/Learning stats
    const teachingSessions = transactions.filter((t: any) => t.category === "skill_teaching").length
    const learningSessions = transactions.filter((t: any) => t.category === "skill_learning").length

    // Credit analytics
    const totalEarned = transactions
      .filter((t: any) => t.type === "earn" && t.status === "completed")
      .reduce((sum: number, t: any) => sum + t.amount, 0)

    const weeklyEarnings = recentTransactions
      .filter((t: any) => t.type === "earn" && t.status === "completed")
      .reduce((sum: number, t: any) => sum + t.amount, 0)

    // Skill categories
    const skillCategories = transactions
      .filter((t: any) => t.metadata?.skillName)
      .reduce(
        (acc: Record<string, number>, t: any) => {
          const skill = t.metadata!.skillName!
          acc[skill] = (acc[skill] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

    // Daily activity for chart (last 7 days)
    const dailyActivity = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))

      const dayTransactions = transactions.filter((t: any) => {
        const tDate = new Date(t.createdAt)
        return tDate >= dayStart && tDate <= dayEnd
      })

      const earned = dayTransactions.filter((t: any) => t.type === "earn").reduce((sum: number, t: any) => sum + t.amount, 0)

      dailyActivity.push({
        date: dayStart.toISOString().split("T")[0],
        earned,
        sessions: dayTransactions.filter((t: any) => t.category.includes("skill_")).length,
      })
    }

    // Get recent matches
    const recentMatches = await db
      .collection("matches")
      .find({
        $or: [{ userId1: userId }, { userId2: userId }],
        updatedAt: { $gte: sevenDaysAgo },
      })
      .sort({ updatedAt: -1 })
      .limit(5)
      .toArray()

    const analytics = {
      overview: {
        totalCredits: user?.skillCredits || 0,
        kaushalTokenBalance: user?.kaushalTokenBalance || 0,
        totalEarned,
        weeklyEarnings,
        level: user?.level || 1,
        reputation: user?.reputation || 0,
        badgeCount: user?.badges?.length || 0,
      },
      activity: {
        teachingSessions,
        learningSessions,
        totalSessions: teachingSessions + learningSessions,
        recentActivity: recentTransactions.length,
        monthlyActivity: monthlyTransactions.length,
      },
      skills: {
        offered: user?.skills?.offered || [],
        wanted: user?.skills?.wanted || [],
        categories: Object.entries(skillCategories)
          .sort(([, a]: [string, unknown], [, b]: [string, unknown]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([skill, count]) => ({ skill, count: count as number })),
      },
      charts: {
        dailyActivity,
        earningsGrowth:
          weeklyEarnings > 0 ? ((weeklyEarnings / Math.max(totalEarned - weeklyEarnings, 1)) * 100).toFixed(1) : "0",
      },
      recentMatches: recentMatches.map((match) => ({
        id: match._id.toString(),
        status: match.status,
        skillsExchanged: match.skillsExchanged,
        createdAt: match.createdAt,
      })),
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error("Error in dashboard analytics API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
