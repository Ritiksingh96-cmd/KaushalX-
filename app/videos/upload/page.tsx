import { VideoUpload } from "@/components/videos/video-upload"
import { auth } from "@/lib/auth"

import { redirect } from "next/navigation"

export default async function VideoUploadPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Share Your Knowledge</h1>
          <p className="text-muted-foreground">
            Upload tutorial videos to help others learn new skills and grow the community
          </p>
        </div>
        <VideoUpload
          onUploadComplete={(video) => {
            console.log("Video uploaded:", video)
            // Redirect to video page or show success message
          }}
        />
      </div>
    </div>
  )
}
