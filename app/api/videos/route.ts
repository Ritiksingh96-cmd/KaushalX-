import { type NextRequest, NextResponse } from "next/server"
import { VideoService } from "@/lib/database/videos"
import { UserService } from "@/lib/database/users"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const tags = searchParams.get("tags")?.split(",") || undefined
    const searchTerm = searchParams.get("search") || undefined
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const videos = await VideoService.findPublicVideos(
      {
        category,
        tags,
        searchTerm,
      },
      limit,
      offset,
    )

    // Get uploader info for each video
    const videosWithUploaders = await Promise.all(
      videos.map(async (video) => {
        const uploader = await UserService.findUserById(video.uploaderId)
        return {
          id: video._id,
          title: video.title,
          description: video.description,
          thumbnail: video.thumbnail,
          url: video.cloudinaryUrl,
          duration: video.duration,
          category: video.category,
          tags: video.tags,
          views: video.views,
          likes: video.likes.length,
          comments: video.comments.length,
          createdAt: video.createdAt,
          uploader: uploader
            ? {
                id: uploader._id,
                name: uploader.name,
                avatar: uploader.avatar,
                isVerified: uploader.isVerified,
              }
            : null,
        }
      }),
    )

    return NextResponse.json({ videos: videosWithUploaders })
  } catch (error) {
    console.error("Get videos error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
