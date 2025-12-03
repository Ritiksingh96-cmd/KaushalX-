declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      skillCredits: number
      level: number
      isVerified: boolean
    }
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    skillCredits?: number
    level?: number
    isVerified?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    skillCredits: number
    level: number
    isVerified: boolean
  }
}
