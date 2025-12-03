import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { CreditService } from "@/lib/database/credits"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case "session_complete":
        await CreditService.processSessionCompletion(
          data.teacherId,
          data.learnerId,
          data.skillName,
          data.rating,
          data.duration,
        )
        break

      case "badge_earned":
        await CreditService.processBadgeEarned(session.user.id, data.badgeId, data.badgePoints)
        break

      case "daily_streak":
        await CreditService.processDailyStreak(session.user.id, data.streakDays)
        break

      case "skill_verified":
        await CreditService.processSkillVerification(session.user.id, data.skillName, data.category)
        break

      case "video_upload":
        await CreditService.processVideoUpload(session.user.id, data.videoTitle)
        break

      case "helpful_comment":
        await CreditService.processHelpfulComment(session.user.id, data.commentId)
        break

      default:
        return NextResponse.json({ error: "Invalid earning type" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Credit earning API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
