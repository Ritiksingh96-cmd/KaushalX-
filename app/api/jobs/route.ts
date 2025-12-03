import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { JobService } from "@/lib/database/jobs"
import { z } from "zod"

const createJobSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    budget: z.number().positive("Budget must be positive"),
    currency: z.enum(["INR", "ETH", "MATIC"]),
    skillsRequired: z.array(z.string()).min(1, "At least one skill required"),
})

export async function GET() {
    try {
        const jobs = await JobService.getJobs(20)
        return NextResponse.json({ jobs })
    } catch (error) {
        console.error("Get jobs error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await request.json()
        const validatedData = createJobSchema.parse(body)

        const job = await JobService.createJob({
            ...validatedData,
            postedBy: {
                userId: session.user.id!,
                name: session.user.name || "Anonymous",
                avatar: session.user.image || undefined,
            },
            status: "open",
        })

        return NextResponse.json({ job }, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
        }

        console.error("Create job error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
