"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Bot, Search, BookOpen, Users, MessageCircle, Trophy, Upload, Zap, HelpCircle, Lightbulb } from "lucide-react"
import { AIChatTrigger } from "@/components/ai-chat/ai-chat-trigger"

const helpCategories = [
  {
    title: "Getting Started",
    icon: BookOpen,
    topics: [
      "How to create your profile",
      "Finding your first skill partner",
      "Understanding the matching system",
      "Setting up your learning goals",
    ],
  },
  {
    title: "Skill Matching",
    icon: Zap,
    topics: [
      "How the AI matching works",
      "Improving your match quality",
      "Using Skill SOS feature",
      "Managing your skill preferences",
    ],
  },
  {
    title: "Communication",
    icon: MessageCircle,
    topics: ["Starting conversations", "Video call features", "File sharing in messages", "Managing notifications"],
  },
  {
    title: "Content & Videos",
    icon: Upload,
    topics: [
      "Uploading learning videos",
      "Video quality guidelines",
      "Adding descriptions and tags",
      "Managing your content library",
    ],
  },
  {
    title: "Achievements",
    icon: Trophy,
    topics: [
      "Understanding the badge system",
      "How to earn achievements",
      "Tracking your progress",
      "Sharing accomplishments",
    ],
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredCategories = helpCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Help Center</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get help with TamuPro features, find answers to common questions, or chat with our AI assistant
        </p>
      </div>

      {/* AI Assistant Highlight */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">TamuPro AI Assistant</h3>
              <p className="text-muted-foreground">
                Get instant help with personalized guidance. Our AI assistant knows all about TamuPro features and can
                help you succeed.
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">Available 24/7</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for help topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>
      </div>

      {/* Help Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => {
          const Icon = category.icon
          return (
            <Card key={category.title} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <span>{category.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.topics.map((topic, index) => (
                    <li
                      key={index}
                      className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                    >
                      • {topic}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2 bg-transparent">
              <Users className="h-6 w-6" />
              <span className="text-sm">Find Skill Partners</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2 bg-transparent">
              <Upload className="h-6 w-6" />
              <span className="text-sm">Upload Content</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2 bg-transparent">
              <Trophy className="h-6 w-6" />
              <span className="text-sm">View Achievements</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2 bg-transparent">
              <MessageCircle className="h-6 w-6" />
              <span className="text-sm">Start Messaging</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Chat Trigger */}
      <AIChatTrigger />
    </div>
  )
}
