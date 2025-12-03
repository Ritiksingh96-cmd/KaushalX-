"use client"

import { useState } from "react"
import { ConversationList } from "@/components/messaging/conversation-list"
import { MessageList } from "@/components/messaging/message-list"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <div className="lg:col-span-1">
          <ConversationList
            onSelectConversation={setSelectedConversationId}
            selectedConversationId={selectedConversationId || undefined}
          />
        </div>
        <div className="lg:col-span-2">
          {selectedConversationId ? (
            <MessageList conversationId={selectedConversationId} currentUserId={session?.user?.id || ""} />
          ) : (
            <div className="h-full flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
