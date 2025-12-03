"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Zap, Clock, Tag, User, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

// Mock Data (adapted from legacy)
const MOCK_SOS_REQUESTS = [
    {
        id: "1",
        title: "Urgent: Need help debugging React useEffect loop",
        description: "I'm stuck with an infinite loop in my dashboard component. Need someone to look at it ASAP.",
        author: "Alex Johnson",
        avatar: "",
        skill: "React",
        postedAt: "10 minutes ago",
        credits: 50
    },
    {
        id: "2",
        title: "Server crashing on deployment",
        description: "My Node.js server crashes immediately after deploying to Vercel. Works fine locally.",
        author: "Sarah Lee",
        avatar: "",
        skill: "Node.js",
        postedAt: "25 minutes ago",
        credits: 100
    },
    {
        id: "3",
        title: "CSS Grid layout broken on mobile",
        description: "The layout looks great on desktop but completely breaks on mobile screens. Need a CSS expert.",
        author: "Mike Chen",
        avatar: "",
        skill: "CSS",
        postedAt: "1 hour ago",
        credits: 30
    }
]

export function SkillSOSList() {
    const [requests] = useState(MOCK_SOS_REQUESTS)

    const handleHelp = (author: string) => {
        toast.success(`You offered help to ${author}! They will be notified.`)
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-8 bg-red-500/10 p-6 rounded-xl border border-red-500/20">
                <Zap className="h-12 w-12 mx-auto text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-foreground">Skill SOS</h2>
                <p className="text-muted-foreground mt-2">Get immediate help from the community when you're stuck.</p>
                <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white">
                    <Zap className="mr-2 h-4 w-4" />
                    Request Urgent Help
                </Button>
            </div>

            <div className="grid gap-4">
                {requests.map((req, index) => (
                    <motion.div
                        key={req.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card rounded-xl shadow-sm border-l-4 border-l-red-500 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-foreground">{req.title}</h3>
                                    <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">
                                        {req.credits} Credits
                                    </Badge>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                                    <div className="flex items-center space-x-1">
                                        <Avatar className="h-5 w-5">
                                            <AvatarImage src={req.avatar} />
                                            <AvatarFallback>{req.author.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{req.author}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{req.postedAt}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Tag className="h-4 w-4" />
                                        <span className="font-medium text-blue-500">{req.skill}</span>
                                    </div>
                                </div>
                                <p className="text-muted-foreground mb-4">{req.description}</p>
                            </div>
                            <div className="mt-4 md:mt-0 flex-shrink-0 flex flex-col gap-2">
                                <Button
                                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleHelp(req.author)}
                                >
                                    I can help!
                                </Button>
                                <Button variant="outline" size="sm" className="w-full">
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    Chat
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
