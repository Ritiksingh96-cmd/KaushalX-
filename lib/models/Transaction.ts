import type { ObjectId } from "mongodb"

export interface Transaction {
  _id?: ObjectId
  userId: ObjectId
  type: "earn" | "spend" | "convert" | "bonus" | "penalty"
  amount: number
  description: string
  category:
    | "skill_teaching"
    | "skill_learning"
    | "completion_bonus"
    | "referral"
    | "crypto_conversion"
    | "badge_reward"
    | "daily_bonus"
  relatedId?: ObjectId // Related skill session, match, or badge ID
  metadata?: {
    skillName?: string
    sessionDuration?: number
    matchId?: ObjectId
    conversionRate?: number
    cryptoType?: string
    cryptoAmount?: number
  }
  status: "pending" | "completed" | "failed"
  createdAt: Date
  updatedAt: Date
}

export interface CryptoConversion {
  _id?: ObjectId
  userId: ObjectId
  creditsAmount: number
  cryptoType: "BTC" | "ETH" | "USDT" | "BNB"
  cryptoAmount: number
  conversionRate: number
  walletAddress: string
  status: "pending" | "processing" | "completed" | "failed"
  transactionHash?: string
  createdAt: Date
  updatedAt: Date
}

export interface EarningRule {
  _id?: ObjectId
  action: string
  creditsEarned: number
  description: string
  category: "teaching" | "learning" | "community" | "achievement"
  isActive: boolean
  createdAt: Date
}
