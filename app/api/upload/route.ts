import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { auth } from "@/lib/auth"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST() {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const timestamp = Math.round(new Date().getTime() / 1000)
        const folder = "kaushalx-library"

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder,
            },
            process.env.CLOUDINARY_API_SECRET!,
        )

        return NextResponse.json({
            timestamp,
            signature,
            folder,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
        })
    } catch (error) {
        console.error("Upload signature error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
