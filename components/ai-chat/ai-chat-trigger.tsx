"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot } from "lucide-react"
import { AIChatbot } from "./ai-chatbot"

export function AIChatTrigger() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-110"
            size="lg"
          >
            <div className="relative">
              <Bot className="h-6 w-6 text-white" />
              <Badge className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 bg-green-400 border-2 border-white">
                <span className="sr-only">AI Assistant Available</span>
              </Badge>
            </div>
          </Button>

          {/* Tooltip */}
          <div className="absolute bottom-16 right-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat with TamuPro AI Assistant
          </div>
        </div>
      )}

      {/* Chatbot Component */}
      <AIChatbot
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onMinimize={() => setIsMinimized(!isMinimized)}
        isMinimized={isMinimized}
      />
    </>
  )
}
