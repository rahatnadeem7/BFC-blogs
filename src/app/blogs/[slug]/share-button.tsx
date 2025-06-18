"use client"

import { Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface SerializedBlogPost {
  id: string
  title: string
  summary: string
  content: string
  imageUrl: string
  slug: string
  createdAt: string | null
  updatedAt?: string | null
}

interface ShareButtonProps {
  post: SerializedBlogPost
}

export function ShareButton({ post }: ShareButtonProps) {
  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.summary,
          url: url
        })
        // Share was successful
        toast("Shared successfully!")
      } catch (err) {
        // Only show error if it's not a user cancellation
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error sharing:', err)
          toast("Failed to share", {
            description: "Please try again or copy the link manually"
          })
        }
      }
    } else {
      // Fallback to clipboard copy
      try {
        await navigator.clipboard.writeText(url)
        toast("Link copied!", {
          description: "Blog post URL copied to clipboard"
        })
      } catch (err) {
        console.error('Error copying to clipboard:', err)
        toast("Failed to copy link", {
          description: "Please try copying the URL manually"
        })
      }
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="text-gray-600 hover:text-gray-900"
      onClick={handleShare}
    >
      <Share className="w-4 h-4 mr-2" />
      Share
    </Button>
  )
} 