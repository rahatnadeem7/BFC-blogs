import Image from "next/image"
import Link from "next/link"
import { getBlogPost } from "@/lib/firebase"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { ShareButton } from "./share-button"

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold text-gray-900">Post not found</h1>
          <p className="text-gray-600">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Stories</span>
          </Link>
        </div>
      </div>
    )
  }

  // Serialize the post data for client components
  const serializedPost = {
    id: post.id,
    title: post.title,
    summary: post.summary,
    content: post.content,
    imageUrl: post.imageUrl,
    slug: post.slug,
    createdAt: post.createdAt?.toDate?.()?.toISOString() || null,
    updatedAt: post.updatedAt?.toDate?.()?.toISOString() || null
  }

  // Format the date for display
  const formattedDate = post.createdAt?.toDate
    ? post.createdAt.toDate().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "No date"

  // Split content into paragraphs
  const contentParagraphs = post.content.split("\n\n").filter((p) => p.trim())

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>Back to Stories</span>
              </button>
            </Link>
            <ShareButton post={serializedPost} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {Math.ceil(post.content.length / 1000)} min read
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          {post.summary && (
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-light">
              {post.summary}
            </p>
          )}
        </div>

        {/* Hero Image */}
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-16 shadow-2xl">
          <Image
            src={post.imageUrl || "/placeholder.svg?height=600&width=1200"}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="prose prose-lg prose-gray max-w-none">
          {contentParagraphs.map((paragraph, index) => {
            // Check if paragraph looks like a heading (starts with # or is short and ends with :)
            if (paragraph.startsWith("#")) {
              const headingText = paragraph.replace(/^#+\s*/, "")
              return (
                <h2 key={index} className="text-3xl font-semibold text-gray-900 mt-12 mb-6">
                  {headingText}
                </h2>
              )
            }

            // Check if paragraph looks like a quote (starts with > or is wrapped in quotes)
            if (paragraph.startsWith(">") || (paragraph.startsWith('"') && paragraph.endsWith('"'))) {
              const quoteText = paragraph.replace(/^>\s*/, "").replace(/^"|"$/g, "")
              return (
                <blockquote key={index} className="border-l-4 border-gray-200 pl-6 my-8 italic text-xl text-gray-600">
                  {quoteText}
                </blockquote>
              )
            }

            // Regular paragraph
            return (
              <p key={index} className="text-lg text-gray-700 leading-relaxed mb-8 font-light">
                {paragraph}
              </p>
            )
          })}

          {/* Key Takeaways Section - only show if content is substantial */}
          {post.content.length > 1000 && (
            <div className="bg-gray-50 rounded-2xl p-8 mt-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">About This Post</h3>
              <div className="space-y-3 text-lg text-gray-700">
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  Published on {formattedDate}
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  Estimated {Math.ceil(post.content.length / 1000)} minute read
                </div>
                {post.summary && (
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                    {post.summary}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Author Section - placeholder since author info might not be in Firebase */}
        {/* <div className="border-t border-gray-100 pt-12 mt-16">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
              <Image
                src="/placeholder.svg?height=64&width=64"
                alt="Author"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Blog Author</h4>
              <p className="text-gray-600">Content Creator</p>
            </div>
          </div>
        </div> */}
      </article>
    </div>
  )
}
