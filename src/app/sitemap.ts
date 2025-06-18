import { getBlogPosts } from "@/lib/firebase"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bfc-blogs.vercel.app"
  
  // Get all blog posts
  const posts = await getBlogPosts()
  
  // Create sitemap entries for blog posts
  const blogEntries = posts.map((post) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: post.createdAt?.toDate?.() || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // Add static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ]

  return [...staticPages, ...blogEntries]
} 