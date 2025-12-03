import { ObjectId } from "mongodb"

export interface Job {
    _id?: ObjectId
    title: string
    description: string
    budget: number
    currency: "INR" | "ETH" | "MATIC"
    skillsRequired: string[]
    postedBy: {
        userId: string
        name: string
        avatar?: string
    }
    status: "open" | "in-progress" | "completed"
    applicants: string[]
    createdAt: Date
    updatedAt: Date
}
