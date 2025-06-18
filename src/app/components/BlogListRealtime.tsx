"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { BlogPost } from "@/app/components/blog-post"
import type { BlogPostType } from "@/lib/types"

export function BlogListRealtime() {
  const [posts, setPosts] = useState<BlogPostType[]>([])

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setPosts(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BlogPostType[]
      )
    })
    return () => unsubscribe()
  }, [])

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">No posts found</h1>
          <p className="text-gray-600">Check back later for new content.</p>
        </div>
      </div>
    )
  }

  const featuredPost = posts[0]
  const regularPosts = posts.slice(1)

  return (
    <div className="min-h-screen bg-white">
      {/* Featured Post */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">Featured Story</h2>
          </div>
          <BlogPost post={featuredPost} featured={true} />
        </div>
      </section>

      {/* Regular Posts Grid */}
      {regularPosts.length > 0 && (
        <section className="pb-24 bg-gray-50/50">
          <div className="max-w-6xl mx-auto px-6 pt-20">
            <div className="mb-16 text-center">
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">Latest Stories</h2>
              <p className="text-xl text-gray-600 font-normal max-w-2xl mx-auto">
              Dive into matchday drama, player spotlights, and the stories that define the beautiful game.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              {regularPosts.map((post) => (
                <BlogPost key={post.id} post={post} featured={false} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
} 