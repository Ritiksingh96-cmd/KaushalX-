import { MatchDashboard } from "@/components/matching/match-dashboard"
import { auth } from "@/lib/auth"

import { redirect } from "next/navigation"

export default async function MatchesPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MatchDashboard />
    </div>
  )
}
