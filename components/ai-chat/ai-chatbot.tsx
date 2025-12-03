// File: components/ai-chat/ai-chatbot.tsx

"use client"

import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Retrieve API key (client side can only access NEXT_PUBLIC_ prefixed vars)
// API key is handled server-side in /api/chat
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Send, User, X } from "lucide-react"

interface AIChatbotProps {
  isOpen: boolean
  onClose: () => void
  onMinimize: () => void
  isMinimized: boolean
}

export function AIChatbot({ isOpen, onClose, onMinimize, isMinimized }: AIChatbotProps) {
  // Client-side key check removed to allow server-side proxying via /api/chat

  const chatHelpers = useChat({
    api: '/api/chat',
  } as any)

  const { messages, input = "", handleInputChange, handleSubmit, isLoading } = chatHelpers as any

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-96 h-[600px] shadow-lg border-2 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between bg-background">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <CardTitle className="text-lg">AI Assistant</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message: any) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} space-x-2`}>
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg px-3 py-2 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask anything..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={!input?.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}