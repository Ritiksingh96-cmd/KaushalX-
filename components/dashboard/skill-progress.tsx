"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Target, TrendingUp } from "lucide-react"

interface SkillProgressProps {
  offeredSkills: string[]
  wantedSkills: string[]
  topSkills: { skill: string; count: number }[]
}

export function SkillProgress({ offeredSkills, wantedSkills, topSkills }: SkillProgressProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Skills I Offer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {offeredSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No skills added yet</p>
            ) : (
              offeredSkills.slice(0, 5).map((skill, index) => (
                <Badge key={index} variant="secondary" className="mr-2 mb-2">
                  {skill}
                </Badge>
              ))
            )}
            {offeredSkills.length > 5 && (
              <p className="text-xs text-muted-foreground">+{offeredSkills.length - 5} more skills</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Skills I Want
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {wantedSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No learning goals set</p>
            ) : (
              wantedSkills.slice(0, 5).map((skill, index) => (
                <Badge key={index} variant="outline" className="mr-2 mb-2">
                  {skill}
                </Badge>
              ))
            )}
            {wantedSkills.length > 5 && (
              <p className="text-xs text-muted-foreground">+{wantedSkills.length - 5} more goals</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Most Active Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet</p>
            ) : (
              topSkills.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="truncate">{item.skill}</span>
                    <span className="text-muted-foreground">{item.count} sessions</span>
                  </div>
                  <Progress value={(item.count / Math.max(...topSkills.map((s) => s.count))) * 100} className="h-2" />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
