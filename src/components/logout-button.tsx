"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    // Remove the email cookie
    document.cookie = "user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    toast.success("Logged out successfully")
    router.push("/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      Logout
    </button>
  )
} 