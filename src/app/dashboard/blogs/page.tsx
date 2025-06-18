"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Trash2, Pencil } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore"
import Link from "next/link"

interface Blog {
  id: string
  title: string
  summary: string
  content: string
  imageUrl: string
  createdAt: any
  slug: string
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"))
        const querySnapshot = await getDocs(q)
        const blogsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Blog[]
        setBlogs(blogsData)
      } catch (error) {
        console.error("Error fetching blogs:", error)
        toast.error("Failed to fetch blogs")
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      await deleteDoc(doc(db, "blogs", id))
      setBlogs(blogs.filter(blog => blog.id !== id))
      toast.success("Blog deleted successfully")
    } catch (error) {
      console.error("Error deleting blog:", error)
      toast.error("Failed to delete blog")
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "No date"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Blogs</h2>
        <Button asChild>
          <Link href="/dashboard/blogs/create">Create New Blog</Link>
        </Button>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No blogs found. Create your first blog post!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{blog.title}</h3>
                  <p className="text-gray-600 mt-2">Published on {formatDate(blog.createdAt)}</p>
                  {blog.summary && (
                    <p className="text-gray-500 mt-2 line-clamp-2">{blog.summary}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                      <Pencil className="w-3 h-3 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={deleting === blog.id}
                      >
                        <Trash2 className="w-3 h-3 mr-2" />
                        {deleting === blog.id ? "..." : "Delete"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the blog post.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(blog.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
