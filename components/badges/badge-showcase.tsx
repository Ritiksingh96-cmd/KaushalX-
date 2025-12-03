"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Award, Zap, Crown, Lock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface BadgeData {
  id: string
  name: string
  description: string
  icon: string
  category: "skill" | "community" | "achievement" | "special"
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
  points: number
  earned: boolean
  earnedAt?: string
}

export function BadgeShowcase() {
  const [badges, setBadges] = useState<BadgeData[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [totalScore, setTotalScore] = useState(0)

  useEffect(() => {
    loadBadges()
  }, [selectedCategory])

  const loadBadges = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }

      const response = await fetch(`/api/badges?${params}`)
      const data = await response.json()

      if (response.ok) {
        setBadges(data.badges)
        calculateTotalScore(data.badges)
      }
    } catch (error) {
      console.error("Error loading badges:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTotalScore = (badgeList: BadgeData[]) => {
    const score = badgeList.filter((badge) => badge.earned).reduce((total, badge) => total + badge.points, 0)
    setTotalScore(score)
  }

  const checkForNewBadges = async () => {
    try {
      const response = await fetch("/api/badges", { method: "POST" })
      const data = await response.json()

      if (response.ok && data.newBadges.length > 0) {
        // Refresh badges list
        loadBadges()
        // You could show a toast notification here
        console.log(data.message)
      }
    } catch (error) {
      console.error("Error checking badges:", error)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-600 border-gray-300"
      case "uncommon":
        return "text-green-600 border-green-300"
      case "rare":
        return "text-blue-600 border-blue-300"
      case "epic":
        return "text-purple-600 border-purple-300"
      case "legendary":
        return "text-yellow-600 border-yellow-300"
      default:
        return "text-gray-600 border-gray-300"
    }
  }

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "common":
        return <Star className="h-4 w-4" />
      case "uncommon":
        return <Award className="h-4 w-4" />
      case "rare":
        return <Trophy className="h-4 w-4" />
      case "epic":
        return <Zap className="h-4 w-4" />
      case "legendary":
        return <Crown className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  const earnedBadges = badges.filter((badge) => badge.earned)
  const totalBadges = badges.length
  const completionPercentage = totalBadges > 0 ? (earnedBadges.length / totalBadges) * 100 : 0

  const BadgeCard = ({ badge }: { badge: BadgeData }) => (
    <Card
      className={`relative transition-all duration-200 hover:shadow-lg ${
        badge.earned ? "border-2" : "opacity-60 hover:opacity-80"
      } ${badge.earned ? getRarityColor(badge.rarity) : "border-muted"}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">{badge.earned ? badge.icon : "🔒"}</div>
          <div className="flex items-center space-x-1">
            {getRarityIcon(badge.rarity)}
            <Badge variant="outline" className={`text-xs ${getRarityColor(badge.rarity)}`}>
              {badge.rarity}
            </Badge>
          </div>
        </div>

        <h3 className={`font-semibold mb-1 ${badge.earned ? "" : "text-muted-foreground"}`}>{badge.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {badge.category}
            </Badge>
            <span className="text-xs font-medium text-primary">+{badge.points} pts</span>
          </div>
          {badge.earned && badge.earnedAt && (
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(badge.earnedAt), { addSuffix: true })}
            </span>
          )}
        </div>

        {!badge.earned && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{earnedBadges.length}</div>
            <div className="text-sm text-muted-foreground">Badges Earned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalScore.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{Math.round(completionPercentage)}%</div>
            <div className="text-sm text-muted-foreground">Completion</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Button onClick={checkForNewBadges} className="w-full">
              <Trophy className="h-4 w-4 mr-2" />
              Check Progress
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Badge Collection Progress</CardTitle>
          <CardDescription>
            {earnedBadges.length} of {totalBadges} badges earned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Badge Categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="achievement">Achievements</TabsTrigger>
          <TabsTrigger value="skill">Skills</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="special">Special</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-32 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : badges.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No badges found</h3>
                <p className="text-muted-foreground">Try selecting a different category.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
