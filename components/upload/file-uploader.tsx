"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Check, X, FileIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface FileUploaderProps {
    onUploadComplete?: (url: string, publicId: string) => void
}

export function FileUploader({ onUploadComplete }: FileUploaderProps) {
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadedUrl, setUploadedUrl] = useState("")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setUploadedUrl("")
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setIsUploading(true)
        try {
            // 1. Get signature from server
            const signatureRes = await fetch("/api/upload", {
                method: "POST",
            })

            if (!signatureRes.ok) throw new Error("Failed to get upload signature")

            const { timestamp, signature, folder, cloudName, apiKey } = await signatureRes.json()

            // 2. Upload to Cloudinary
            const formData = new FormData()
            formData.append("file", file)
            formData.append("api_key", apiKey)
            formData.append("timestamp", timestamp.toString())
            formData.append("signature", signature)
            formData.append("folder", folder)

            const uploadRes = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            )

            if (!uploadRes.ok) throw new Error("Upload failed")

            const data = await uploadRes.json()
            setUploadedUrl(data.secure_url)
            toast.success("File uploaded successfully!")

            if (onUploadComplete) {
                onUploadComplete(data.secure_url, data.public_id)
            }
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Failed to upload file")
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Upload Resource</CardTitle>
                <CardDescription>Share files with the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="file">File</Label>
                    <Input id="file" type="file" onChange={handleFileChange} disabled={isUploading} />
                </div>

                {file && (
                    <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                        <div className="flex items-center space-x-2 truncate">
                            <FileIcon className="h-4 w-4 flex-shrink-0" />
                            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setFile(null)
                                setUploadedUrl("")
                            }}
                            disabled={isUploading}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {uploadedUrl && (
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                        <Check className="h-4 w-4" />
                        <AlertDescription>
                            Upload complete! <a href={uploadedUrl} target="_blank" rel="noreferrer" className="underline font-medium">View File</a>
                        </AlertDescription>
                    </Alert>
                )}

                <Button
                    className="w-full"
                    onClick={handleUpload}
                    disabled={!file || isUploading || !!uploadedUrl}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload to Library
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}
