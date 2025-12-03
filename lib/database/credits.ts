import { getDatabase } from "../mongodb"
import type { CreditTransaction, SkillEarningRate } from "../models/CreditTransaction"
import { ObjectId } from "mongodb"
import { UserService } from "./users"

export class CreditService {
  private static async getTransactionCollection() {
    const db = await getDatabase()
    return db.collection<CreditTransaction>("credit_transactions")
  }

  private static async getSkillRatesCollection() {
    const db = await getDatabase()
    return db.collection<SkillEarningRate>("skill_earning_rates")
  }

  // Core credit operations
  static async addCredits(
    userId: string | ObjectId,
    amount: number,
    source: CreditTransaction["source"],
    description: string,
    metadata?: CreditTransaction["metadata"],
  ): Promise<boolean> {
    const collection = await this.getTransactionCollection()
    const objectId = typeof userId === "string" ? new ObjectId(userId) : userId

    // Create transaction record
    const transaction: CreditTransaction = {
      userId: objectId,
      type: "earned",
      amount,
      source,
      description,
      metadata,
      createdAt: new Date(),
    }

    await collection.insertOne(transaction)

    // Update user's credit balance
    const user = await UserService.findUserById(userId)
    if (user) {
      await UserService.updateUser(userId, {
        skillCredits: user.skillCredits + amount,
      })
      return true
    }
    return false
  }

  static async spendCredits(
    userId: string | ObjectId,
    amount: number,
    source: CreditTransaction["source"],
    description: string,
    metadata?: CreditTransaction["metadata"],
  ): Promise<boolean> {
    const user = await UserService.findUserById(userId)
    if (!user || user.skillCredits < amount) {
      return false
    }

    const collection = await this.getTransactionCollection()
    const objectId = typeof userId === "string" ? new ObjectId(userId) : userId

    // Create transaction record
    const transaction: CreditTransaction = {
      userId: objectId,
      type: "spent",
      amount,
      source,
      description,
      metadata,
      createdAt: new Date(),
    }

    await collection.insertOne(transaction)

    // Update user's credit balance
    await UserService.updateUser(userId, {
      skillCredits: user.skillCredits - amount,
    })

    return true
  }

  // Session-based earning
  static async processSessionCompletion(
    teacherId: string | ObjectId,
    learnerId: string | ObjectId,
    skillName: string,
    rating: number,
    sessionDuration: number,
  ): Promise<void> {
    const skillRate = await this.getSkillEarningRate(skillName)
    const baseAmount = skillRate ? skillRate.baseRate : 20

    // Calculate earnings based on rating and duration
    let earnings = baseAmount

    // Quality bonus for high ratings
    if (rating >= 4.5) {
      earnings *= 1.5
    } else if (rating >= 4.0) {
      earnings *= 1.2
    }

    // Duration bonus (per 30-minute session)
    const sessionMultiplier = Math.max(1, sessionDuration / 30)
    earnings = Math.round(earnings * sessionMultiplier)

    await this.addCredits(teacherId, earnings, "session_complete", `Taught ${skillName} - ${rating}⭐ rating`, {
      skillName,
      rating,
      sessionId: new ObjectId(),
    })

    // Learner gets a small completion bonus
    await this.addCredits(learnerId, 5, "session_complete", `Completed learning ${skillName}`, { skillName, rating })
  }

  // Badge earning rewards
  static async processBadgeEarned(userId: string | ObjectId, badgeId: string, badgePoints: number): Promise<void> {
    const creditReward = Math.round(badgePoints / 10) // Convert badge points to credits

    await this.addCredits(userId, creditReward, "badge_earned", `Earned badge: ${badgeId}`, { badgeId })
  }

  // Daily streak bonuses
  static async processDailyStreak(userId: string | ObjectId, streakDays: number): Promise<void> {
    let bonus = 0

    if (streakDays >= 30) bonus = 50
    else if (streakDays >= 14) bonus = 25
    else if (streakDays >= 7) bonus = 15
    else if (streakDays >= 3) bonus = 10
    else if (streakDays >= 1) bonus = 5

    if (bonus > 0) {
      await this.addCredits(userId, bonus, "daily_streak", `${streakDays} day learning streak!`, { streakDays })
    }
  }

  // Skill verification rewards
  static async processSkillVerification(userId: string | ObjectId, skillName: string, category: string): Promise<void> {
    const baseReward = 30
    const categoryMultipliers: Record<string, number> = {
      Programming: 1.5,
      Design: 1.3,
      Languages: 1.2,
      Music: 1.1,
      default: 1.0,
    }

    const multiplier = categoryMultipliers[category] || categoryMultipliers.default
    const reward = Math.round(baseReward * multiplier)

    await this.addCredits(userId, reward, "skill_verified", `Verified skill: ${skillName}`, { skillName })
  }

  // Community contribution rewards
  static async processVideoUpload(userId: string | ObjectId, videoTitle: string): Promise<void> {
    await this.addCredits(userId, 15, "video_upload", `Uploaded tutorial: ${videoTitle}`)
  }

  static async processHelpfulComment(userId: string | ObjectId, commentId: string): Promise<void> {
    await this.addCredits(userId, 3, "comment_helpful", "Posted helpful comment", { commentId })
  }

  // Skill earning rates management
  static async getSkillEarningRate(skillName: string): Promise<SkillEarningRate | null> {
    const collection = await this.getSkillRatesCollection()
    return await collection.findOne({ skillName })
  }

  static async updateSkillEarningRates(): Promise<void> {
    // This would typically analyze demand/supply and update rates
    // For now, we'll set some default rates
    const collection = await this.getSkillRatesCollection()

    const defaultRates: Omit<SkillEarningRate, "_id">[] = [
      {
        skillName: "JavaScript",
        category: "Programming",
        baseRate: 25,
        demandMultiplier: 1.3,
        difficultyMultiplier: 1.2,
        lastUpdated: new Date(),
      },
      {
        skillName: "Python",
        category: "Programming",
        baseRate: 30,
        demandMultiplier: 1.5,
        difficultyMultiplier: 1.3,
        lastUpdated: new Date(),
      },
      {
        skillName: "React",
        category: "Programming",
        baseRate: 35,
        demandMultiplier: 1.4,
        difficultyMultiplier: 1.4,
        lastUpdated: new Date(),
      },
      {
        skillName: "UI/UX Design",
        category: "Design",
        baseRate: 28,
        demandMultiplier: 1.2,
        difficultyMultiplier: 1.1,
        lastUpdated: new Date(),
      },
      {
        skillName: "Spanish",
        category: "Languages",
        baseRate: 20,
        demandMultiplier: 1.1,
        difficultyMultiplier: 1.0,
        lastUpdated: new Date(),
      },
      {
        skillName: "Guitar",
        category: "Music",
        baseRate: 18,
        demandMultiplier: 1.0,
        difficultyMultiplier: 1.0,
        lastUpdated: new Date(),
      },
    ]

    for (const rate of defaultRates) {
      await collection.updateOne({ skillName: rate.skillName }, { $set: rate }, { upsert: true })
    }
  }

  // Transaction history
  static async getUserTransactions(userId: string | ObjectId, limit = 50, offset = 0): Promise<CreditTransaction[]> {
    const collection = await this.getTransactionCollection()
    const objectId = typeof userId === "string" ? new ObjectId(userId) : userId

    return await collection.find({ userId: objectId }).sort({ createdAt: -1 }).skip(offset).limit(limit).toArray()
  }

  // Analytics
  static async getUserEarningStats(userId: string | ObjectId): Promise<{
    totalEarned: number
    totalSpent: number
    currentBalance: number
    topEarningSources: { source: string; amount: number }[]
    monthlyEarnings: { month: string; amount: number }[]
  }> {
    const collection = await this.getTransactionCollection()
    const objectId = typeof userId === "string" ? new ObjectId(userId) : userId

    const transactions = await collection.find({ userId: objectId }).toArray()

    const totalEarned = transactions.filter((t) => t.type === "earned").reduce((sum, t) => sum + t.amount, 0)

    const totalSpent = transactions.filter((t) => t.type === "spent").reduce((sum, t) => sum + t.amount, 0)

    const user = await UserService.findUserById(userId)
    const currentBalance = user?.skillCredits || 0

    // Top earning sources
    const sourceMap = new Map<string, number>()
    transactions
      .filter((t) => t.type === "earned")
      .forEach((t) => {
        sourceMap.set(t.source, (sourceMap.get(t.source) || 0) + t.amount)
      })

    const topEarningSources = Array.from(sourceMap.entries())
      .map(([source, amount]) => ({ source, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    // Monthly earnings (last 6 months)
    const monthlyMap = new Map<string, number>()
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    transactions
      .filter((t) => t.type === "earned" && t.createdAt >= sixMonthsAgo)
      .forEach((t) => {
        const month = t.createdAt.toISOString().slice(0, 7) // YYYY-MM
        monthlyMap.set(month, (monthlyMap.get(month) || 0) + t.amount)
      })

    const monthlyEarnings = Array.from(monthlyMap.entries())
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month))

    return {
      totalEarned,
      totalSpent,
      currentBalance,
      topEarningSources,
      monthlyEarnings,
    }
  }
}
