import { auth } from "@/lib/auth"

import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get("roomId")

    if (!roomId) {
      return NextResponse.json({ error: "Room ID required" }, { status: 400 })
    }

    // Mock messages data - in real app, fetch from database
    const messages = [
      {
        id: "msg_1",
        senderId: "user_1",
        content: "Hi! I'm excited to help you learn React. What's your current experience level?",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        type: "text",
        status: "read",
      },
      {
        id: "msg_2",
        senderId: session.user.id,
        content: "I'm a beginner. I know basic JavaScript but haven't worked with React before.",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        type: "text",
        status: "read",
      },
      {
        id: "msg_3",
        senderId: "user_1",
        content:
          "Perfect! Let's start with the fundamentals. I'll share some resources and we can build a simple project together.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        type: "text",
        status: "read",
      },
    ]

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Messages fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { roomId, content, type = "text" } = await request.json()

    if (!roomId || !content) {
      return NextResponse.json({ error: "Room ID and content required" }, { status: 400 })
    }

    // Create new message
    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: session.user.id,
      content,
      timestamp: new Date().toISOString(),
      type,
      status: "sent",
    }

    // In real app, save to database and broadcast via WebSocket
    console.log("New message:", newMessage)

    // Simulate message delivery
    setTimeout(() => {
      // Update message status to delivered
      console.log("Message delivered:", newMessage.id)
    }, 1000)

    return NextResponse.json({ message: newMessage })
  } catch (error) {
    console.error("Message send error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
