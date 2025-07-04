"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { db } from "@/lib/firebase"
import { addDoc, collection, Timestamp } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

import { Upload, FileText, Send, AlertCircle } from "lucide-react"

export default function AdminPage() {
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!title.trim()) newErrors.title = "Title is required"
    if (!summary.trim()) newErrors.summary = "Summary is required"
    if (!content.trim()) newErrors.content = "Content is required"
    if (images.length === 0) newErrors.image = "Please select at least one image"

    if (title.length > 100) newErrors.title = "Title must be less than 100 characters"
    if (summary.length > 200) newErrors.summary = "Summary must be less than 200 characters"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Add new files to existing images, avoiding duplicates
    const newFiles = files.filter(
      file => !images.some(img => img.name === file.name && img.size === file.size)
    );
    const updatedImages = [...images, ...newFiles];
    setImages(updatedImages);
  
    // Generate previews for all images
    const previews = updatedImages.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below"
      })
      return
    }

    setLoading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Upload all images to Cloudinary
      const imageUrls: string[] = [];
      for (const img of images) {
        const formData = new FormData();
        formData.append("file", img);
        formData.append("upload_preset", "blog_upload");

        const uploadRes = await fetch("https://api.cloudinary.com/v1_1/dgahlqrhz/image/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadData.error?.message || "Upload failed");
        }

        imageUrls.push(uploadData.secure_url);
      }

      setUploadProgress(95)

      // Save blog to Firestore
      await addDoc(collection(db, "blogs"), {
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        imageUrls,
        createdAt: Timestamp.now(),
        slug: title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      })

      setUploadProgress(100)

      toast({
        title: "Success!",
        description: "Blog post created successfully",
      })

      // Reset form
      setTitle("")
      setSummary("")
      setContent("")
      setImages([])
      setImagePreviews([])
      setErrors({})
    } catch (error: unknown) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Something went wrong"
      })
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-3xl items-center justify-center flex bg-gray-700 p-4 gap-12">
      <div className="mb-8 text-center  ">
        <Button asChild size="lg" className="gap-2 px-8 py-3  hover:bg-gray-500">
              <Link href="/dashboard/blogs/">
                
                Manage Blog
              </Link>
            </Button>
        </div>
      <div className="max-w-4xl mx-auto">
        

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5" />
              Blog Post Details
            </CardTitle>
            <CardDescription className="text-blue-100">
              Fill in the information below to create your blog post
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
                  Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter an engaging title..."
                  className="h-12 text-lg"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    if (errors.title) setErrors((prev) => ({ ...prev, title: "" }))
                  }}
                />
                {errors.title && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{errors.title}</AlertDescription>
                  </Alert>
                )}
                <p className="text-xs text-slate-500">{title.length}/100 characters</p>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <Label htmlFor="summary" className="text-sm font-semibold text-slate-700">
                  Summary *
                </Label>
                <Input
                  id="summary"
                  type="text"
                  placeholder="Brief description of your post..."
                  className="h-12"
                  value={summary}
                  onChange={(e) => {
                    setSummary(e.target.value)
                    if (errors.summary) setErrors((prev) => ({ ...prev, summary: "" }))
                  }}
                />
                {errors.summary && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{errors.summary}</AlertDescription>
                  </Alert>
                )}
                <p className="text-xs text-slate-500">{summary.length}/200 characters</p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-semibold text-slate-700">
                  Content *
                </Label>
                <Textarea
                  id="content"
                  placeholder="Write your blog content here..."
                  className="min-h-[200px] resize-y"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value)
                    if (errors.content) setErrors((prev) => ({ ...prev, content: "" }))
                  }}
                />
                {errors.content && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{errors.content}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-slate-700">Images *</Label>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <Label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      >
                        <Upload className="h-8 w-8 text-slate-400 mb-2" />
                        <span className="text-sm text-slate-600">
                          {images.length > 0 ? "Select more images" : "Click to upload images"}
                        </span>
                        <span className="text-xs text-slate-400 mt-1">PNG, JPG, GIF up to 10MB each</span>
                      </Label>
                    </div>
                    {errors.image && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">{errors.image}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {imagePreviews.map((src, idx) => (
                        <div key={idx} className="relative w-32 h-32 mb-4">
                          <Image
                            src={src}
                            alt={`Preview ${idx + 1}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {loading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Uploading...</span>
                    <span className="text-slate-600">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Publish Post
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
