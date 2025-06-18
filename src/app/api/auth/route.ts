import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { findAdminByEmail } from "@/config/admins"

// Simple in-memory rate limiting
const loginAttempts = new Map<string, { count: number; timestamp: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Check rate limiting
    const now = Date.now()
    const attempt = loginAttempts.get(email)
    
    if (attempt) {
      // Reset if window has passed
      if (now - attempt.timestamp > WINDOW_MS) {
        loginAttempts.set(email, { count: 1, timestamp: now })
      } 
      // Check if too many attempts
      else if (attempt.count >= MAX_ATTEMPTS) {
        return NextResponse.json(
          { error: "Too many login attempts. Please try again later." },
          { status: 429 }
        )
      }
      // Increment attempt count
      else {
        attempt.count++
      }
    } else {
      // First attempt
      loginAttempts.set(email, { count: 1, timestamp: now })
    }

    // Find admin by email
    const admin = findAdminByEmail(email)
    
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Verify password
    if (admin.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        email: admin.email,
        name: admin.name
      }
    })

    // Set cookie
    response.cookies.set("admin_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return response

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    )
  }
} 