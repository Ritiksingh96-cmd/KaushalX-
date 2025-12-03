"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Coins, Star, Clock, Users, Search, TrendingUp, Award, Play, Zap } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { motion } from "framer-motion"

interface SkillListing {
  id: string
  title: string
  description: string
  instructor: {
    name: string
    avatar: string
    rating: number
    totalStudents: number
  }
  price: number
  currency: "KAUSHAL" | "ETH" | "BTC"
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  category: string
  tags: string[]
  studentsEnrolled: number
  earnings: number
  videoUrl?: string
  hasVideo: boolean
}

const mockSkills: SkillListing[] = [
  {
    id: "1",
    title: "React Development Mastery",
    description: "Learn modern React with hooks, context, and best practices. Build real-world projects.",
    instructor: {
      name: "Priya Sharma",
      avatar: "/indian-woman-developer.png",
      rating: 4.9,
      totalStudents: 1250,
    },
    price: 500,
    currency: "KAUSHAL",
    duration: "8 weeks",
    difficulty: "Intermediate",
    category: "Programming",
    tags: ["React", "JavaScript", "Frontend"],
    studentsEnrolled: 89,
    earnings: 44500,
    hasVideo: true,
    videoUrl: "/videos/react-intro.mp4",
  },
  {
    id: "2",
    title: "Blockchain Development",
    description: "Build decentralized applications with Solidity and Web3. Create your own DeFi protocols.",
    instructor: {
      name: "Arjun Patel",
      avatar: "/placeholder-nrad2.png",
      rating: 4.8,
      totalStudents: 890,
    },
    price: 0.05,
    currency: "ETH",
    duration: "12 weeks",
    difficulty: "Advanced",
    category: "Blockchain",
    tags: ["Solidity", "Web3", "DeFi"],
    studentsEnrolled: 45,
    earnings: 2.25,
    hasVideo: true,
    videoUrl: "/videos/blockchain-basics.mp4",
  },
  {
    id: "3",
    title: "Digital Marketing Strategy",
    description:
      "Master social media marketing and growth hacking for Indian market. Instagram, YouTube, WhatsApp marketing.",
    instructor: {
      name: "Sneha Gupta",
      avatar: "/placeholder-hfogf.png",
      rating: 4.7,
      totalStudents: 2100,
    },
    price: 300,
    currency: "KAUSHAL",
    duration: "6 weeks",
    difficulty: "Beginner",
    category: "Marketing",
    tags: ["Social Media", "Growth", "Analytics"],
    studentsEnrolled: 156,
    earnings: 46800,
    hasVideo: true,
    videoUrl: "/videos/digital-marketing.mp4",
  },
  {
    id: "4",
    title: "UI/UX Design for Mobile Apps",
    description: "Design beautiful mobile apps using Figma. Learn Indian design patterns and user behavior.",
    instructor: {
      name: "Rahul Kumar",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.6,
      totalStudents: 750,
    },
    price: 400,
    currency: "KAUSHAL",
    duration: "5 weeks",
    difficulty: "Intermediate",
    category: "Design",
    tags: ["Figma", "Mobile", "UX"],
    studentsEnrolled: 67,
    earnings: 26800,
    hasVideo: true,
    videoUrl: "/videos/ui-ux-design.mp4",
  },
  {
    id: "5",
    title: "Python for Data Science",
    description: "Learn Python, pandas, numpy for data analysis. Perfect for Indian job market.",
    instructor: {
      name: "Anita Singh",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
      totalStudents: 1500,
    },
    price: 600,
    currency: "KAUSHAL",
    duration: "10 weeks",
    difficulty: "Beginner",
    category: "Programming",
    tags: ["Python", "Data Science", "Analytics"],
    studentsEnrolled: 234,
    earnings: 140400,
    hasVideo: true,
    videoUrl: "/videos/python-data-science.mp4",
  },
  {
    id: "6",
    title: "English Communication Skills",
    description: "Improve spoken English for IT professionals. Accent training and interview preparation.",
    instructor: {
      name: "Deepak Mehta",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.9,
      totalStudents: 3200,
    },
    price: 250,
    currency: "KAUSHAL",
    duration: "4 weeks",
    difficulty: "Beginner",
    category: "Language",
    tags: ["English", "Communication", "Interview"],
    studentsEnrolled: 456,
    earnings: 114000,
    hasVideo: true,
    videoUrl: "/videos/english-communication.mp4",
  },
  {
    id: "7",
    title: "Live: Advanced React Patterns",
    description: "Interactive live session covering HOCs, Render Props, and Custom Hooks. Q&A included.",
    instructor: {
      name: "Priya Sharma",
      avatar: "/indian-woman-developer.png",
      rating: 5.0,
      totalStudents: 120,
    },
    price: 100,
    currency: "KAUSHAL",
    duration: "2 hours",
    difficulty: "Advanced",
    category: "Live Session",
    tags: ["React", "Live", "Interactive"],
    studentsEnrolled: 12,
    earnings: 1200,
    hasVideo: false,
    videoUrl: "",
  },
  {
    id: "8",
    title: "Live: Crypto Trading Strategies",
    description: "Real-time market analysis and trading strategies for Indian crypto markets.",
    instructor: {
      name: "Arjun Patel",
      avatar: "/placeholder-nrad2.png",
      rating: 4.9,
      totalStudents: 85,
    },
    price: 200,
    currency: "KAUSHAL",
    duration: "1.5 hours",
    difficulty: "Intermediate",
    category: "Live Session",
    tags: ["Crypto", "Trading", "Live"],
    studentsEnrolled: 25,
    earnings: 5000,
    hasVideo: false,
    videoUrl: "",
  },
]

const useOptimizedSearch = (skills: SkillListing[], searchTerm: string, category: string, difficulty: string) => {
  return useMemo(() => {
    if (!searchTerm && category === "all" && difficulty === "all") {
      return skills
    }

    const searchLower = searchTerm.toLowerCase()

    return skills.filter((skill) => {
      // Optimized search with early returns
      if (category !== "all" && skill.category !== category) return false
      if (difficulty !== "all" && skill.difficulty !== difficulty) return false

      if (!searchTerm) return true

      // Multi-field search with weighted scoring
      return (
        skill.title.toLowerCase().includes(searchLower) ||
        skill.description.toLowerCase().includes(searchLower) ||
        skill.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        skill.instructor.name.toLowerCase().includes(searchLower)
      )
    })
  }, [skills, searchTerm, category, difficulty])
}

export default function MarketplacePage() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [isSOS, setIsSOS] = useState(false)

  const filteredSkills = useMemo(() => {
    let result = mockSkills

    // SOS Filter (Simulated logic: show high availability/rating)
    if (isSOS) {
      result = result.filter(skill =>
        skill.instructor.rating >= 4.8 &&
        skill.instructor.rating >= 4.8 &&
        skill.difficulty === "Advanced"
      )
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      result = result.filter((skill) =>
        skill.title.toLowerCase().includes(searchLower) ||
        skill.description.toLowerCase().includes(searchLower) ||
        skill.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        skill.instructor.name.toLowerCase().includes(searchLower)
      )
    }

    if (selectedCategory !== "all") {
      result = result.filter(skill => skill.category === selectedCategory)
    }

    if (selectedDifficulty !== "all") {
      result = result.filter(skill => skill.difficulty === selectedDifficulty)
    }

    return result
  }, [mockSkills, searchTerm, selectedCategory, selectedDifficulty, isSOS])

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">Skill Marketplace</h1>
          <p className="text-xl text-muted-foreground">Learn from experts and earn crypto rewards</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-primary to-primary/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm">Total Earnings</p>
                  <p className="text-2xl font-bold text-primary-foreground">₹2,45,000</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-accent to-accent/80">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm">Active Skills</p>
                  <p className="text-2xl font-bold text-accent-foreground">1,247</p>
                </div>
                <Award className="h-8 w-8 text-accent-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Students</p>
                  <p className="text-2xl font-bold text-foreground">45,892</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Avg Rating</p>
                  <p className="text-2xl font-bold text-foreground">4.8</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Programming">Programming</SelectItem>
              <SelectItem value="Blockchain">Blockchain</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Language">Language</SelectItem>
              <SelectItem value="Live Session">Live Sessions</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={isSOS ? "destructive" : "outline"}
            onClick={() => setIsSOS(!isSOS)}
            className="gap-2"
          >
            <Zap className={`h-4 w-4 ${isSOS ? "fill-current" : ""}`} />
            {isSOS ? "SOS Active" : "SOS Mode"}
          </Button>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="h-full"
            >
              <Card className="hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{skill.title}</CardTitle>
                      <CardDescription className="text-sm">{skill.description}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        skill.difficulty === "Beginner"
                          ? "secondary"
                          : skill.difficulty === "Intermediate"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {skill.difficulty}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  {skill.hasVideo && (
                    <div className="relative mb-4 bg-muted rounded-lg overflow-hidden">
                      <div className="aspect-video flex items-center justify-center">
                        <Play className="h-12 w-12 text-primary" />
                      </div>
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Badge className="bg-primary/90">Preview Available</Badge>
                      </div>
                    </div>
                  )}

                  {/* Instructor Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={skill.instructor.avatar || "/placeholder.svg"}
                      alt={skill.instructor.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-sm">{skill.instructor.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">
                          {skill.instructor.rating} ({skill.instructor.totalStudents} students)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {skill.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {skill.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {skill.studentsEnrolled} enrolled
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-primary" />
                      <span className="font-bold text-lg">
                        {skill.price} {skill.currency}
                      </span>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Enroll Now
                    </Button>
                  </div>

                  {/* Earnings Display */}
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Instructor Earnings:</span>
                      <span className="font-medium text-accent">
                        {skill.earnings} {skill.currency}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Create Skill CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-primary to-accent p-8">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold text-primary-foreground mb-4">Ready to Start Earning?</h3>
              <p className="text-primary-foreground/80 mb-6">Share your skills and earn cryptocurrency on KAUSHALX</p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/create-skill">Create Your First Skill</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
