"use client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { MapPin, Star, Calendar, MessageCircle, Zap } from "lucide-react"
import type { MatchResult } from "@/lib/matching-algorithm"

interface MatchCardProps {
  match: MatchResult
  onConnect: (userId: string) => void
  onMessage: (userId: string) => void
  onSchedule: (userId: string) => void
}

export function MatchCard({ match, onConnect, onMessage, onSchedule }: MatchCardProps) {
  const { user, score, reasons } = match

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent Match"
    if (score >= 60) return "Good Match"
    return "Potential Match"
  }

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {user.location && (
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {user.location}
                  </div>
                )}
                <div className="flex items-center">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {user.reputation.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</div>
            <div className="text-xs text-muted-foreground">{getScoreLabel(score)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Match Score Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Match Score</span>
            <span className="font-medium">{score}/100</span>
          </div>
          <Progress value={score} className="h-2" />
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold">{user.level}</div>
            <div className="text-xs text-muted-foreground">Level</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{user.sessionsCompleted}</div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{user.skillCredits}</div>
            <div className="text-xs text-muted-foreground">Credits</div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Skills Offered:</div>
          <div className="flex flex-wrap gap-1">
            {user.skills.offered.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {user.skills.offered.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{user.skills.offered.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Match Reasons */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Why this match:</div>
          <ul className="text-xs text-muted-foreground space-y-1">
            {reasons.slice(0, 2).map((reason, index) => (
              <li key={index} className="flex items-center">
                <Zap className="h-3 w-3 mr-2 text-yellow-500" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Availability Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`h-2 w-2 rounded-full ${
                user.availability.status === "available"
                  ? "bg-green-500"
                  : user.availability.status === "busy"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
              }`}
            />
            <span className="text-sm capitalize">{user.availability.status}</span>
          </div>
          {user.isVerified && <Badge variant="outline">Verified</Badge>}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button onClick={() => onConnect(user._id!.toString())} className="flex-1" size="sm">
            Connect
          </Button>
          <Button onClick={() => onMessage(user._id!.toString())} variant="outline" size="sm">
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button onClick={() => onSchedule(user._id!.toString())} variant="outline" size="sm">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
