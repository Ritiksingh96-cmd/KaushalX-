import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

import { CloudinaryService } from "@/lib/cloudinary"
import { VideoService } from "@/lib/database/videos"
import { z } from "zod"

const uploadVideoSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().optional(),
  category: z.enum(["tutorial", "demo", "review", "discussion"]),
  tags: z.array(z.string()).max(10, "Too many tags"),
  isPublic: z.boolean().default(true),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("video") as File
    const metadata = formData.get("metadata") as string

    if (!file) {
      return NextResponse.json({ error: "No video file provided" }, { status: 400 })
    }

    if (!metadata) {
      return NextResponse.json({ error: "No metadata provided" }, { status: 400 })
    }

    // Validate file type and size
    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload MP4, WebM, MOV, or AVI files." },
        { status: 400 },
      )
    }

    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 100MB." }, { status: 400 })
    }

    // Parse and validate metadata
    const parsedMetadata = JSON.parse(metadata)
    const validatedData = uploadVideoSchema.parse(parsedMetadata)

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await CloudinaryService.uploadVideo(buffer, {
      folder: `tamupro/videos/${session.user.id}`,
      transformation: [
        {
          quality: "auto",
          format: "mp4",
        },
      ],
    })

    // Generate thumbnail
    const thumbnailUrl = CloudinaryService.generateThumbnail(uploadResult.public_id)

    // Save video metadata to database
    const video = await VideoService.createVideo({
      uploaderId: session.user.id,
      title: validatedData.title,
      description: validatedData.description || "",
      filename: file.name,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      duration: uploadResult.duration,
      thumbnail: thumbnailUrl,
      cloudinaryUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      category: validatedData.category,
      tags: validatedData.tags,
      isPublic: validatedData.isPublic,
    } as any)

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
        isPublic: video.isPublic,
        createdAt: video.createdAt,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Video upload error:", error)
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 })
  }
}
