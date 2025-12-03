"use client"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Trophy, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BadgeNotificationProps {
  badge: {
    id: string
    name: string
    description: string
    icon: string
    category: string
    points: number
  }
  onClose: () => void
  autoClose?: boolean
  duration?: number
}

export function BadgeNotification({ badge, onClose, autoClose = true, duration = 5000 }: BadgeNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <Card className="border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="text-3xl">{badge.icon}</div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                    </motion.div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">Badge Earned!</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{badge.name}</h3>
                    <p className="text-sm text-gray-700 mb-2">{badge.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {badge.category}
                      </Badge>
                      <span className="text-xs font-medium text-yellow-700">+{badge.points} points</span>
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="sm" onClick={handleClose} className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
