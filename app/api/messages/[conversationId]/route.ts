import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { MessageService } from "@/lib/database/messages"
import { UserService } from "@/lib/database/users"
import { z } from "zod"

interface RouteParams {
  params: Promise<{
    conversationId: string
  }>
}

const sendMessageSchema = z.object({
  content: z.string().min(1, "Message content is required").max(1000, "Message too long"),
  type: z.enum(["text", "image", "video", "file"]).default("text"),
  fileUrl: z.string().optional(),
})

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { conversationId } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const messages = await MessageService.getConversationMessages(conversationId, limit, offset)

    // Get sender info for each message
    const messagesWithSenders = await Promise.all(
      messages.map(async (message) => {
        const sender = await UserService.findUserById(message.senderId)
        return {
          id: message._id,
          content: message.content,
          type: message.type,
          fileUrl: message.fileUrl,
          isRead: message.isRead,
          createdAt: message.createdAt,
          sender: sender
            ? {
              id: sender._id,
              name: sender.name,
              avatar: sender.avatar,
            }
            : null,
          isMine: message.senderId.toString() === session.user.id,
        }
      }),
    )

    // Mark messages as read
    await MessageService.markMessagesAsRead(conversationId, session.user.id)

    return NextResponse.json({ messages: messagesWithSenders.reverse() })
  } catch (error) {
    console.error("Get messages error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { conversationId } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = sendMessageSchema.parse(body)

    // Find the other participant to set as receiver
    const conversations = await MessageService.getUserConversations(session.user.id)
    const conversation = conversations.find((c) => c._id?.toString() === conversationId)

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
    }

    const receiverId = conversation.participants.find((id) => id.toString() !== session.user.id)
    if (!receiverId) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 })
    }

    const message = await MessageService.sendMessage({
      conversationId: conversationId,
      senderId: session.user.id,
      receiverId: receiverId.toString(),
      content: validatedData.content,
      type: validatedData.type,
      fileUrl: validatedData.fileUrl,
      isRead: false,
    } as any)

    const sender = await UserService.findUserById(session.user.id)

    return NextResponse.json({
      message: {
        id: message._id,
        content: message.content,
        type: message.type,
        fileUrl: message.fileUrl,
        isRead: message.isRead,
        createdAt: message.createdAt,
        sender: sender
          ? {
            id: sender._id,
            name: sender.name,
            avatar: sender.avatar,
          }
          : null,
        isMine: true,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Send message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
