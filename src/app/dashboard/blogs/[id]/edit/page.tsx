// app/dashboard/blogs/[id]/edit/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [imageUrl, setImageUrl] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const ref = doc(db, "blogs", id);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {


        const data = snapshot.data();
        setTitle(data.title);
        setSummary(data.summary);
        setContent(data.content);
        setImageUrl(data.imageUrl);
        setLoading(false);
      } else {
        alert("Blog not found");
        router.push("/dashboard/blogs");
      }
    };
    fetchBlog();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = imageUrl;

      // Optional: Re-upload image if changed
      if (newImage) {
        const formData = new FormData();
        formData.append("file", newImage);
        formData.append("upload_preset", "blog_upload");

        const uploadRes = await fetch(
          "https://api.cloudinary.com/v1_1/dgahlqrhz/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.secure_url;
      }

      await updateDoc(doc(db, "blogs", id), {
        title,
        summary,
        content,
        imageUrl: finalImageUrl,
        updatedAt: Timestamp.now(),
      });

      alert("✅ Blog updated!");
      router.push("/dashboard/blogs");
    } catch (err: any) {
      console.error(err);
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

        <p className="text-sm text-gray-600">Current Image:</p>
        <img
          src={imageUrl}
          alt="Current blog image"
          className="w-full h-48 object-cover rounded mb-2"
        />
        <input
          type="file"
          onChange={(e) => setNewImage(e.target.files?.[0] || null)}
        />

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
