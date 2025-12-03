import { auth } from "@/lib/auth"

import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { BLOCKCHAIN_CONFIG, isTestnetMode } from "@/lib/blockchain-config"

const cryptoPaymentSchema = z.object({
  skillId: z.string().min(1, "Skill ID is required"),
  amount: z.number().positive("Amount must be positive"),
  currency: z.enum(["ETH", "MATIC", "USDT", "KAUSHAL"]),
  paymentMethod: z.string().min(1, "Payment method is required"),
  walletAddress: z.string().min(1, "Wallet address is required"),
  network: z.enum(["ethereum", "polygon"]).default("ethereum"),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = cryptoPaymentSchema.parse(body)

    // Validate wallet address format
    if (!BLOCKCHAIN_CONFIG.isValidAddress(validatedData.walletAddress)) {
      return NextResponse.json(
        { error: "Invalid wallet address format" },
        { status: 400 }
      )
    }

    // Get current network configuration
    const currentNetwork = BLOCKCHAIN_CONFIG.getCurrentNetwork()
    const networkConfig = validatedData.network === "ethereum"
      ? currentNetwork.ethereum
      : currentNetwork.polygon

    // Generate transaction hash (in real app, integrate with blockchain)
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`

    // Create payment record
    const payment = {
      id: `payment_${Date.now()}`,
      userId: session.user.id,
      skillId: validatedData.skillId,
      amount: validatedData.amount,
      currency: validatedData.currency,
      paymentMethod: validatedData.paymentMethod,
      walletAddress: validatedData.walletAddress,
      network: validatedData.network,
      networkConfig: {
        chainId: networkConfig.chainId,
        name: networkConfig.name,
        isTestnet: isTestnetMode(),
      },
      transactionHash,
      blockExplorerUrl: BLOCKCHAIN_CONFIG.getTransactionUrl(
        transactionHash,
        validatedData.network
      ),
      status: "pending",
      createdAt: new Date().toISOString(),
      confirmedAt: null,
      blockchainConfirmations: 0,
    }

    // In real app:
    // 1. Save payment to database
    // 2. Monitor blockchain for transaction
    // 3. Update payment status when confirmed
    // 4. Enroll user in skill when payment is confirmed

    console.log("Crypto payment initiated:", payment)

    // Simulate blockchain confirmation (faster for testnet)
    const confirmationDelay = isTestnetMode() ? 3000 : 5000
    setTimeout(() => {
      console.log("Payment confirmed:", transactionHash)
      // Update payment status to "confirmed"
      // Enroll user in skill
      // Send confirmation email
    }, confirmationDelay)

    return NextResponse.json({
      success: true,
      payment,
      transactionHash,
      blockExplorerUrl: payment.blockExplorerUrl,
      message: isTestnetMode()
        ? "Testnet payment initiated successfully. This is a test transaction."
        : "Payment initiated successfully",
      testnetInfo: isTestnetMode() ? {
        faucets: BLOCKCHAIN_CONFIG.getFaucetUrls(validatedData.network),
        message: "You can get test tokens from the faucets listed above",
      } : null,
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

    console.error("Crypto payment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const transactionHash = searchParams.get("tx")
    const network = (searchParams.get("network") || "ethereum") as "ethereum" | "polygon"

    if (!transactionHash) {
      return NextResponse.json({ error: "Transaction hash required" }, { status: 400 })
    }

    // In real app, fetch payment status from database and blockchain
    const paymentStatus = {
      transactionHash,
      status: "confirmed",
      confirmations: isTestnetMode() ? 6 : 12,
      blockNumber: isTestnetMode() ? 5500000 : 18500000,
      gasUsed: "21000",
      gasPrice: isTestnetMode() ? "10000000000" : "20000000000",
      timestamp: new Date().toISOString(),
      network: network,
      isTestnet: isTestnetMode(),
      blockExplorerUrl: BLOCKCHAIN_CONFIG.getTransactionUrl(transactionHash, network),
    }

    return NextResponse.json({ paymentStatus })
  } catch (error) {
    console.error("Payment status fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
