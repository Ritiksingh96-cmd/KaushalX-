import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

import { getUserTransactions } from "@/lib/database/transactions"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const transactions = await getUserTransactions(new ObjectId(session.user.id), limit)

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
