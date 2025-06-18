import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getAuthorizedEmails } from "@/config/admins"

// Get authorized emails from config
const AUTHORIZED_EMAILS = getAuthorizedEmails()

export function middleware(request: NextRequest) {
  // Get the user's email from the session
  const userEmail = request.cookies.get("user_email")?.value

  // Check if the request is for the dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // If no email is found or email is not authorized, redirect to login
    if (!userEmail || !AUTHORIZED_EMAILS.includes(userEmail)) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/dashboard/:path*"],
} 