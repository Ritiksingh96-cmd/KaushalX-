import { auth } from "@/lib/auth"

import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Mock chat rooms data - in real app, fetch from database
    const chatRooms = [
      {
        id: "room_1",
        participants: [
          {
            id: "user_1",
            name: "Priya Sharma",
            avatar: "/placeholder.svg?key=priya",
            role: "instructor",
            status: "online",
            lastSeen: "now",
            rating: 4.9,
            skill: "React Development",
          },
        ],
        lastMessage: {
          id: "msg_1",
          senderId: "user_1",
          content: "Great progress on your React components! Let's schedule a video call to review your project.",
          timestamp: new Date().toISOString(),
          type: "text",
          status: "read",
        },
        unreadCount: 2,
        skillSession: {
          title: "React Development Session",
          status: "scheduled",
          startTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
        },
      },
    ]

    return NextResponse.json({ chatRooms })
  } catch (error) {
    console.error("Chat rooms fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { participantId, skillId } = await request.json()

    // Create new chat room
    const newRoom = {
      id: `room_${Date.now()}`,
      participants: [
        {
          id: participantId,
          name: "New User",
          avatar: "/placeholder.svg",
          role: "student",
          status: "online",
          lastSeen: "now",
        },
      ],
      lastMessage: {
        id: `msg_${Date.now()}`,
        senderId: "system",
        content: "Chat room created",
        timestamp: new Date().toISOString(),
        type: "system",
        status: "read",
      },
      unreadCount: 0,
    }

    return NextResponse.json({ room: newRoom })
  } catch (error) {
    console.error("Chat room creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
