import { UserService } from "../database/users"
import type { Badge } from "../models/User"
import type { ObjectId } from "mongodb"
import { CreditService } from "../database/credits"

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: string
  category: "skill" | "community" | "achievement" | "special"
  criteria: {
    type: "sessions" | "rating" | "skills" | "videos" | "comments" | "matches" | "special"
    threshold?: number
    value?: string | string[]
  }
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  points: number
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Welcome & Onboarding
  {
    id: "welcome",
    name: "Welcome to TamuPro",
    description: "Joined the SkillSwap community",
    icon: "🎉",
    category: "special",
    criteria: { type: "special" },
    rarity: "common",
    points: 10,
  },
  {
    id: "profile_complete",
    name: "Profile Master",
    description: "Completed your profile with bio, skills, and photo",
    icon: "✨",
    category: "achievement",
    criteria: { type: "special" },
    rarity: "common",
    points: 25,
  },

  // Session Achievements
  {
    id: "first_session",
    name: "First Steps",
    description: "Completed your first learning session",
    icon: "🚀",
    category: "achievement",
    criteria: { type: "sessions", threshold: 1 },
    rarity: "common",
    points: 50,
  },
  {
    id: "session_novice",
    name: "Learning Enthusiast",
    description: "Completed 5 learning sessions",
    icon: "📚",
    category: "achievement",
    criteria: { type: "sessions", threshold: 5 },
    rarity: "common",
    points: 100,
  },
  {
    id: "session_expert",
    name: "Knowledge Seeker",
    description: "Completed 25 learning sessions",
    icon: "🎓",
    category: "achievement",
    criteria: { type: "sessions", threshold: 25 },
    rarity: "uncommon",
    points: 250,
  },
  {
    id: "session_master",
    name: "Learning Master",
    description: "Completed 100 learning sessions",
    icon: "🏆",
    category: "achievement",
    criteria: { type: "sessions", threshold: 100 },
    rarity: "rare",
    points: 500,
  },

  // Rating Achievements
  {
    id: "highly_rated",
    name: "Highly Rated",
    description: "Maintained a 4.5+ star rating",
    icon: "⭐",
    category: "achievement",
    criteria: { type: "rating", threshold: 4.5 },
    rarity: "uncommon",
    points: 200,
  },
  {
    id: "perfect_rating",
    name: "Perfect Teacher",
    description: "Achieved a perfect 5.0 star rating",
    icon: "🌟",
    category: "achievement",
    criteria: { type: "rating", threshold: 5.0 },
    rarity: "epic",
    points: 1000,
  },

  // Skill Achievements
  {
    id: "skill_collector",
    name: "Skill Collector",
    description: "Added 10 skills to your profile",
    icon: "🎯",
    category: "skill",
    criteria: { type: "skills", threshold: 10 },
    rarity: "common",
    points: 75,
  },
  {
    id: "polymath",
    name: "Polymath",
    description: "Master of 25+ skills",
    icon: "🧠",
    category: "skill",
    criteria: { type: "skills", threshold: 25 },
    rarity: "rare",
    points: 400,
  },

  // Community Achievements
  {
    id: "helpful_commenter",
    name: "Helpful Commenter",
    description: "Posted 50 helpful comments",
    icon: "💬",
    category: "community",
    criteria: { type: "comments", threshold: 50 },
    rarity: "uncommon",
    points: 150,
  },
  {
    id: "video_creator",
    name: "Content Creator",
    description: "Uploaded 10 tutorial videos",
    icon: "🎬",
    category: "community",
    criteria: { type: "videos", threshold: 10 },
    rarity: "uncommon",
    points: 300,
  },
  {
    id: "match_maker",
    name: "Perfect Match",
    description: "Found 20 successful skill matches",
    icon: "💝",
    category: "community",
    criteria: { type: "matches", threshold: 20 },
    rarity: "rare",
    points: 350,
  },

  // Special Achievements
  {
    id: "early_adopter",
    name: "Early Adopter",
    description: "One of the first 1000 users",
    icon: "🏅",
    category: "special",
    criteria: { type: "special" },
    rarity: "legendary",
    points: 2000,
  },
  {
    id: "verified_expert",
    name: "Verified Expert",
    description: "Verified as a skill expert",
    icon: "✅",
    category: "special",
    criteria: { type: "special" },
    rarity: "epic",
    points: 750,
  },

  // Skill-Specific Badges
  {
    id: "programming_guru",
    name: "Programming Guru",
    description: "Expert in programming languages",
    icon: "💻",
    category: "skill",
    criteria: { type: "special", value: ["JavaScript", "Python", "React", "Node.js"] },
    rarity: "rare",
    points: 500,
  },
  {
    id: "design_master",
    name: "Design Master",
    description: "Master of design and creativity",
    icon: "🎨",
    category: "skill",
    criteria: { type: "special", value: ["UI/UX Design", "Graphic Design", "Figma", "Photoshop"] },
    rarity: "rare",
    points: 500,
  },
  {
    id: "language_polyglot",
    name: "Language Polyglot",
    description: "Speaks multiple languages fluently",
    icon: "🌍",
    category: "skill",
    criteria: { type: "special", value: ["Spanish", "French", "German", "Mandarin", "Japanese"] },
    rarity: "epic",
    points: 800,
  },
]

export class BadgeSystem {
  static async checkAndAwardBadges(userId: string | ObjectId): Promise<Badge[]> {
    const user = await UserService.findUserById(userId)
    if (!user) return []

    const newBadges: Badge[] = []
    const existingBadgeIds = user.badges.map((badge) => badge.id)

    for (const badgeDefinition of BADGE_DEFINITIONS) {
      // Skip if user already has this badge
      if (existingBadgeIds.includes(badgeDefinition.id)) continue

      const shouldAward = await this.checkBadgeCriteria(user, badgeDefinition)
      if (shouldAward) {
        const badge: Badge = {
          id: badgeDefinition.id,
          name: badgeDefinition.name,
          description: badgeDefinition.description,
          icon: badgeDefinition.icon,
          earnedAt: new Date(),
          category: badgeDefinition.category,
        }

        await UserService.addBadgeToUser(userId, badge)
        newBadges.push(badge)

        await CreditService.processBadgeEarned(userId, badgeDefinition.id, badgeDefinition.points)
      }
    }

    return newBadges
  }

  private static async checkBadgeCriteria(user: any, badgeDefinition: BadgeDefinition): Promise<boolean> {
    const { criteria } = badgeDefinition

    switch (criteria.type) {
      case "sessions":
        return user.sessionsCompleted >= (criteria.threshold || 0)

      case "rating":
        return user.reputation >= (criteria.threshold || 0)

      case "skills":
        const totalSkills = user.skills.offered.length + user.skills.wanted.length
        return totalSkills >= (criteria.threshold || 0)

      case "special":
        // Special badges are awarded manually or through specific events
        return false

      default:
        return false
    }
  }

  static async awardSpecialBadge(userId: string | ObjectId, badgeId: string): Promise<boolean> {
    const badgeDefinition = BADGE_DEFINITIONS.find((badge) => badge.id === badgeId)
    if (!badgeDefinition) return false

    const user = await UserService.findUserById(userId)
    if (!user) return false

    // Check if user already has this badge
    const existingBadgeIds = user.badges.map((badge) => badge.id)
    if (existingBadgeIds.includes(badgeId)) return false

    const badge: Badge = {
      id: badgeDefinition.id,
      name: badgeDefinition.name,
      description: badgeDefinition.description,
      icon: badgeDefinition.icon,
      earnedAt: new Date(),
      category: badgeDefinition.category,
    }

    const success = await UserService.addBadgeToUser(userId, badge)

    if (success) {
      await CreditService.processBadgeEarned(userId, badgeDefinition.id, badgeDefinition.points)
    }

    return success
  }

  static getBadgeDefinition(badgeId: string): BadgeDefinition | undefined {
    return BADGE_DEFINITIONS.find((badge) => badge.id === badgeId)
  }

  static getBadgesByCategory(category: Badge["category"]): BadgeDefinition[] {
    return BADGE_DEFINITIONS.filter((badge) => badge.category === category)
  }

  static getBadgesByRarity(rarity: BadgeDefinition["rarity"]): BadgeDefinition[] {
    return BADGE_DEFINITIONS.filter((badge) => badge.rarity === rarity)
  }

  static calculateUserScore(badges: Badge[]): number {
    return badges.reduce((total, badge) => {
      const definition = this.getBadgeDefinition(badge.id)
      return total + (definition?.points || 0)
    }, 0)
  }
}
