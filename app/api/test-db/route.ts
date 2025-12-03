import { NextResponse } from "next/server"
import { findUserByEmail } from "@/lib/database/users"

export async function GET() {
    try {
        console.log("Testing findUserByEmail...")
        const user = await findUserByEmail("test@example.com")
        console.log("findUserByEmail result:", user)
        return NextResponse.json({ status: "success", user })
    } catch (error) {
        console.error("Test DB Error:", error)
        return NextResponse.json({ status: "error", error: String(error) }, { status: 500 })
    }
}
