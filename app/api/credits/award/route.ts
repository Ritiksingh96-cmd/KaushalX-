import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

import { awardCreditsForSkillSession } from "@/lib/database/transactions"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { teacherId, learnerId, skillName, sessionDuration } = await request.json()

    if (!teacherId || !learnerId || !skillName || !sessionDuration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await awardCreditsForSkillSession(
      new ObjectId(teacherId),
      new ObjectId(learnerId),
      skillName,
      sessionDuration,
    )

    return NextResponse.json({
      success: true,
      creditsAwarded: result,
      message: "Credits awarded successfully!",
    })
  } catch (error) {
    console.error("Error awarding credits:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
