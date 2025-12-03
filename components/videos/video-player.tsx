"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Play, Pause, Volume2, VolumeX, Maximize, Heart, MessageCircle, Share2, Eye } from "lucide-react"

interface VideoPlayerProps {
  video: {
    id: string
    title: string
    description: string
    url: string
    thumbnail: string
    duration?: number
    category: string
    tags: string[]
    views: number
    likes: number
    comments: number
    createdAt: string
    uploader: {
      id: string
      name: string
      avatar?: string
      isVerified: boolean
    } | null
  }
  onLike?: () => void
  onComment?: () => void
  onShare?: () => void
}

export function VideoPlayer({ video, onLike, onComment, onShare }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video) return

    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    video.currentTime = percent * duration
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      video.requestFullscreen()
    }
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="relative bg-black aspect-video" onMouseMove={handleMouseMove}>
          <video
            ref={videoRef}
            src={video.url}
            poster={video.thumbnail}
            className="w-full h-full object-contain"
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Video Controls */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Play/Pause Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="lg"
                onClick={togglePlay}
                className="text-white hover:bg-white/20 w-16 h-16 rounded-full"
              >
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
              </Button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              {/* Progress Bar */}
              <div className="w-full bg-white/30 rounded-full h-1 cursor-pointer" onClick={handleSeek}>
                <div
                  className="bg-white rounded-full h-1 transition-all duration-100"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={togglePlay} className="text-white hover:bg-white/20">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/20">
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <span className="text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Video Info */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{video.views.toLocaleString()} views</span>
              </div>
              <span>•</span>
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={onLike}>
                <Heart className="h-4 w-4 mr-2" />
                {video.likes}
              </Button>
              <Button variant="outline" size="sm" onClick={onComment}>
                <MessageCircle className="h-4 w-4 mr-2" />
                {video.comments}
              </Button>
              <Button variant="outline" size="sm" onClick={onShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Uploader Info */}
        {video.uploader && (
          <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={video.uploader.avatar || "/placeholder.svg"} alt={video.uploader.name} />
              <AvatarFallback>{video.uploader.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">{video.uploader.name}</h3>
                {video.uploader.isVerified && <Badge variant="outline">Verified</Badge>}
              </div>
            </div>
            <Button variant="outline" size="sm">
              Follow
            </Button>
          </div>
        )}

        {/* Video Description */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{video.category}</Badge>
            {video.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          {video.description && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{video.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
