import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

import { BadgeSystem, BADGE_DEFINITIONS } from "@/lib/achievements/badge-system"
import { UserService } from "@/lib/database/users"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const rarity = searchParams.get("rarity")

    let badges = BADGE_DEFINITIONS

    if (category) {
      badges = BadgeSystem.getBadgesByCategory(category as any)
    }

    if (rarity) {
      badges = BadgeSystem.getBadgesByRarity(rarity as any)
    }

    // Get user's earned badges
    const user = await UserService.findUserById(session.user.id)
    const earnedBadgeIds = user?.badges.map((badge) => badge.id) || []

    const badgesWithStatus = badges.map((badge) => ({
      ...badge,
      earned: earnedBadgeIds.includes(badge.id),
      earnedAt: user?.badges.find((b) => b.id === badge.id)?.earnedAt,
    }))

    return NextResponse.json({ badges: badgesWithStatus })
  } catch (error) {
    console.error("Get badges error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check for new badges
    const newBadges = await BadgeSystem.checkAndAwardBadges(session.user.id)

    return NextResponse.json({
      newBadges,
      message: newBadges.length > 0 ? `Congratulations! You earned ${newBadges.length} new badge(s)!` : "No new badges",
    })
  } catch (error) {
    console.error("Check badges error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
