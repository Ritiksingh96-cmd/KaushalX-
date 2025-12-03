"use client"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatDistanceToNow } from "date-fns"

interface UserBadge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
  category: "skill" | "community" | "achievement" | "special"
}

interface UserBadgeDisplayProps {
  badges: UserBadge[]
  maxDisplay?: number
  size?: "sm" | "md" | "lg"
  showTooltip?: boolean
}

export function UserBadgeDisplay({ badges, maxDisplay = 5, size = "md", showTooltip = true }: UserBadgeDisplayProps) {
  const displayBadges = badges.slice(0, maxDisplay)
  const remainingCount = badges.length - maxDisplay

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs h-5"
      case "lg":
        return "text-base h-8"
      default:
        return "text-sm h-6"
    }
  }

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "text-sm"
      case "lg":
        return "text-xl"
      default:
        return "text-base"
    }
  }

  if (badges.length === 0) {
    return null
  }

  return (
    <div className="flex items-center space-x-1 flex-wrap gap-1">
      <TooltipProvider>
        {displayBadges.map((badge) => (
          <Tooltip key={badge.id}>
            <TooltipTrigger asChild>
              <Badge variant="outline" className={`${getSizeClasses()} flex items-center space-x-1 cursor-help`}>
                <span className={getIconSize()}>{badge.icon}</span>
                {size === "lg" && <span>{badge.name}</span>}
              </Badge>
            </TooltipTrigger>
            {showTooltip && (
              <TooltipContent>
                <div className="text-center">
                  <div className="font-semibold">{badge.name}</div>
                  <div className="text-sm text-muted-foreground">{badge.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Earned {formatDistanceToNow(new Date(badge.earnedAt), { addSuffix: true })}
                  </div>
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        ))}

        {remainingCount > 0 && (
          <Badge variant="secondary" className={`${getSizeClasses()} cursor-default`}>
            +{remainingCount}
          </Badge>
        )}
      </TooltipProvider>
    </div>
  )
}
