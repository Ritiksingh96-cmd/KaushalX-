"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Clock, Pin, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

const forumCategories = [
  {
    id: "general",
    name: "General Discussion",
    description: "General topics and community discussions",
    topics: 156,
    posts: 1240,
    lastActivity: "2 hours ago",
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "skill-exchange",
    name: "Skill Exchange",
    description: "Find learning partners and skill exchanges",
    topics: 89,
    posts: 567,
    lastActivity: "1 hour ago",
    color: "bg-green-100 text-green-800",
  },
  {
    id: "tech-help",
    name: "Technical Help",
    description: "Get help with technical skills and problems",
    topics: 234,
    posts: 1890,
    lastActivity: "30 minutes ago",
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "career",
    name: "Career Advice",
    description: "Career guidance and professional development",
    topics: 67,
    posts: 445,
    lastActivity: "3 hours ago",
    color: "bg-orange-100 text-orange-800",
  },
]

const featuredTopics = [
  {
    id: "1",
    title: "Best practices for learning programming as a beginner",
    author: "Sarah Johnson",
    replies: 23,
    views: 456,
    lastReply: "1 hour ago",
    isPinned: true,
    category: "General Discussion",
  },
  {
    id: "2",
    title: "Looking for React mentor - willing to teach Python in exchange",
    author: "Mike Chen",
    replies: 8,
    views: 123,
    lastReply: "2 hours ago",
    isPinned: false,
    category: "Skill Exchange",
  },
  {
    id: "3",
    title: "How to debug JavaScript async/await issues?",
    author: "Alex Rodriguez",
    replies: 15,
    views: 289,
    lastReply: "45 minutes ago",
    isPinned: false,
    category: "Technical Help",
  },
]

const quickFilters = ["Announcements", "Skill Swaps", "Meetups", "Mentor Hours"]

const communityStats = [
  {
    label: "New topics today",
    value: "132",
    caption: "Fresh conversations sparked in the last 24h",
    icon: MessageSquare,
    accent: "bg-blue-500/15 text-blue-500",
  },
  {
    label: "Mentors active",
    value: "48",
    caption: "Experts currently replying and pairing",
    icon: Users,
    accent: "bg-purple-500/15 text-purple-500",
  },
  {
    label: "Avg reply time",
    value: "12m",
    caption: "Median SLA across the community",
    icon: Clock,
    accent: "bg-emerald-500/15 text-emerald-500",
  },
  {
    label: "Collabs in progress",
    value: "76",
    caption: "Skill swap threads with active deals",
    icon: TrendingUp,
    accent: "bg-amber-500/15 text-amber-500",
  },
]

export function ForumsOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border border-border/70 bg-gradient-to-br from-purple-500/10 via-background to-background overflow-hidden">
        <CardContent className="p-8 space-y-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <Badge variant="outline" className="rounded-full border-primary/40 text-primary px-4 py-1 w-fit">
                Community hub
              </Badge>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Community Forums</h1>
                <p className="text-muted-foreground">
                  Connect, learn, and share knowledge with builders across the globe.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="gap-2">
                <MessageSquare className="h-4 w-4" />
                New Topic
              </Button>
              <Button variant="outline" asChild className="gap-2">
                <Link href="/help">
                  Community Guidelines
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {quickFilters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="rounded-full bg-muted/60 text-muted-foreground border border-border/60 capitalize"
              >
                #{filter}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {communityStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border/60 bg-card/70 backdrop-blur">
              <CardContent className="p-6 space-y-3">
                <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${stat.accent}`}>
                  <Icon className="h-4 w-4" />
                  {stat.label}
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.caption}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Forum Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {forumCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <Badge className={category.color}>{category.topics} topics</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{category.posts} posts</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{category.lastActivity}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/forums/${category.id}`}>View</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Featured Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {featuredTopics.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {topic.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
                    <h3 className="font-medium hover:text-primary cursor-pointer">{topic.title}</h3>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>by {topic.author}</span>
                    <Badge variant="outline" className="text-xs">
                      {topic.category}
                    </Badge>
                    <span>{topic.views} views</span>
                    <span>Last reply {topic.lastReply}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">{topic.replies}</div>
                    <div className="text-xs text-muted-foreground">replies</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
