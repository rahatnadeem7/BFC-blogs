// app/dashboard/blogs/[id]/edit/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { id } = use(params);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    const fetchBlog = async () => {
      const ref = doc(db, "blogs", id);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setTitle(data.title);
        setSummary(data.summary);
        setContent(data.content);
        setImageUrls(data.imageUrls || (data.imageUrl ? [data.imageUrl] : []));
        setLoading(false);
      } else {
        alert("Blog not found");
        router.push("/dashboard/blogs");
      }
    };
    fetchBlog();
  }, [id, router]);

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Add new files to existing newImages, avoiding duplicates
    const newFiles = files.filter(
      file => !newImages.some(img => img.name === file.name && img.size === file.size)
    );
    setNewImages([...newImages, ...newFiles]);
  };

  const handleRemoveImage = (idx: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== idx));
  };

  const handleRemoveNewImage = (idx: number) => {
    setNewImages(newImages.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalImageUrls = [...imageUrls];
      // Upload new images to Cloudinary
      for (const img of newImages) {
        const formData = new FormData();
        formData.append("file", img);
        formData.append("upload_preset", "blog_upload");
        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dgahlqrhz/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const uploadData = await uploadRes.json();
        finalImageUrls.push(uploadData.secure_url);
      }

      await updateDoc(doc(db, "blogs", id), {
        title,
        summary,
        content,
        imageUrls: finalImageUrls,
        updatedAt: Timestamp.now(),
      });

      alert("✅ Blog updated!");
      router.push("/dashboard/blogs");
    } catch (error: unknown) {
      console.error('Error updating blog:', error);
      alert("❌ Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border rounded px-4 py-2"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border rounded px-4 py-2"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <textarea
          className="w-full border rounded px-4 py-2 h-40"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <p className="text-sm text-gray-600">Current Images:</p>
        <div className="flex gap-2 flex-wrap mb-2">
          {imageUrls.map((url, idx) => (
            <div key={idx} className="relative w-32 h-32">
              <Image
                width={800}   
                height={450}
                src={url}
                alt={`Current image ${idx + 1}`}
                fill
                className="object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                title="Remove image"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600">Add More Images:</p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleNewImages}
        />
        {newImages.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {newImages.map((file, idx) => (
              <div key={idx} className="relative w-32 h-32">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`New image ${idx + 1}`}
                  fill
                  className="object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  title="Remove new image"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}
