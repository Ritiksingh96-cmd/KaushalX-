"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, MessageCircle, Reply, Send } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  content: string
  likes: number
  repliesCount: number
  createdAt: string
  author: {
    id: string
    name: string
    avatar?: string
    isVerified: boolean
  } | null
  replies: Comment[]
}

interface CommentSectionProps {
  postId: string
  postType?: "video" | "post" | "forum"
}

export function CommentSection({ postId, postType = "post" }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      const response = await fetch(`/api/comments/${postId}`)
      const data = await response.json()

      if (response.ok) {
        setComments(data.comments)
      }
    } catch (error) {
      console.error("Error loading comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setComments((prev) => [data.comment, ...prev])
        setNewComment("")
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitReply = async (parentCommentId: string) => {
    if (!replyContent.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/comments/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: replyContent.trim(),
          parentCommentId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Add reply to the parent comment
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parentCommentId
              ? {
                  ...comment,
                  replies: [...comment.replies, data.comment],
                  repliesCount: comment.repliesCount + 1,
                }
              : comment,
          ),
        )
        setReplyContent("")
        setReplyingTo(null)
      }
    } catch (error) {
      console.error("Error submitting reply:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`space-y-3 ${isReply ? "ml-8 border-l-2 border-muted pl-4" : ""}`}>
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author?.avatar || "/placeholder.svg"} alt={comment.author?.name || "User"} />
          <AvatarFallback>{comment.author?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <h4 className="font-medium text-sm">{comment.author?.name || "Anonymous"}</h4>
            {comment.author?.isVerified && (
              <Badge variant="outline" className="text-xs">
                Verified
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>

          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.content}</p>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
              <Heart className="h-3 w-3 mr-1" />
              {comment.likes}
            </Button>

            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            )}

            {comment.repliesCount > 0 && !isReply && (
              <span className="text-xs text-muted-foreground">
                {comment.repliesCount} {comment.repliesCount === 1 ? "reply" : "replies"}
              </span>
            )}
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <div className="space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="text-sm"
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => submitReply(comment.id)}
                  disabled={!replyContent.trim() || isSubmitting}
                >
                  <Send className="h-3 w-3 mr-1" />
                  Reply
                </Button>
                <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Comments ({comments.length})</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Add Comment Form */}
        <form onSubmit={submitComment} className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={`Add a comment to this ${postType}...`}
            rows={3}
          />
          <Button type="submit" disabled={!newComment.trim() || isSubmitting}>
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </form>

        {/* Comments List */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No comments yet</p>
            <p className="text-sm text-muted-foreground">Be the first to share your thoughts!</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-6">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
