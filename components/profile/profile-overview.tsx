"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, MapPin, Calendar, Star, Award, BookOpen, Target } from "lucide-react"
import { format } from "date-fns"

interface UserProfile {
  _id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  location?: string
  skills: {
    offered: string[]
    wanted: string[]
  }
  skillCredits: number
  level: number
  badges: any[]
  reputation: number
  sessionsCompleted: number
  memberSince: Date
  isVerified: boolean
}

export function ProfileOverview() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data.user)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return <div>Error loading profile</div>
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
              <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                {profile.isVerified && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Verified
                  </Badge>
                )}
                <Badge variant="outline">Level {profile.level}</Badge>
              </div>

              <p className="text-muted-foreground">{profile.bio || "No bio added yet"}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {profile.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {format(new Date(profile.memberSince), "MMM yyyy")}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4" />
                  <span>{profile.reputation} reputation</span>
                </div>
              </div>
            </div>

            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{profile.skillCredits}</div>
            <p className="text-sm text-muted-foreground">Credits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{profile.sessionsCompleted}</div>
            <p className="text-sm text-muted-foreground">Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{profile.badges.length}</div>
            <p className="text-sm text-muted-foreground">Badges</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{profile.reputation}</div>
            <p className="text-sm text-muted-foreground">Reputation</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="skills" className="space-y-4">
        <TabsList>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Skills I Offer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.offered.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No skills added yet</p>
                  ) : (
                    profile.skills.offered.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Skills I Want to Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.wanted.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No learning goals set</p>
                  ) : (
                    profile.skills.wanted.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.badges.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No badges earned yet</p>
                <p className="text-sm">Complete activities to earn your first badge!</p>
              </div>
            ) : (
              profile.badges.map((badge, index) => (
                <Card key={index}>
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <h3 className="font-semibold">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Earned {format(new Date(badge.earnedAt), "MMM dd, yyyy")}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Activity timeline coming soon</p>
                <p className="text-sm">Your learning journey will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
