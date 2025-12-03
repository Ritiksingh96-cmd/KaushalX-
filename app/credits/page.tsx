import type { Metadata } from "next"
import CreditDashboard from "@/components/credits/credit-dashboard"

export const metadata: Metadata = {
  title: "Credit Dashboard - TamuPro",
  description: "Manage your skill credits and track your earnings",
}

export default function CreditsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Credit Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your earnings, manage your credits, and discover new ways to earn
        </p>
      </div>

      <CreditDashboard />
    </div>
  )
}
