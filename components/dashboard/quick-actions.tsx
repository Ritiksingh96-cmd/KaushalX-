"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, MessageSquare, Search, Wallet, Video } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Find Matches",
      description: "Discover skill partners",
      icon: Search,
      href: "/dashboard/matches",
      color: "text-blue-600",
    },
    {
      title: "Start Teaching",
      description: "Share your expertise",
      icon: BookOpen,
      href: "/teach",
      color: "text-green-600",
    },
    {
      title: "Join Community",
      description: "Connect with learners",
      icon: Users,
      href: "/community",
      color: "text-purple-600",
    },
    {
      title: "Messages",
      description: "Chat with partners",
      icon: MessageSquare,
      href: "/messages",
      color: "text-orange-600",
    },
    {
      title: "Upload Content",
      description: "Share learning content",
      icon: Video,
      href: "/library/upload",
      color: "text-red-600",
    },
    {
      title: "Crypto Wallet",
      description: "Manage assets",
      icon: Wallet,
      href: "/crypto",
      color: "text-yellow-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                asChild
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              >
                <Link href={action.href}>
                  <Icon className={`h-6 w-6 ${action.color}`} />
                  <div className="text-center">
                    <div className="text-sm font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
