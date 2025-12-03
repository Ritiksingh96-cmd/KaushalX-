import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { VideoService } from "@/lib/database/videos"
import { UserService } from "@/lib/database/users"

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const video = await VideoService.findVideoById(id)
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Increment view count
    await VideoService.incrementViews(id)

    // Get uploader info
    const uploader = await UserService.findUserById(video.uploaderId)

    return NextResponse.json({
      video: {
        id: video._id,
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail,
        url: video.cloudinaryUrl,
        duration: video.duration,
        category: video.category,
        tags: video.tags,
        views: video.views + 1, // Include the incremented view
        likes: video.likes.length,
        comments: video.comments.length,
        isPublic: video.isPublic,
        createdAt: video.createdAt,
        uploader: uploader
          ? {
            id: uploader._id,
            name: uploader.name,
            avatar: uploader.avatar,
            isVerified: uploader.isVerified,
          }
          : null,
      },
    })
  } catch (error) {
    console.error("Get video error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const deleted = await VideoService.deleteVideo(id, session.user.id)
    if (!deleted) {
      return NextResponse.json({ error: "Video not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete video error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
