import type { User } from "./models/User"
import { UserService } from "./database/users"

export interface MatchResult {
  user: User
  score: number
  reasons: string[]
  distance?: number
}

export class MatchingAlgorithm {
  private static calculateSkillMatch(user1: User, user2: User): { score: number; reasons: string[] } {
    const reasons: string[] = []
    let score = 0

    // Check if user1's wanted skills match user2's offered skills
    const user1WantsUser2Offers = user1.skills.wanted.filter((skill) => user2.skills.offered.includes(skill))

    // Check if user2's wanted skills match user1's offered skills
    const user2WantsUser1Offers = user2.skills.wanted.filter((skill) => user1.skills.offered.includes(skill))

    // Mutual skill exchange (highest weight)
    const mutualSkills = user1WantsUser2Offers.length + user2WantsUser1Offers.length
    if (mutualSkills > 0) {
      score += mutualSkills * 25
      reasons.push(`${mutualSkills} mutual skill exchange${mutualSkills > 1 ? "s" : ""}`)
    }

    // One-way skill match (medium weight)
    if (user1WantsUser2Offers.length > 0) {
      score += user1WantsUser2Offers.length * 15
      reasons.push(`Can teach you: ${user1WantsUser2Offers.join(", ")}`)
    }

    if (user2WantsUser1Offers.length > 0) {
      score += user2WantsUser1Offers.length * 15
      reasons.push(`Wants to learn: ${user2WantsUser1Offers.join(", ")}`)
    }

    return { score, reasons }
  }

  private static calculateCompatibilityScore(user1: User, user2: User): { score: number; reasons: string[] } {
    const reasons: string[] = []
    let score = 0

    // Reputation similarity (users with similar reputation tend to work well together)
    const reputationDiff = Math.abs(user1.reputation - user2.reputation)
    if (reputationDiff <= 1) {
      score += 10
      reasons.push("Similar reputation levels")
    }

    // Level compatibility
    const levelDiff = Math.abs(user1.level - user2.level)
    if (levelDiff <= 2) {
      score += 8
      reasons.push("Compatible experience levels")
    }

    // Activity level (based on sessions completed)
    if (user1.sessionsCompleted > 5 && user2.sessionsCompleted > 5) {
      score += 5
      reasons.push("Both are active learners")
    }

    // Verification status
    if (user1.isVerified && user2.isVerified) {
      score += 5
      reasons.push("Both verified users")
    }

    // Availability match
    if (user1.availability.status === "available" && user2.availability.status === "available") {
      score += 10
      reasons.push("Both currently available")
    }

    return { score, reasons }
  }

  private static calculateLocationScore(user1: User, user2: User): { score: number; reasons: string[] } {
    const reasons: string[] = []
    let score = 0

    if (user1.location && user2.location) {
      // Simple location matching (in a real app, you'd use geolocation)
      if (user1.location.toLowerCase() === user2.location.toLowerCase()) {
        score += 15
        reasons.push("Same location")
      } else if (
        user1.location.toLowerCase().includes(user2.location.toLowerCase()) ||
        user2.location.toLowerCase().includes(user1.location.toLowerCase())
      ) {
        score += 8
        reasons.push("Nearby location")
      }
    }

    return { score, reasons }
  }

  static async findMatches(userId: string, limit = 10): Promise<MatchResult[]> {
    const user = await UserService.findUserById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    // Get potential matches based on skills
    const potentialMatches = new Set<User>()

    // Find users who offer skills that this user wants
    for (const wantedSkill of user.skills.wanted) {
      const skillProviders = await UserService.findUsersBySkill(wantedSkill, userId)
      skillProviders.forEach((provider) => potentialMatches.add(provider))
    }

    // Find users who want skills that this user offers
    for (const offeredSkill of user.skills.offered) {
      const skillSeekers = await UserService.searchUsers(offeredSkill, {
        skills: [offeredSkill],
      })
      skillSeekers
        .filter((seeker) => seeker._id?.toString() !== userId)
        .forEach((seeker) => potentialMatches.add(seeker))
    }

    // Calculate match scores
    const matches: MatchResult[] = []

    for (const potentialMatch of potentialMatches) {
      const skillMatch = this.calculateSkillMatch(user, potentialMatch)
      const compatibilityMatch = this.calculateCompatibilityScore(user, potentialMatch)
      const locationMatch = this.calculateLocationScore(user, potentialMatch)

      const totalScore = skillMatch.score + compatibilityMatch.score + locationMatch.score
      const allReasons = [...skillMatch.reasons, ...compatibilityMatch.reasons, ...locationMatch.reasons]

      if (totalScore > 0) {
        matches.push({
          user: potentialMatch,
          score: totalScore,
          reasons: allReasons,
        })
      }
    }

    // Sort by score and return top matches
    const sortedMatches = matches.sort((a, b) => b.score - a.score).slice(0, limit)

    // Fallback: If no matches found, return active users
    if (sortedMatches.length === 0) {
      const activeUsers = await UserService.getRecentUsers(limit)
      return activeUsers
        .filter((u: User) => u._id?.toString() !== userId)
        .map((u: User) => ({
          user: u,
          score: 10,
          reasons: ["Active community member", "Explore new skills"],
        }))
    }

    return sortedMatches
  }

  static async findSkillSOS(skill: string, location?: string): Promise<MatchResult[]> {
    const availableUsers = await UserService.searchUsers(skill, {
      skills: [skill],
    })

    const sosMatches: MatchResult[] = availableUsers
      .filter((user) => user.availability.status === "available")
      .map((user) => ({
        user,
        score: user.reputation * 10 + (user.isVerified ? 20 : 0),
        reasons: [
          "Available for immediate help",
          `${user.reputation}/5 rating`,
          ...(user.isVerified ? ["Verified expert"] : []),
        ],
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    if (sosMatches.length === 0) {
      // Fallback: Find any available high-reputation users
      const allAvailable = await UserService.getAvailableUsers()
      return allAvailable
        .filter((u: User) => u.reputation > 4.0)
        .slice(0, 5)
        .map((user: User) => ({
          user,
          score: user.reputation * 10,
          reasons: ["High reputation expert", "Available for general help"],
        }))
    }

    return sosMatches
  }
}
