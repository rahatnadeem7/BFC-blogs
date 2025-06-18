import { BlogListRealtime } from "@/app/components/BlogListRealtime"

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 border-b">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">Think different.</h1>
          <p className="text-2xl  text-gray-600 font-light mb-2">
            Stories that inspire innovation and creativity in technology and design.
          </p>
        </div>
      </section>
      <BlogListRealtime />
    </div>
  )
}
