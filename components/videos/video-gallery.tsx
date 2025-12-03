"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Upload, Play, Eye, ThumbsUp, Filter } from "lucide-react"
import Link from "next/link"

interface Video {
  _id: string
  title: string
  description: string
  thumbnail: string
  duration: number
  views: number
  likes: number
  skillTags: string[]
  uploadedBy: {
    name: string
    avatar: string
  }
  uploadedAt: string
}

export function VideoGallery() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos")
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos || [])
      }
    } catch (error) {
      console.error("Error fetching videos:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const mockVideos: Video[] = [
    {
      _id: "1",
      title: "Introduction to React Hooks",
      description: "Learn the basics of React Hooks and how to use them effectively",
      thumbnail: "/react-hooks-tutorial.png",
      duration: 1200,
      views: 1500,
      likes: 89,
      skillTags: ["React", "JavaScript", "Frontend"],
      uploadedBy: {
        name: "John Doe",
        avatar: "/diverse-profile-avatars.png",
      },
      uploadedAt: "2024-01-15T10:00:00Z",
    },
    {
      _id: "2",
      title: "Python Data Analysis with Pandas",
      description: "Complete guide to data analysis using Python and Pandas library",
      thumbnail: "/python-pandas-data-analysis.jpg",
      duration: 1800,
      views: 2300,
      likes: 156,
      skillTags: ["Python", "Data Science", "Pandas"],
      uploadedBy: {
        name: "Sarah Smith",
        avatar: "/female-profile-avatar.png",
      },
      uploadedAt: "2024-01-14T14:30:00Z",
    },
    {
      _id: "3",
      title: "UI/UX Design Principles",
      description: "Essential design principles every designer should know",
      thumbnail: "/ui-ux-principles.png",
      duration: 900,
      views: 890,
      likes: 67,
      skillTags: ["Design", "UI/UX", "Figma"],
      uploadedBy: {
        name: "Mike Johnson",
        avatar: "/male-designer-avatar.jpg",
      },
      uploadedAt: "2024-01-13T09:15:00Z",
    },
  ]

  const displayVideos = videos.length > 0 ? videos : mockVideos

  const filteredVideos = displayVideos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.skillTags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory =
      selectedCategory === "all" ||
      video.skillTags.some((tag) => tag.toLowerCase().includes(selectedCategory.toLowerCase()))

    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Learning Videos</h1>
          <p className="text-muted-foreground">Discover educational content from our community</p>
        </div>
        <Button asChild>
          <Link href="/videos/upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload Video
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search videos, skills, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Categories</option>
            <option value="react">React</option>
            <option value="python">Python</option>
            <option value="design">Design</option>
            <option value="javascript">JavaScript</option>
            <option value="data">Data Science</option>
          </select>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No videos found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredVideos.map((video) => (
            <Card key={video._id} className="group hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-t-lg flex items-center justify-center">
                  <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(video.duration)}
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-2 mb-2">{video.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{video.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {video.skillTags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <img
                      src={video.uploadedBy.avatar || "/placeholder.svg"}
                      alt={video.uploadedBy.name}
                      className="h-6 w-6 rounded-full"
                    />
                    <span>{video.uploadedBy.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{video.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{video.likes}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
