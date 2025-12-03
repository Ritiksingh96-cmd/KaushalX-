import { FileUploader } from "@/components/upload/file-uploader"
import { MainHeader } from "@/components/navigation/main-header"

export default function UploadPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-10 px-4">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Upload to Library</h1>
                        <p className="text-muted-foreground">
                            Share your learning resources, guides, and materials with the KaushalX community.
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <FileUploader />
                    </div>
                </div>
            </div>
        </div>
    )
}
