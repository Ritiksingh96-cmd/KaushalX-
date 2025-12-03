"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  Star,
  CheckCircle,
  Circle,
  Paperclip,
  Smile,
  Mic,
} from "lucide-react"
import { useSession } from "next-auth/react"

interface ChatUser {
  id: string
  name: string
  avatar: string
  role: "student" | "instructor"
  status: "online" | "offline" | "busy"
  lastSeen: string
  rating?: number
  skill?: string
}

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  type: "text" | "image" | "file" | "system"
  status: "sent" | "delivered" | "read"
}

interface ChatRoom {
  id: string
  participants: ChatUser[]
  lastMessage: Message
  unreadCount: number
  skillSession?: {
    title: string
    status: "scheduled" | "active" | "completed"
    startTime: string
  }
}

const mockChatRooms: ChatRoom[] = [
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
      timestamp: "2024-01-15T10:30:00Z",
      type: "text",
      status: "read",
    },
    unreadCount: 2,
    skillSession: {
      title: "React Development Session",
      status: "scheduled",
      startTime: "2024-01-15T15:00:00Z",
    },
  },
  {
    id: "room_2",
    participants: [
      {
        id: "user_2",
        name: "Arjun Patel",
        avatar: "/placeholder.svg?key=arjun",
        role: "student",
        status: "offline",
        lastSeen: "2 hours ago",
      },
    ],
    lastMessage: {
      id: "msg_2",
      senderId: "user_2",
      content: "Thank you for the blockchain tutorial! The smart contract examples were very helpful.",
      timestamp: "2024-01-15T08:15:00Z",
      type: "text",
      status: "delivered",
    },
    unreadCount: 0,
  },
]

const mockMessages: Message[] = [
  {
    id: "msg_1",
    senderId: "user_1",
    content: "Hi! I'm excited to help you learn React. What's your current experience level?",
    timestamp: "2024-01-15T09:00:00Z",
    type: "text",
    status: "read",
  },
  {
    id: "msg_2",
    senderId: "current_user",
    content: "I'm a beginner. I know basic JavaScript but haven't worked with React before.",
    timestamp: "2024-01-15T09:05:00Z",
    type: "text",
    status: "read",
  },
  {
    id: "msg_3",
    senderId: "user_1",
    content:
      "Perfect! Let's start with the fundamentals. I'll share some resources and we can build a simple project together.",
    timestamp: "2024-01-15T09:10:00Z",
    type: "text",
    status: "read",
  },
  {
    id: "msg_4",
    senderId: "user_1",
    content: "Great progress on your React components! Let's schedule a video call to review your project.",
    timestamp: "2024-01-15T10:30:00Z",
    type: "text",
    status: "read",
  },
]

export default function ChatPage() {
  const { data: session } = useSession()
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(mockChatRooms[0])
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return

    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: "current_user",
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "text",
      status: "sent",
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === message.id ? { ...msg, status: "delivered" } : msg)))
    }, 1000)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sent":
        return <Circle className="h-3 w-3 text-muted-foreground" />
      case "delivered":
        return <CheckCircle className="h-3 w-3 text-muted-foreground" />
      case "read":
        return <CheckCircle className="h-3 w-3 text-primary" />
    }
  }

  return (
    <div className="h-screen bg-background flex">
      {/* Chat List Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {mockChatRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  selectedRoom?.id === room.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={room.participants[0].avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {room.participants[0].name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                        room.participants[0].status === "online"
                          ? "bg-green-500"
                          : room.participants[0].status === "busy"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium truncate">{room.participants[0].name}</h4>
                      <span className="text-xs text-muted-foreground">{formatTime(room.lastMessage.timestamp)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {room.participants[0].role === "instructor" && (
                        <Badge variant="secondary" className="text-xs">
                          Instructor
                        </Badge>
                      )}
                      {room.participants[0].rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{room.participants[0].rating}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground truncate mt-1">{room.lastMessage.content}</p>

                    {room.skillSession && (
                      <div className="mt-2">
                        <Badge
                          variant={
                            room.skillSession.status === "active"
                              ? "default"
                              : room.skillSession.status === "scheduled"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {room.skillSession.status === "active"
                            ? "Live Session"
                            : room.skillSession.status === "scheduled"
                              ? "Scheduled"
                              : "Completed"}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {room.unreadCount > 0 && (
                    <Badge className="bg-primary text-primary-foreground min-w-[20px] h-5 text-xs">
                      {room.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedRoom.participants[0].avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedRoom.participants[0].name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedRoom.participants[0].name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedRoom.participants[0].status === "online"
                            ? "bg-green-500"
                            : selectedRoom.participants[0].status === "busy"
                              ? "bg-yellow-500"
                              : "bg-gray-400"
                        }`}
                      />
                      {selectedRoom.participants[0].status === "online"
                        ? "Online"
                        : `Last seen ${selectedRoom.participants[0].lastSeen}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {selectedRoom.skillSession && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{selectedRoom.skillSession.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedRoom.skillSession.status === "scheduled" &&
                          `Scheduled for ${new Date(selectedRoom.skillSession.startTime).toLocaleString()}`}
                      </p>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      {selectedRoom.skillSession.status === "scheduled"
                        ? "Join Session"
                        : selectedRoom.skillSession.status === "active"
                          ? "Rejoin"
                          : "View Recording"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === "current_user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        message.senderId === "current_user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      } rounded-lg p-3`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div
                        className={`flex items-center gap-1 mt-1 ${
                          message.senderId === "current_user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                        {message.senderId === "current_user" && getStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Mic className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
