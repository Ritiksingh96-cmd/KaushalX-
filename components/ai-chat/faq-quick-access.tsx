"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, CreditCard, Users, BookOpen, Settings, Zap, Coins, TrendingUp } from "lucide-react"

interface FAQQuickAccessProps {
  onQuestionSelect: (question: string) => void
}

export function FAQQuickAccess({ onQuestionSelect }: FAQQuickAccessProps) {
  const quickQuestions = [
    {
      icon: Coins,
      question: "How to get Kaushal Tokens?",
      category: "Rewards",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      icon: TrendingUp,
      question: "How to trade skills?",
      category: "Trading",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: CreditCard,
      question: "Withdrawal process",
      category: "Finance",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: Users,
      question: "How does skill sharing work?",
      category: "Skills",
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: BookOpen,
      question: "How to start teaching?",
      category: "Teaching",
      color: "bg-orange-100 text-orange-700",
    },
    {
      icon: HelpCircle,
      question: "What is TamuPro?",
      category: "General",
      color: "bg-indigo-100 text-indigo-700",
    },
  ]

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle className="h-4 w-4 text-blue-600" />
        <h3 className="font-semibold text-sm">Quick Questions</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {quickQuestions.map((item, index) => {
          const Icon = item.icon
          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => onQuestionSelect(item.question)}
              className="h-auto p-2 flex flex-col items-start text-left hover:bg-gray-50"
            >
              <div className="flex items-center gap-2 w-full mb-1">
                <Icon className="h-3 w-3" />
                <Badge variant="secondary" className={`text-xs ${item.color}`}>
                  {item.category}
                </Badge>
              </div>
              <span className="text-xs text-gray-600 line-clamp-2">{item.question}</span>
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
