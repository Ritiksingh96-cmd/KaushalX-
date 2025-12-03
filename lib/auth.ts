import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { UserService } from "./database/users"
import bcrypt from "bcryptjs"



const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Skip database operations if SKIP_DATABASE is set
          if (process.env.SKIP_DATABASE === "true") {
            return null;
          }

          if (!credentials?.email || !credentials?.password) {
            return null
          }
          const user = await UserService.findUserByEmail(credentials.email as string)
          if (!user || !user.password) {
            return null
          }
          const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password)
          if (!isPasswordValid) {
            return null
          }
          return { id: user._id!.toString(), email: user.email, name: user.name }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      try {
        // Skip database operations if SKIP_DATABASE is set
        if (process.env.SKIP_DATABASE === "true") {
          return true
        }

        if (account?.provider === "google") {
          const existingUser = await UserService.findUserByEmail(user.email!)
          if (!existingUser) {
            await UserService.createUser({
              email: user.email!,
              googleId: user.id,
              name: user.name!,
              avatar: user.image,
              bio: "",
              location: "",
              skills: { offered: [], wanted: [] },
              kaushalTokenBalance: user.email === "rs7267216@gmail.com" ? 1_000_000_000 : 20,
              skillCredits: 100,
              level: 1,
              badges: [
                {
                  id: "welcome",
                  name: "Welcome to KushalX",
                  description: "Joined the SkillSwap community",
                  icon: "🎉",
                  earnedAt: new Date(),
                  category: "special",
                },
              ],
              reputation: 5.0,
              sessionsCompleted: 0,
              memberSince: new Date(),
              isVerified: false,
              availability: { status: "available", schedule: [] },
              preferences: {
                matchRadius: 50,
                notifications: { email: true, push: true, messages: true },
              },
              password: undefined,
            })
          }
        }
        return true
      } catch (error) {
        console.error("Sign-in error:", error)
        return true
      }
    },
    jwt({ token, user }: any) {
      if (user) token.userId = user.id
      return token
    },
    session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.userId as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}

// Handle NextAuth import for both CommonJS and ESM
const nextAuthFn = (NextAuth as any).default || NextAuth
export const { handlers, auth, signIn, signOut } = nextAuthFn(authConfig)