import { getDatabase } from "../mongodb"
import type { Video, VideoComment } from "../models/Video"
import { ObjectId } from "mongodb"

export class VideoService {
  private static async getVideoCollection() {
    const db = await getDatabase()
    return db.collection<Video>("videos")
  }

  private static async getCommentCollection() {
    const db = await getDatabase()
    return db.collection<VideoComment>("video_comments")
  }

  static async createVideo(videoData: Omit<Video, "_id" | "createdAt" | "updatedAt">): Promise<Video> {
    const collection = await this.getVideoCollection()

    const video: Video = {
      ...videoData,
      uploaderId: new ObjectId(videoData.uploaderId),
      views: 0,
      likes: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(video)
    return { ...video, _id: result.insertedId }
  }

  static async findVideoById(id: string | ObjectId): Promise<Video | null> {
    const collection = await this.getVideoCollection()
    const objectId = typeof id === "string" ? new ObjectId(id) : id
    return await collection.findOne({ _id: objectId })
  }

  static async findVideosByUser(userId: string | ObjectId, limit = 20, offset = 0): Promise<Video[]> {
    const collection = await this.getVideoCollection()
    const objectId = typeof userId === "string" ? new ObjectId(userId) : userId

    return await collection.find({ uploaderId: objectId }).sort({ createdAt: -1 }).skip(offset).limit(limit).toArray()
  }

  static async findPublicVideos(
    filters: {
      category?: string
      tags?: string[]
      searchTerm?: string
    } = {},
    limit = 20,
    offset = 0,
  ): Promise<Video[]> {
    const collection = await this.getVideoCollection()

    const query: any = { isPublic: true }

    if (filters.category) {
      query.category = filters.category
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags }
    }

    if (filters.searchTerm) {
      query.$or = [
        { title: { $regex: filters.searchTerm, $options: "i" } },
        { description: { $regex: filters.searchTerm, $options: "i" } },
        { tags: { $regex: filters.searchTerm, $options: "i" } },
      ]
    }

    return await collection.find(query).sort({ createdAt: -1 }).skip(offset).limit(limit).toArray()
  }

  static async incrementViews(videoId: string | ObjectId): Promise<boolean> {
    const collection = await this.getVideoCollection()
    const objectId = typeof videoId === "string" ? new ObjectId(videoId) : videoId

    const result = await collection.updateOne({ _id: objectId }, { $inc: { views: 1 } })

    return result.modifiedCount > 0
  }

  static async toggleLike(videoId: string | ObjectId, userId: string | ObjectId): Promise<boolean> {
    const collection = await this.getVideoCollection()
    const videoObjectId = typeof videoId === "string" ? new ObjectId(videoId) : videoId
    const userObjectId = typeof userId === "string" ? new ObjectId(userId) : userId

    const video = await collection.findOne({ _id: videoObjectId })
    if (!video) return false

    const hasLiked = video.likes.some((like) => like.toString() === userObjectId.toString())

    if (hasLiked) {
      // Remove like
      await collection.updateOne({ _id: videoObjectId }, { $pull: { likes: userObjectId } })
    } else {
      // Add like
      await collection.updateOne({ _id: videoObjectId }, { $push: { likes: userObjectId } })
    }

    return true
  }

  static async addComment(commentData: Omit<VideoComment, "_id" | "createdAt" | "updatedAt">): Promise<VideoComment> {
    const commentCollection = await this.getCommentCollection()
    const videoCollection = await this.getVideoCollection()

    const comment: VideoComment = {
      ...commentData,
      videoId: new ObjectId(commentData.videoId),
      authorId: new ObjectId(commentData.authorId),
      parentCommentId: commentData.parentCommentId ? new ObjectId(commentData.parentCommentId) : undefined,
      likes: [],
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await commentCollection.insertOne(comment)
    const createdComment = { ...comment, _id: result.insertedId }

    // Add comment reference to video
    await videoCollection.updateOne(
      { _id: new ObjectId(commentData.videoId) },
      { $push: { comments: result.insertedId } },
    )

    // If this is a reply, add to parent comment
    if (commentData.parentCommentId) {
      await commentCollection.updateOne(
        { _id: new ObjectId(commentData.parentCommentId) },
        { $push: { replies: result.insertedId } },
      )
    }

    return createdComment
  }

  static async getVideoComments(videoId: string | ObjectId, limit = 50, offset = 0): Promise<VideoComment[]> {
    const collection = await this.getCommentCollection()
    const objectId = typeof videoId === "string" ? new ObjectId(videoId) : videoId

    return await collection
      .find({
        videoId: objectId,
        parentCommentId: { $exists: false }, // Only top-level comments
      })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray()
  }

  static async deleteVideo(videoId: string | ObjectId, userId: string | ObjectId): Promise<boolean> {
    const collection = await this.getVideoCollection()
    const videoObjectId = typeof videoId === "string" ? new ObjectId(videoId) : videoId
    const userObjectId = typeof userId === "string" ? new ObjectId(userId) : userId

    const result = await collection.deleteOne({
      _id: videoObjectId,
      uploaderId: userObjectId,
    })

    return result.deletedCount > 0
  }
}
