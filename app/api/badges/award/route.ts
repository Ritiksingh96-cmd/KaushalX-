import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

import { BadgeSystem } from "@/lib/achievements/badge-system"
import { z } from "zod"

const awardBadgeSchema = z.object({
  userId: z.string(),
  badgeId: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // For now, only allow users to award badges to themselves
    // In a real app, you'd have admin permissions here
    const body = await request.json()
    const validatedData = awardBadgeSchema.parse(body)

    if (validatedData.userId !== session.user.id) {
      return NextResponse.json({ error: "Can only award badges to yourself" }, { status: 403 })
    }

    const success = await BadgeSystem.awardSpecialBadge(validatedData.userId, validatedData.badgeId)

    if (success) {
      const badgeDefinition = BadgeSystem.getBadgeDefinition(validatedData.badgeId)
      return NextResponse.json({
        success: true,
        message: `Badge "${badgeDefinition?.name}" awarded successfully!`,
        badge: badgeDefinition,
      })
    } else {
      return NextResponse.json({ error: "Failed to award badge" }, { status: 400 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Award badge error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
