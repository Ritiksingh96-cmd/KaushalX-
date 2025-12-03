import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

import { MessageService } from "@/lib/database/messages"
import { UserService } from "@/lib/database/users"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const conversations = await MessageService.getUserConversations(session.user.id)

    // Get participant info for each conversation
    const conversationsWithParticipants = await Promise.all(
      conversations.map(async (conversation) => {
        const participantIds = conversation.participants.filter((id) => id.toString() !== session.user.id)

        const participants = await Promise.all(
          participantIds.map(async (id) => {
            const user = await UserService.findUserById(id)
            return user
              ? {
                  id: user._id,
                  name: user.name,
                  avatar: user.avatar,
                  isVerified: user.isVerified,
                }
              : null
          }),
        )

        return {
          id: conversation._id,
          participants: participants.filter(Boolean),
          lastActivity: conversation.lastActivity,
          isActive: conversation.isActive,
          createdAt: conversation.createdAt,
        }
      }),
    )

    return NextResponse.json({ conversations: conversationsWithParticipants })
  } catch (error) {
    console.error("Get conversations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { participantId } = await request.json()

    if (!participantId) {
      return NextResponse.json({ error: "Participant ID is required" }, { status: 400 })
    }

    // Check if participant exists
    const participant = await UserService.findUserById(participantId)
    if (!participant) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 })
    }

    const conversation = await MessageService.createConversation([session.user.id, participantId])

    return NextResponse.json({
      conversation: {
        id: conversation._id,
        participants: [
          {
            id: participant._id,
            name: participant.name,
            avatar: participant.avatar,
            isVerified: participant.isVerified,
          },
        ],
        lastActivity: conversation.lastActivity,
        isActive: conversation.isActive,
        createdAt: conversation.createdAt,
      },
    })
  } catch (error) {
    console.error("Create conversation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
