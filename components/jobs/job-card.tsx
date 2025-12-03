"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TradeProposalModal } from "./trade-proposal-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Briefcase, Clock, IndianRupee, ArrowRightLeft } from "lucide-react"
import type { Job } from "@/lib/models/Job"

interface JobCardProps {
    job: Job
}

export function JobCard({ job }: JobCardProps) {
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false)

    const timeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
        if (seconds < 60) return "just now"
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
        return `${Math.floor(seconds / 86400)}d ago`
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{job.description}</CardDescription>
                    </div>
                    <Badge variant={job.status === "open" ? "default" : "secondary"}>
                        {job.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">
                            {job.budget} INR
                        </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{timeAgo(job.createdAt)}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1">
                    {job.skillsRequired.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                        </Badge>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={job.postedBy.avatar} />
                            <AvatarFallback>{job.postedBy.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{job.postedBy.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm">
                            <Briefcase className="mr-2 h-4 w-4" />
                            Apply
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setIsTradeModalOpen(true)}>
                            <ArrowRightLeft className="mr-2 h-4 w-4" />
                            Trade Skill
                        </Button>
                    </div>
                </div>
            </CardContent>

            <TradeProposalModal
                isOpen={isTradeModalOpen}
                onClose={() => setIsTradeModalOpen(false)}
                jobTitle={job.title}
                jobOwner={job.postedBy.name}
            />
        </Card >
    )
}
