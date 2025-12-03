"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle, Clock, MessageCircle, Star, Zap } from "lucide-react"
import type { MatchResult } from "@/lib/matching-algorithm"

export function SkillSOS() {
  const [skill, setSkill] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [error, setError] = useState("")

  const handleSOSRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!skill.trim()) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/matching/skill-sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skill: skill.trim(),
          urgent: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to find help")
        return
      }

      setMatches(data.matches)
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactExpert = async (userId: string) => {
    // This would typically open a chat or send a message
    console.log("Contacting expert:", userId)
  }

  return (
    <div className="space-y-6">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Skill SOS - Emergency Help</span>
          </CardTitle>
          <CardDescription className="text-orange-700">
            Need immediate help with a skill? Our community experts are here to assist you right away.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSOSRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sos-skill">What skill do you need help with?</Label>
              <Input
                id="sos-skill"
                type="text"
                placeholder="e.g., JavaScript debugging, Excel formulas, Guitar chords..."
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                disabled={isLoading}
                className="bg-white"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading || !skill.trim()}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Finding Experts...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Send SOS Request
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {matches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-orange-500" />
            <h3 className="text-lg font-semibold">Available Experts ({matches.length})</h3>
          </div>

          <div className="grid gap-4">
            {matches.map((match) => (
              <Card key={match.user._id!.toString()} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={match.user.avatar || "/placeholder.svg"} alt={match.user.name} />
                        <AvatarFallback>{match.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{match.user.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{match.user.reputation.toFixed(1)}</span>
                          <span>•</span>
                          <span>{match.user.sessionsCompleted} sessions</span>
                          {match.user.isVerified && <Badge variant="outline">Verified</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">Available Now</div>
                      <div className="text-xs text-muted-foreground">Response time: ~5 min</div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Expertise:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {match.user.skills.offered.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {match.reasons.slice(0, 2).map((reason, index) => (
                        <div key={index}>• {reason}</div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <Button
                      onClick={() => handleContactExpert(match.user._id!.toString())}
                      size="sm"
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact Now
                    </Button>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
