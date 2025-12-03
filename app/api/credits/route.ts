import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { CreditService } from "@/lib/database/credits"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")

    if (action === "transactions") {
      const limit = Number.parseInt(searchParams.get("limit") || "50")
      const offset = Number.parseInt(searchParams.get("offset") || "0")

      const transactions = await CreditService.getUserTransactions(session.user.id, limit, offset)
      return NextResponse.json({ transactions })
    }

    if (action === "stats") {
      const stats = await CreditService.getUserEarningStats(session.user.id)
      return NextResponse.json({ stats })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Credits API error:", error)
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
    const { action, amount, source, description, metadata } = body

    if (action === "spend") {
      const success = await CreditService.spendCredits(session.user.id, amount, source, description, metadata)

      if (!success) {
        return NextResponse.json({ error: "Insufficient credits" }, { status: 400 })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Credits API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
