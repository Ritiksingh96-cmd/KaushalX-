import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

import { createCryptoConversion } from "@/lib/database/transactions"
import { getUserById } from "@/lib/database/users"
import { ObjectId } from "mongodb"

// Mock crypto conversion rates (in a real app, fetch from crypto API)
const CRYPTO_RATES = {
  BTC: 0.000023, // 1 credit = 0.000023 BTC
  ETH: 0.00035, // 1 credit = 0.00035 ETH
  USDT: 0.01, // 1 credit = 0.01 USDT
  BNB: 0.000045, // 1 credit = 0.000045 BNB
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { creditsAmount, cryptoType, walletAddress } = await request.json()

    if (!creditsAmount || !cryptoType || !walletAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (creditsAmount < 100) {
      return NextResponse.json({ error: "Minimum conversion is 100 credits" }, { status: 400 })
    }

    const user = await getUserById(new ObjectId(session.user.id))
    if (!user || user.skillCredits < creditsAmount) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 })
    }

    const conversionRate = CRYPTO_RATES[cryptoType as keyof typeof CRYPTO_RATES]
    if (!conversionRate) {
      return NextResponse.json({ error: "Unsupported crypto type" }, { status: 400 })
    }

    const cryptoAmount = creditsAmount * conversionRate

    const conversion = await createCryptoConversion({
      userId: new ObjectId(session.user.id),
      creditsAmount,
      cryptoType: cryptoType as "BTC" | "ETH" | "USDT" | "BNB",
      cryptoAmount,
      conversionRate,
      walletAddress,
      status: "pending",
    })

    return NextResponse.json({
      success: true,
      conversion,
      message: "Conversion request submitted. Processing may take 24-48 hours.",
    })
  } catch (error) {
    console.error("Error creating crypto conversion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
