import type { ObjectId } from "mongodb"

export interface CreditTransaction {
  _id?: ObjectId
  userId: ObjectId
  type: "earned" | "spent" | "bonus" | "penalty"
  amount: number
  source:
  | "session_complete"
  | "badge_earned"
  | "skill_verified"
  | "daily_streak"
  | "quality_bonus"
  | "referral"
  | "manual"
  | "skill_purchase"
  | "video_upload"
  | "comment_helpful"
  description: string
  metadata?: {
    sessionId?: ObjectId
    badgeId?: string
    skillName?: string
    streakDays?: number
    rating?: number
    referredUserId?: ObjectId
    commentId?: string
  }
  createdAt: Date
}

export interface EarningRule {
  id: string
  name: string
  description: string
  type: "session" | "badge" | "skill" | "streak" | "community" | "quality"
  baseAmount: number
  multipliers?: {
    condition: string
    multiplier: number
  }[]
  requirements?: {
    minRating?: number
    minLevel?: number
    skillCategory?: string
    streakDays?: number
  }
}

export interface SkillEarningRate {
  skillName: string
  category: string
  baseRate: number
  demandMultiplier: number
  difficultyMultiplier: number
  lastUpdated: Date
}
