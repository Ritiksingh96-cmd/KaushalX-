"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MatchCard } from "./match-card"
import { SkillSOS } from "./skill-sos"
import { Search, Users, Zap, TrendingUp } from "lucide-react"
import type { MatchResult } from "@/lib/matching-algorithm"

export function MatchDashboard() {
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [skillFilter, setSkillFilter] = useState("all")

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/matching/find-matches")
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to load matches")
        return
      }

      setMatches(data.matches)
    } catch (error) {
      setError("An error occurred while loading matches.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    setIsLoading(true)
    setError("")

    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("skills", searchTerm)
      if (skillFilter !== "all") params.append("skills", skillFilter)

      const response = await fetch(`/api/matching/find-matches?${params}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Search failed")
        return
      }

      setMatches(data.matches)
    } catch (error) {
      setError("Search failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async (userId: string) => {
    console.log("Connecting with user:", userId)
    // This would typically create a connection request
  }

  const handleMessage = async (userId: string) => {
    console.log("Messaging user:", userId)
    // This would typically open the messaging interface
  }

  const handleSchedule = async (userId: string) => {
    console.log("Scheduling with user:", userId)
    // This would typically open the calendar interface
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Find Your Perfect Match</h1>
          <p className="text-muted-foreground">Discover skilled individuals who can help you learn and grow</p>
        </div>
        <Button onClick={loadMatches} disabled={isLoading}>
          <TrendingUp className="mr-2 h-4 w-4" />
          Refresh Matches
        </Button>
      </div>

      <Tabs defaultValue="matches" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="matches" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Smart Matches</span>
          </TabsTrigger>
          <TabsTrigger value="sos" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Skill SOS</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Find Specific Skills</span>
              </CardTitle>
              <CardDescription>Search for users with specific skills or expertise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Skills</Label>
                  <Input
                    id="search"
                    placeholder="e.g., JavaScript, Guitar, Cooking..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={skillFilter} onValueChange={setSkillFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="language">Languages</SelectItem>
                      <SelectItem value="cooking">Cooking</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} disabled={isLoading} className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Matches Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-32 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <MatchCard
                  key={match.user._id!.toString()}
                  match={match}
                  onConnect={handleConnect}
                  onMessage={handleMessage}
                  onSchedule={handleSchedule}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No matches found</h3>
                <p className="text-muted-foreground mb-4">
                  Try updating your skills or search for different expertise areas.
                </p>
                <Button onClick={loadMatches}>Refresh Matches</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sos">
          <SkillSOS />
        </TabsContent>
      </Tabs>
    </div>
  )
}
