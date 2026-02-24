import { NextResponse } from "next/server"

export async function GET() {
  // In a real application, you would invalidate the session here
  // For this example, we'll just redirect to the login page
  return NextResponse.redirect(new URL("/admin/login", "https://talaritel.com"))
}
