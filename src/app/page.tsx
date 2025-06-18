import { BlogListRealtime } from "@/app/components/BlogListRealtime"
import { ChevronDown } from "lucide-react"

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 border-b relative">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-center gap-6">
          {/* Logo Left */}
          <div className="flex-shrink-0">
            <img
              src="/BijbeharaFC Logo.png"
              alt="Bijbehara Football Club Logo"
              className="h-26 w-26 object-contain"
            />
          </div>

          {/* Text Right */}
          <div className="text-center sm:text-left">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
              Bijbehara Football Club
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 font-light">
              More than a club — a family united by the love for the game
            </p>
          </div>
        </div>
        {/* Swipe-down indicator */}
        <div className="absolute bottom-4 left-0 w-full flex flex-col items-center animate-bounce">
          <ChevronDown className="h-6 w-6 text-gray-600" />
          <p className="text-sm text-gray-600 mt-2 hidden sm:block">Scroll down to explore</p>
        </div>
      </section>
      <BlogListRealtime />
    </div>
  )
}
