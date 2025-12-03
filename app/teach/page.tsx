"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Video, Users, BookOpen, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TeachPage() {
    const [isScheduling, setIsScheduling] = useState(false)

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600">
                        Teach & Earn
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Share your expertise, schedule live sessions, and earn Kaushal Tokens.
                    </p>
                </div>
                <Button size="lg" onClick={() => setIsScheduling(!isScheduling)} className="bg-gradient-to-r from-purple-600 to-blue-600">
                    <Video className="mr-2 h-4 w-4" />
                    Schedule Live Session
                </Button>
            </div>

            {isScheduling && (
                <Card className="mb-8 animate-in slide-in-from-top-4 border-primary/20 shadow-lg">
                    <CardHeader>
                        <CardTitle>Schedule a New Session</CardTitle>
                        <CardDescription>Set up your live teaching class</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Topic / Title</Label>
                                <Input placeholder="e.g., Advanced React Patterns" />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Input placeholder="e.g., Development, Design, Crypto" />
                            </div>
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input className="pl-10" type="date" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Time</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input className="pl-10" type="time" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setIsScheduling(false)}>Cancel</Button>
                            <Button>Confirm Schedule</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Upcoming & Past Sessions */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="upcoming">
                        <TabsList className="w-full justify-start mb-4">
                            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
                            <TabsTrigger value="past">Past Classes</TabsTrigger>
                            <TabsTrigger value="requests">Mentorship Requests</TabsTrigger>
                        </TabsList>

                        <TabsContent value="upcoming" className="space-y-4">
                            {[1, 2].map((i) => (
                                <Card key={i} className="hover:border-primary/50 transition-colors">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                                        Development
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground flex items-center">
                                                        <Calendar className="h-3 w-3 mr-1" /> Tomorrow, 10:00 AM
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-semibold">Introduction to Smart Contracts</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Learn the basics of Solidity and how to deploy your first contract on Ethereum.
                                                </p>
                                                <div className="flex items-center gap-4 pt-2">
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Users className="h-4 w-4 mr-1" /> 12 Registered
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Clock className="h-4 w-4 mr-1" /> 60 mins
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="outline">Manage</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="past">
                            <div className="text-center py-12 text-muted-foreground">
                                No past sessions found.
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar - Stats & Tips */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Instructor Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Total Students</span>
                                <span className="font-bold text-lg">142</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Hours Taught</span>
                                <span className="font-bold text-lg">24h</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Rating</span>
                                <span className="font-bold text-lg flex items-center text-yellow-500">
                                    4.9 <Star className="h-3 w-3 ml-1 fill-current" />
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-primary/10">
                                <span className="text-muted-foreground">Earnings</span>
                                <span className="font-bold text-lg text-green-500">540 KSHL</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Teaching Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex gap-3">
                                <div className="bg-primary/10 p-2 rounded-full h-fit">
                                    <Video className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">Check your setup</h4>
                                    <p className="text-xs text-muted-foreground">Ensure your camera and microphone are working before the session.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="bg-primary/10 p-2 rounded-full h-fit">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">Prepare materials</h4>
                                    <p className="text-xs text-muted-foreground">Have your slides and code examples ready to share.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
