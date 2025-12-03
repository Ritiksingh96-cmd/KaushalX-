import { auth } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/database/users"
import { z } from "zod"

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  skills: z.object({
    offered: z.array(z.string()).max(20, "Too many offered skills").default([]),
    wanted: z.array(z.string()).max(20, "Too many wanted skills").default([]),
  }).optional(),
  availability: z.object({
    status: z.enum(["available", "busy", "offline"]).default("available"),
    schedule: z.array(z.object({
      day: z.string(),
      hours: z.array(z.string()),
    })).default([]),
  }).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await UserService.findUserById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove sensitive data
    const { password, ...userProfile } = user
    return NextResponse.json({ user: userProfile })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    const updatedUser = await UserService.updateUser(session.user.id, validatedData)
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove sensitive data
    const { password, ...userProfile } = updatedUser
    return NextResponse.json({ user: userProfile })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
