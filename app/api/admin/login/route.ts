import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { compareSync } from "bcryptjs"

const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH

export async function POST(request: Request) {
  console.log("Login route accessed")

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
    console.error("Admin credentials are not properly configured in environment variables.")
    return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { username, password } = body

    console.log(`Login attempt for username: ${username}`)

    if (!username || !password) {
      console.log("Missing username or password")
      return NextResponse.json({ success: false, error: "Username and password are required" }, { status: 400 })
    }

    const isUsernameMatch = username === ADMIN_USERNAME
    const isPasswordMatch = compareSync(password, ADMIN_PASSWORD_HASH)

    console.log(`Username match: ${isUsernameMatch}, Password match: ${isPasswordMatch}`)

    if (isUsernameMatch && isPasswordMatch) {
      const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

      cookies().set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600, // 1 hour
        path: "/",
      })

      console.log("Login successful, session token set")
      return NextResponse.json({ success: true })
    } else {
      console.log("Login failed: Invalid credentials")
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
