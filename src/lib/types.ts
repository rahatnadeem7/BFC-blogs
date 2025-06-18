export interface BlogPostType {
    id: string
    slug: string
    title: string
    summary: string
    content: string
    imageUrl: string // Cloudinary URL
    createdAt?: any // Firebase Timestamp
    author?: {
      name: string
      role: string
      avatar: string
    }
    readTime?: string
    category?: string
    featured?: boolean
  }
  