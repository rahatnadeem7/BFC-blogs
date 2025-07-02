import Image from "next/image"
import Link from "next/link"
import type { BlogPostType } from "@/lib/types"
import { Timestamp } from "firebase/firestore"

interface BlogPostProps {
  post: BlogPostType
  featured?: boolean
}

export function BlogPost({ post, featured = false }: BlogPostProps) {
  if (!post) {
    return null
  }

  const formatDate = (date: Timestamp | Date | undefined) => {
    if (!date) return "No date"
    
    try {
      // Handle Firebase Timestamp
      if (date instanceof Timestamp) {
        return date.toDate().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      }
      
      // Handle regular Date object
      if (date instanceof Date) {
        return date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric", 
          year: "numeric",
        })
      }
      
      return "No date"
    } catch (error) {
      console.error('Date formatting error:', error)
      return "No date"
    }
  }

  return (
    <article className={`rounded-3xl shadow-lg hover:shadow-2xl transition-shadow bg-white overflow-hidden ${
      featured ? 'max-w-4xl mx-auto' : ''
    }`}>
      <Link href={`/blogs/${post.slug}`} className="block">
        <div className="relative">
          <Image
            src={
              (post.imageUrls && post.imageUrls.length > 0)
                ? post.imageUrls[0]
                : post.imageUrl || "/placeholder.svg?height=400&width=600"
            }
            alt={post.title || "Blog post image"}
            width={featured ? 800 : 600}
            height={featured ? 500 : 400}
            className={`w-full object-cover ${featured ? 'h-80' : 'h-64'}`}
            priority={featured}
          />
        </div>
        <div className={`${featured ? 'p-12' : 'p-8'}`}>
          <div className="text-gray-500 text-sm mb-2">
            {formatDate(post.createdAt)}
            
          </div>
          <h2 className={`font-semibold text-gray-900 mb-2 ${
            featured ? 'text-3xl' : 'text-2xl'
          }`}>
            {post.title}
          </h2>
          {post.summary && (
            <p className={`text-gray-600 mb-4 ${featured ? 'text-lg' : ''}`}>
              {post.summary}
            </p>
          )}
          <span className="text-blue-600 font-medium hover:underline">
            Read more &rarr;
          </span>
        </div>
      </Link>
    </article>
  )
}
