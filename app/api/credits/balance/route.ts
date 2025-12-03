import { auth } from "@/lib/auth"

import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/database/users"
import { CreditService } from "@/lib/database/credits"

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

    const transactions = await CreditService.getUserTransactions(session.user.id, 10)

    return NextResponse.json({
      balance: user.skillCredits,
      level: user.level,
      transactions: transactions,
    })
  } catch (error) {
    console.error("Credit balance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
