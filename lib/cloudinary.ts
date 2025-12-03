import { v2 as cloudinary } from "cloudinary"

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error("Missing Cloudinary environment variables")
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  format: string
  resource_type: string
  bytes: number
  duration?: number
  width?: number
  height?: number
  created_at: string
}

export class CloudinaryService {
  static async uploadVideo(
    buffer: Buffer,
    options: {
      folder?: string
      public_id?: string
      resource_type?: "video" | "image" | "raw" | "auto"
      transformation?: any[]
    } = {},
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: "video" as const,
        folder: "kaushalx/videos",
        quality: "auto",
        format: "mp4",
        ...options,
      }

      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve(result as CloudinaryUploadResult)
        } else {
          reject(new Error("Upload failed - no result"))
        }
      })

      uploadStream.end(buffer)
    })
  }

  static async uploadImage(
    buffer: Buffer,
    options: {
      folder?: string
      public_id?: string
      transformation?: any[]
    } = {},
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: "image" as const,
        folder: "kaushalx/images",
        quality: "auto",
        format: "webp",
        ...options,
      }

      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve(result as CloudinaryUploadResult)
        } else {
          reject(new Error("Upload failed - no result"))
        }
      })

      uploadStream.end(buffer)
    })
  }

  static async deleteResource(publicId: string, resourceType: "video" | "image" = "video"): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
      return result.result === "ok"
    } catch (error) {
      console.error("Error deleting resource:", error)
      return false
    }
  }

  static generateThumbnail(publicId: string, options: { width?: number; height?: number } = {}): string {
    return cloudinary.url(publicId, {
      resource_type: "video",
      format: "jpg",
      transformation: [
        {
          width: options.width || 400,
          height: options.height || 300,
          crop: "fill",
          quality: "auto",
        },
      ],
    })
  }

  static generateVideoUrl(
    publicId: string,
    options: {
      quality?: string
      format?: string
      width?: number
      height?: number
    } = {},
  ): string {
    return cloudinary.url(publicId, {
      resource_type: "video",
      quality: options.quality || "auto",
      format: options.format || "mp4",
      transformation:
        options.width || options.height ? [{ width: options.width, height: options.height, crop: "scale" }] : undefined,
    })
  }
}

export default cloudinary
