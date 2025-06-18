import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, query, orderBy, where, limit, Timestamp } from "firebase/firestore"
import type { BlogPostType } from "./types"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// Error handling wrapper
const handleFirebaseError = (error: Error, operation: string) => {
  console.error(`Firebase ${operation} error:`, error)
  throw new Error(`Failed to ${operation}: ${error.message}`)
}

export async function getBlogPosts(): Promise<BlogPostType[]> {
  try {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogPostType[]
  } catch (error) {
    handleFirebaseError(error as Error, "fetch blog posts")
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPostType | null> {
  try {
    const q = query(collection(db, "blogs"), where("slug", "==", slug))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        ...doc.data(),
      } as BlogPostType
    }

    return null
  } catch (error) {
    handleFirebaseError(error as Error, "fetch blog post")
    return null
  }
}

export async function getFeaturedPosts(): Promise<BlogPostType[]> {
  try {
    const q = query(
      collection(db, "blogs"), 
      where("featured", "==", true), 
      orderBy("createdAt", "desc"), 
      limit(3)
    )
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BlogPostType[]
  } catch (error) {
    handleFirebaseError(error as Error, "fetch featured posts")
    // If no featured posts, return first 3 regular posts
    const allPosts = await getBlogPosts()
    return allPosts.slice(0, 3)
  }
}

export function formatFirebaseDate(timestamp: Timestamp | Date | string | undefined): string {
  if (!timestamp) return ""

  // Handle Firebase Timestamp
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Handle regular Date
  if (timestamp instanceof Date) {
    return timestamp.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  // Handle string dates
  if (typeof timestamp === "string") {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  return ""
}

export function estimateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return `${minutes} min read`
}
