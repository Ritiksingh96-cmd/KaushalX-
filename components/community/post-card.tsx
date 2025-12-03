"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Share2, Send } from "lucide-react"
import type { Post } from "@/lib/models/Post"
import { formatDistanceToNow } from "date-fns"

interface PostCardProps {
    post: Post
    currentUserId?: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
    const [isLiked, setIsLiked] = useState(post.likes.includes(currentUserId || ""))
    const [likesCount, setLikesCount] = useState(post.likes.length)
    const [showComments, setShowComments] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [comments, setComments] = useState(post.comments)

    const handleLike = () => {
        if (isLiked) {
            setLikesCount((prev) => prev - 1)
        } else {
            setLikesCount((prev) => prev + 1)
        }
        setIsLiked(!isLiked)
        // Here you would call an API to toggle like
    }

    const handleComment = () => {
        if (!newComment.trim()) return

        const comment = {
            id: Math.random().toString(36).substr(2, 9),
            userId: currentUserId || "guest",
            userName: "You", // In a real app, get from session
            userAvatar: "/placeholder-user.jpg",
            content: newComment,
            createdAt: new Date(),
        }

        setComments([...comments, comment])
        setNewComment("")
        // Here you would call an API to add comment
    }

    return (
        <Card className="mb-4">
            <CardHeader className="flex flex-row items-center gap-4 p-4">
                <Avatar>
                    <AvatarImage src={post.userAvatar} alt={post.userName} />
                    <AvatarFallback>{post.userName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-sm font-semibold">{post.userName}</p>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                </div>
                {post.type === "requirement" && (
                    <Badge variant="secondary" className="ml-auto">
                        Requirement
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-sm mb-4">{post.content}</p>
                {post.skills && post.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col p-4 pt-0">
                <div className="flex items-center justify-between w-full border-t pt-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
                        onClick={handleLike}
                    >
                        <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                        {likesCount}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2" onClick={() => setShowComments(!showComments)}>
                        <MessageCircle className="h-4 w-4" />
                        {comments.length}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                    </Button>
                </div>

                {showComments && (
                    <div className="w-full mt-4 space-y-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 text-sm">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={comment.userAvatar} />
                                    <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="bg-muted p-3 rounded-lg flex-1">
                                    <p className="font-semibold text-xs mb-1">{comment.userName}</p>
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                        ))}
                        <div className="flex gap-2 mt-4">
                            <Input
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleComment()}
                            />
                            <Button size="icon" onClick={handleComment}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
