import type { ObjectId } from "mongodb"

export interface Message {
  _id?: ObjectId
  conversationId: ObjectId
  senderId: ObjectId
  receiverId: ObjectId
  content: string
  type: "text" | "image" | "video" | "file"
  fileUrl?: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Conversation {
  _id?: ObjectId
  participants: ObjectId[]
  lastMessage?: ObjectId
  lastActivity: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  _id?: ObjectId
  postId: ObjectId
  authorId: ObjectId
  content: string
  parentCommentId?: ObjectId
  likes: ObjectId[]
  replies: ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  _id?: ObjectId
  authorId: ObjectId
  title: string
  content: string
  category: string
  tags: string[]
  likes: ObjectId[]
  comments: ObjectId[]
  views: number
  isSticky: boolean
  createdAt: Date
  updatedAt: Date
}
