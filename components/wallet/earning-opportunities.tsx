"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Star, Gift, Clock, Target } from "lucide-react"
import Link from "next/link"

const earningOpportunities = [
  {
    title: "Teach a Skill Session",
    description: "Share your expertise and earn 15-50 credits per session",
    icon: BookOpen,
    credits: "15-50",
    action: "Start Teaching",
    href: "/dashboard/matches",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Complete Learning Goals",
    description: "Finish learning sessions to earn completion bonuses",
    icon: Target,
    credits: "10-30",
    action: "View Goals",
    href: "/dashboard",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Community Participation",
    description: "Help others in forums and discussions",
    icon: Users,
    credits: "5-20",
    action: "Join Forums",
    href: "/forums",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Daily Check-in Bonus",
    description: "Log in daily to earn streak bonuses",
    icon: Gift,
    credits: "5-25",
    action: "Claim Bonus",
    href: "/dashboard",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Skill Verification",
    description: "Get your skills verified by completing assessments",
    icon: Star,
    credits: "50-100",
    action: "Get Verified",
    href: "/profile",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    title: "Referral Program",
    description: "Invite friends and earn credits for each signup",
    icon: Users,
    credits: "100",
    action: "Invite Friends",
    href: "/referrals",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
]

export function EarningOpportunities() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Ways to Earn Credits</h3>
        <p className="text-sm text-muted-foreground">Discover different ways to earn credits on TamuPro</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {earningOpportunities.map((opportunity, index) => {
          const Icon = opportunity.icon
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${opportunity.bgColor}`}>
                    <Icon className={`h-6 w-6 ${opportunity.color}`} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{opportunity.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {opportunity.credits} credits
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                    <Button asChild size="sm" className="w-full">
                      <Link href={opportunity.href}>{opportunity.action}</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Clock className="h-8 w-8 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-900">Pro Tip</h4>
              <p className="text-sm text-blue-700">
                Teaching skills earns 50% more credits than learning. Share your expertise to maximize earnings!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
