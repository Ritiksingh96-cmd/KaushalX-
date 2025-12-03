import { BadgeShowcase } from "@/components/badges/badge-showcase"
import { auth } from "@/lib/auth"

import { redirect } from "next/navigation"

export default async function AchievementsPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Achievements & Badges</h1>
          <p className="text-muted-foreground">
            Track your progress and unlock badges as you learn and contribute to the community
          </p>
        </div>
        <BadgeShowcase />
      </div>
    </div>
  )
}
