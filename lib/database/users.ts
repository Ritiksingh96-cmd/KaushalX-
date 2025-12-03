import { getDatabase } from "../mongodb"
import type { User, Badge } from "../models/User"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export class UserService {
  private static async getCollection() {
    const db = await getDatabase()
    return db.collection<User>("users")
  }

  static async createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<User> {
    const collection = await this.getCollection()

    const user: User = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (user.password) {
      user.password = await bcrypt.hash(user.password, 12)
    }

    const result = await collection.insertOne(user)
    return { ...user, _id: result.insertedId }
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ email })
  }

  static async findUserById(id: string | ObjectId): Promise<User | null> {
    const collection = await this.getCollection()

    if (typeof id === "string" && !ObjectId.isValid(id)) {
      // If ID is not a valid ObjectId, try finding by googleId
      return await collection.findOne({ googleId: id })
    }

    const objectId = typeof id === "string" ? new ObjectId(id) : id
    return await collection.findOne({ _id: objectId })
  }

  static async updateUser(id: string | ObjectId, updates: Partial<User>): Promise<User | null> {
    const collection = await this.getCollection()
    const objectId = typeof id === "string" ? new ObjectId(id) : id

    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return result
  }

  static async addBadgeToUser(userId: string | ObjectId, badge: Badge): Promise<boolean> {
    const collection = await this.getCollection()
    const objectId = typeof userId === "string" ? new ObjectId(userId) : userId

    const result = await collection.updateOne(
      { _id: objectId },
      {
        $push: { badges: badge },
        $set: { updatedAt: new Date() },
      },
    )

    return result.modifiedCount > 0
  }

  static async findUsersBySkill(skill: string, excludeUserId?: string): Promise<User[]> {
    const collection = await this.getCollection()
    const query: any = {
      "skills.offered": { $in: [skill] },
    }

    if (excludeUserId) {
      query._id = { $ne: new ObjectId(excludeUserId) }
    }

    return await collection.find(query).toArray()
  }

  static async searchUsers(
    searchTerm: string,
    filters?: {
      skills?: string[]
      location?: string
      minRating?: number
    },
  ): Promise<User[]> {
    const collection = await this.getCollection()

    const query: any = {
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { "skills.offered": { $regex: searchTerm, $options: "i" } },
        { bio: { $regex: searchTerm, $options: "i" } },
      ],
    }

    if (filters?.skills && filters.skills.length > 0) {
      query["skills.offered"] = { $in: filters.skills }
    }

    if (filters?.location) {
      query.location = { $regex: filters.location, $options: "i" }
    }

    if (filters?.minRating) {
      query.reputation = { $gte: filters.minRating }
    }

    return await collection.find(query).limit(50).toArray()
  }

  static async getRecentUsers(limit: number): Promise<User[]> {
    const collection = await this.getCollection()
    return await collection.find({}).sort({ updatedAt: -1 }).limit(limit).toArray()
  }

  static async getAvailableUsers(): Promise<User[]> {
    const collection = await this.getCollection()
    return await collection.find({ "availability.status": "available" }).limit(20).toArray()
  }
}

export const getUserById = (id: string | ObjectId) => UserService.findUserById(id)
export const findUserByEmail = (email: string) => UserService.findUserByEmail(email)
