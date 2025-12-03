import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/database/users"
import type { User } from "@/lib/models/User"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  location: z.string().optional(),
  bio: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await UserService.findUserByEmail(validatedData.email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    const newUser: Omit<User, "_id" | "createdAt" | "updatedAt"> = {
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
      bio: validatedData.bio || "",
      location: validatedData.location || "",
      skills: {
        offered: [],
        wanted: [],
      },
      skillCredits: 100, // Starting credits
      level: 1,
      badges: [
        {
          id: "welcome",
          name: "Welcome to TamuPro",
          description: "Joined the SkillSwap community",
          icon: "🎉",
          earnedAt: new Date(),
          category: "special",
        },
      ],
      reputation: 5.0,
      sessionsCompleted: 0,
      memberSince: new Date(),
      isVerified: false,
      availability: {
        status: "available",
        schedule: [],
      },
      preferences: {
        matchRadius: 50,
        notifications: {
          email: true,
          push: true,
          messages: true,
        },
      },
      kaushalTokenBalance: 20,
    }

    const createdUser = await UserService.createUser(newUser)

    // Remove password from response
    const { password, ...userResponse } = createdUser
    return NextResponse.json({ user: userResponse }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
