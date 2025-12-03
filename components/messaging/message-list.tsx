"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Paperclip, ImageIcon, Video, File } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Message {
  id: string
  content: string
  type: "text" | "image" | "video" | "file"
  fileUrl?: string
  isRead: boolean
  createdAt: string
  sender: {
    id: string
    name: string
    avatar?: string
  } | null
  isMine: boolean
}

interface MessageListProps {
  conversationId: string
  currentUserId: string
}

export function MessageList({ conversationId, currentUserId }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${conversationId}`)
      const data = await response.json()

      if (response.ok) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)

    try {
      const response = await fetch(`/api/messages/${conversationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          type: "text",
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessages((prev) => [...prev, data.message])
        setNewMessage("")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "file":
        return <File className="h-4 w-4" />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle>Messages</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.isMine ? "justify-end" : "justify-start"} space-x-2`}>
                  {!message.isMine && message.sender && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                      <AvatarFallback>{message.sender.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-[70%] ${message.isMine ? "order-first" : ""}`}>
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.isMine ? "bg-primary text-primary-foreground ml-auto" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {message.type !== "text" && (
                        <div className="flex items-center space-x-2 mb-1">
                          {getMessageIcon(message.type)}
                          <span className="text-xs opacity-75">
                            {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                          </span>
                        </div>
                      )}

                      {message.type === "text" ? (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      ) : message.type === "image" && message.fileUrl ? (
                        <div className="space-y-2">
                          <img
                            src={message.fileUrl || "/placeholder.svg"}
                            alt="Shared image"
                            className="max-w-full h-auto rounded border"
                          />
                          {message.content && <p className="text-sm">{message.content}</p>}
                        </div>
                      ) : message.type === "video" && message.fileUrl ? (
                        <div className="space-y-2">
                          <video controls className="max-w-full h-auto rounded border">
                            <source src={message.fileUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          {message.content && <p className="text-sm">{message.content}</p>}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {message.fileUrl && (
                            <a
                              href={message.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm underline hover:no-underline"
                            >
                              Download File
                            </a>
                          )}
                          {message.content && <p className="text-sm">{message.content}</p>}
                        </div>
                      )}
                    </div>

                    <div className={`flex items-center space-x-2 mt-1 ${message.isMine ? "justify-end" : ""}`}>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </span>
                      {message.isMine && (
                        <Badge variant={message.isRead ? "default" : "secondary"} className="text-xs">
                          {message.isRead ? "Read" : "Sent"}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {message.isMine && message.sender && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
                      <AvatarFallback>{message.sender.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <Button type="button" variant="outline" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={isSending}
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim() || isSending} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
