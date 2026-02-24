import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const sessionToken = cookies().get("admin_session")?.value
    if (!sessionToken) {
      return NextResponse.json({ isLoggedIn: false, role: null })
    }

    // In a real application, you would verify the session token
    // and fetch the admin's role from your database
    // For now, we'll simulate this process
    const adminRole = sessionToken.includes("cfo") ? "cfo" : "admin"

    return NextResponse.json({ isLoggedIn: true, role: adminRole })
  } catch (error) {
    console.error("Check auth error:", error)
    return NextResponse.json({ isLoggedIn: false, role: null, error: "Internal server error" }, { status: 500 })
  }
}
