"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, MessageCircle, Plus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Conversation {
  id: string
  participants: {
    id: string
    name: string
    avatar?: string
    isVerified: boolean
  }[]
  lastActivity: string
  isActive: boolean
  createdAt: string
}

interface ConversationListProps {
  onSelectConversation: (conversationId: string) => void
  selectedConversationId?: string
}

export function ConversationList({ onSelectConversation, selectedConversationId }: ConversationListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const response = await fetch("/api/messages/conversations")
      const data = await response.json()

      if (response.ok) {
        setConversations(data.conversations)
      }
    } catch (error) {
      console.error("Error loading conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredConversations = conversations.filter((conversation) =>
    conversation.participants.some((participant) => participant.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading conversations...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Messages</span>
          </CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Conversations List */}
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No conversations yet</p>
                <p className="text-sm text-muted-foreground">Start chatting with other users!</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const participant = conversation.participants[0] // Assuming 1-on-1 conversations
                if (!participant) return null

                return (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedConversationId === conversation.id ? "bg-muted" : ""
                    }`}
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                        <AvatarFallback>{participant.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium truncate">{participant.name}</h4>
                            {participant.isVerified && (
                              <Badge variant="outline" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(conversation.lastActivity), { addSuffix: true })}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-muted-foreground truncate">Click to start conversation</p>
                          {conversation.isActive && <div className="h-2 w-2 bg-green-500 rounded-full"></div>}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
