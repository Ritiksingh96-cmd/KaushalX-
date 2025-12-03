import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

import { MatchingAlgorithm } from "@/lib/matching-algorithm"
import { z } from "zod"

const findMatchesSchema = z.object({
  limit: z.number().min(1).max(50).optional().default(10),
  skills: z.array(z.string()).optional(),
  location: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skills = searchParams.get("skills")?.split(",") || []
    const location = searchParams.get("location") || undefined

    const validatedParams = findMatchesSchema.parse({
      limit,
      skills: skills.length > 0 ? skills : undefined,
      location,
    })

    const matches = await MatchingAlgorithm.findMatches(session.user.id, validatedParams.limit)

    return NextResponse.json({ matches })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Find matches error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = findMatchesSchema.parse(body)

    const matches = await MatchingAlgorithm.findMatches(session.user.id, validatedData.limit)

    return NextResponse.json({ matches })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Find matches error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
