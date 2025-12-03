import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

import { MatchingAlgorithm } from "@/lib/matching-algorithm"
import { z } from "zod"

const skillSOSSchema = z.object({
  skill: z.string().min(1, "Skill is required"),
  location: z.string().optional(),
  urgent: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = skillSOSSchema.parse(body)

    const sosMatches = await MatchingAlgorithm.findSkillSOS(validatedData.skill, validatedData.location)

    return NextResponse.json({
      matches: sosMatches,
      skill: validatedData.skill,
      urgent: validatedData.urgent,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Skill SOS error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
