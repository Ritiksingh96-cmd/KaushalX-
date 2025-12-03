import { getDatabase } from "../mongodb"
import type { Message, Conversation } from "../models/Message"
import { ObjectId } from "mongodb"

export class MessageService {
  private static async getMessageCollection() {
    const db = await getDatabase()
    return db.collection<Message>("messages")
  }

  private static async getConversationCollection() {
    const db = await getDatabase()
    return db.collection<Conversation>("conversations")
  }

  static async createConversation(participants: string[]): Promise<Conversation> {
    const collection = await this.getConversationCollection()

    // Check if conversation already exists
    const existingConversation = await collection.findOne({
      participants: {
        $all: participants.map((id) => new ObjectId(id)),
        $size: participants.length,
      },
    })

    if (existingConversation) {
      return existingConversation
    }

    const conversation: Conversation = {
      participants: participants.map((id) => new ObjectId(id)),
      lastActivity: new Date(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(conversation)
    return { ...conversation, _id: result.insertedId }
  }

  static async sendMessage(messageData: Omit<Message, "_id" | "createdAt" | "updatedAt" | "senderId" | "receiverId" | "conversationId"> & { senderId: string | ObjectId; receiverId: string | ObjectId; conversationId: string | ObjectId }): Promise<Message> {
    const messageCollection = await this.getMessageCollection()
    const conversationCollection = await this.getConversationCollection()

    const message: Message = {
      ...messageData,
      senderId: new ObjectId(messageData.senderId),
      receiverId: new ObjectId(messageData.receiverId),
      conversationId: new ObjectId(messageData.conversationId),
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await messageCollection.insertOne(message)
    const createdMessage = { ...message, _id: result.insertedId }

    // Update conversation's last message and activity
    await conversationCollection.updateOne(
      { _id: new ObjectId(messageData.conversationId) },
      {
        $set: {
          lastMessage: result.insertedId,
          lastActivity: new Date(),
          updatedAt: new Date(),
        },
      },
    )

    return createdMessage
  }

  static async getConversationMessages(conversationId: string, limit = 50, offset = 0): Promise<Message[]> {
    const collection = await this.getMessageCollection()

    return await collection
      .find({ conversationId: new ObjectId(conversationId) })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray()
  }

  static async getUserConversations(userId: string): Promise<Conversation[]> {
    const collection = await this.getConversationCollection()

    return await collection
      .find({
        participants: new ObjectId(userId),
        isActive: true,
      })
      .sort({ lastActivity: -1 })
      .toArray()
  }

  static async markMessagesAsRead(conversationId: string, userId: string): Promise<boolean> {
    const collection = await this.getMessageCollection()

    const result = await collection.updateMany(
      {
        conversationId: new ObjectId(conversationId),
        receiverId: new ObjectId(userId),
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          updatedAt: new Date(),
        },
      },
    )

    return result.modifiedCount > 0
  }
}
