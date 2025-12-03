import { ObjectId } from "mongodb"

export interface Comment {
    id: string
    userId: string
    userName: string
    userAvatar: string
    content: string
    createdAt: Date
}

export interface Post {
    _id?: ObjectId
    userId: string
    userName: string
    userAvatar: string
    content: string
    type: "requirement" | "update" | "achievement"
    skills?: string[] // For requirements
    likes: string[] // Array of user IDs
    comments: Comment[]
    createdAt: Date
    updatedAt: Date
}
