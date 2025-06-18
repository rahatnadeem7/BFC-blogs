import { Timestamp } from 'firebase/firestore'

export interface BlogPostType {
    id: string
    slug: string
    title: string
    summary: string
    content: string
    imageUrl: string // Cloudinary URL
    createdAt?: Timestamp // Firebase Timestamp
    updatedAt?: Timestamp // Firebase Timestamp
    author?: {
      name: string
      role: string
      avatar: string
    }
    readTime?: string
    category?: string
    featured?: boolean
}

export interface BlogFormData {
    title: string
    summary: string
    content: string
    imageUrl: string
    category?: string
    featured?: boolean
}

export interface User {
    email: string
    name: string
}
  