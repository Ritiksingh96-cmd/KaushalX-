import { auth } from "@/lib/auth"

import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const createSkillSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  duration: z.string().min(1, "Duration is required"),
  price: z.string().min(1, "Price is required"),
  currency: z.enum(["KAUSHAL", "ETH", "BTC", "USDT"]),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed"),
  requirements: z.string().optional(),
  outcomes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createSkillSchema.parse(body)

    // Create skill in database
    const skill = {
      id: `skill_${Date.now()}`,
      instructorId: session.user.id,
      ...validatedData,
      price: Number.parseFloat(validatedData.price),
      createdAt: new Date(),
      studentsEnrolled: 0,
      rating: 0,
      status: "active",
    }

    // In a real app, save to database
    console.log("Creating skill:", skill)

    return NextResponse.json({
      success: true,
      skill,
      message: "Skill created successfully",
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    console.error("Skill creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
