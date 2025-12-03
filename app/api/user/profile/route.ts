import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

import { UserService } from "@/lib/database/users"
import { z } from "zod"

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  skills: z
    .object({
      offered: z.array(z.string()),
      wanted: z.array(z.string()),
    })
    .optional(),
  availability: z
    .object({
      status: z.enum(["available", "busy", "offline"]),
      schedule: z.array(
        z.object({
          day: z.string(),
          hours: z.array(z.string()),
        }),
      ),
    })
    .optional(),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await UserService.findUserById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password from response
    const { password, ...userResponse } = user
    return NextResponse.json({ user: userResponse })
  } catch (error) {
    console.error("Get profile error:", error)
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

    // Remove password from response
    const { password, ...userResponse } = updatedUser
    return NextResponse.json({ user: userResponse })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
