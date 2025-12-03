import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  password?: string
  googleId?: string
  name: string
  avatar?: string
  bio?: string
  location?: string
  skills: {
    offered: string[]
    wanted: string[]
  }
  kaushalTokenBalance: number
  skillCredits: number
  level: number
  badges: Badge[]
  reputation: number
  sessionsCompleted: number
  memberSince: Date
  isVerified: boolean
  availability: {
    status: "available" | "busy" | "offline"
    schedule: {
      day: string
      hours: string[]
    }[]
  }
  preferences: {
    matchRadius: number
    notifications: {
      email: boolean
      push: boolean
      messages: boolean
    }
  }
  createdAt: Date
  updatedAt: Date
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: Date
  category: "skill" | "community" | "achievement" | "special"
}

export interface Skill {
  _id?: ObjectId
  name: string
  category: string
  description?: string
  difficulty: "beginner" | "intermediate" | "advanced" | "expert"
  tags: string[]
  createdAt: Date
}

export interface Match {
  _id?: ObjectId
  userId1: ObjectId
  userId2: ObjectId
  matchScore: number
  status: "pending" | "accepted" | "declined" | "completed"
  skillsExchanged: {
    user1Teaches: string[]
    user2Teaches: string[]
  }
  createdAt: Date
  updatedAt: Date
}
