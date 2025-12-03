"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostCard } from "@/components/community/post-card"
import { Plus, Search, Filter, TrendingUp, Video } from "lucide-react"
import Link from "next/link"
import type { Post } from "@/lib/models/Post"

// Mock data
const mockPosts: Post[] = [
    {
        _id: "1" as any,
        userId: "user2",
        userName: "Sarah Chen",
        userAvatar: "/placeholder-user.jpg",
        content: "Looking for a React Native expert to help me with a mobile app project. Willing to trade Python backend skills or pay in Kaushal Tokens.",
        type: "requirement",
        skills: ["React Native", "Mobile Dev"],
        likes: ["user1"],
        comments: [
            {
                id: "c1",
                userId: "user3",
                userName: "Mike Ross",
                userAvatar: "/placeholder-user.jpg",
                content: "I can help! I have 3 years of experience with React Native.",
                createdAt: new Date(Date.now() - 3600000),
            },
        ],
        createdAt: new Date(Date.now() - 7200000),
        updatedAt: new Date(),
    },
    {
        _id: "2" as any,
        userId: "user4",
        userName: "David Kim",
        userAvatar: "/placeholder-user.jpg",
        content: "Just completed the Advanced Blockchain course! Highly recommend it to anyone interested in DeFi.",
        type: "achievement",
        likes: ["user1", "user2", "user3"],
        comments: [],
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(),
    },
    {
        _id: "3" as any,
        userId: "user5",
        userName: "Elena Rodriguez",
        userAvatar: "/placeholder-user.jpg",
        content: "Hosting a free workshop on UI/UX design principles this weekend. Join if you're interested!",
        type: "update",
        skills: ["UI/UX", "Design"],
        likes: ["user2"],
        comments: [],
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(),
    },
]

export default function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>(mockPosts)
    const [newPostContent, setNewPostContent] = useState("")
    const [isPosting, setIsPosting] = useState(false)

    const handlePost = () => {
        if (!newPostContent.trim()) return

        const newPost: Post = {
            _id: Math.random().toString(36).substr(2, 9) as any,
            userId: "current-user",
            userName: "You", // In real app, get from session
            userAvatar: "/placeholder-user.jpg",
            content: newPostContent,
            type: "requirement", // Default for now
            likes: [],
            comments: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        setPosts([newPost, ...posts])
        setNewPostContent("")
        setIsPosting(false)
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Community Feed</h1>
                    <p className="text-muted-foreground">Connect, share, and grow with the community</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-full w-fit">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live Global Feed - Visible to all active users
                    </div>
                </div>
                <Button onClick={() => setIsPosting(!isPosting)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Post
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-2 space-y-6">
                    {isPosting && (
                        <Card className="mb-6 animate-in slide-in-from-top-4 border-primary/20 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">Create a Post</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    placeholder="What's on your mind? Share a requirement, achievement, or update..."
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    className="mb-4"
                                />
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" onClick={() => setIsPosting(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handlePost}>Post</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="w-full justify-start mb-4 bg-muted/50 p-1">
                            <TabsTrigger value="all">All Posts</TabsTrigger>
                            <TabsTrigger value="requirements">Requirements</TabsTrigger>
                            <TabsTrigger value="achievements" className="data-[state=active]:text-yellow-500">Achievements</TabsTrigger>
                            <TabsTrigger value="news" className="data-[state=active]:text-blue-500">News</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-4">
                            {posts.map((post) => (
                                <div key={post._id?.toString()} className={post.type === 'achievement' ? 'border-l-4 border-yellow-500 pl-4' : ''}>
                                    <PostCard post={post} currentUserId="current-user" />
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="requirements" className="space-y-4">
                            {posts
                                .filter((p) => p.type === "requirement")
                                .map((post) => (
                                    <PostCard key={post._id?.toString()} post={post} currentUserId="current-user" />
                                ))}
                        </TabsContent>

                        <TabsContent value="achievements" className="space-y-4">
                            {posts
                                .filter((p) => p.type === "achievement")
                                .map((post) => (
                                    <div key={post._id?.toString()} className="border-2 border-yellow-500/20 rounded-lg overflow-hidden">
                                        <div className="bg-yellow-500/10 px-4 py-1 text-xs font-bold text-yellow-600 uppercase tracking-wider">
                                            Achievement Unlocked
                                        </div>
                                        <PostCard post={post} currentUserId="current-user" />
                                    </div>
                                ))}
                        </TabsContent>

                        <TabsContent value="news" className="space-y-4">
                            {posts
                                .filter((p) => p.type === "update")
                                .map((post) => (
                                    <div key={post._id?.toString()} className="border-l-4 border-blue-500 pl-4">
                                        <PostCard post={post} currentUserId="current-user" />
                                    </div>
                                ))}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Search</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search posts..." className="pl-10" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Featured & Trending
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-3 bg-background/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                                    <h4 className="font-semibold text-sm mb-1">🚀 Kaushal Token Launch</h4>
                                    <p className="text-xs text-muted-foreground">Official launch of our platform token. Claim your genesis rewards!</p>
                                </div>
                                <div className="p-3 bg-background/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                                    <h4 className="font-semibold text-sm mb-1">🏆 Hackathon Winners</h4>
                                    <p className="text-xs text-muted-foreground">Check out the top projects from the recent skill hackathon.</p>
                                </div>
                                <div className="p-3 bg-background/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                                    <Link href="/teach" className="block">
                                        <h4 className="font-semibold text-sm mb-1 flex items-center gap-1">
                                            <Video className="h-3 w-3 text-purple-500" /> Live Teaching
                                        </h4>
                                        <p className="text-xs text-muted-foreground">Schedule a session and earn crypto rewards!</p>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Trending Topics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {["#React", "#Blockchain", "#Design", "#CareerAdvice", "#Freelance"].map((tag) => (
                                    <Button key={tag} variant="secondary" size="sm" className="text-xs">
                                        {tag}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div >
        </div >
    )
}
