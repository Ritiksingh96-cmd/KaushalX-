import type { ObjectId } from "mongodb"

export interface Video {
  _id?: ObjectId
  uploaderId: ObjectId
  title: string
  description?: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  duration?: number
  thumbnail?: string
  cloudinaryUrl: string
  cloudinaryPublicId: string
  category: "tutorial" | "demo" | "review" | "discussion"
  tags: string[]
  views: number
  likes: ObjectId[]
  comments: ObjectId[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface VideoComment {
  _id?: ObjectId
  videoId: ObjectId
  authorId: ObjectId
  content: string
  timestamp?: number // Video timestamp in seconds
  parentCommentId?: ObjectId
  likes: ObjectId[]
  replies: ObjectId[]
  createdAt: Date
  updatedAt: Date
}
