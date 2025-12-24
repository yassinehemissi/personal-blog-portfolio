"use client"

import { Moon, Sun, Search } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Suspense } from "react"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  category: string
  readTime: string
  slug: string
}

const blogPosts: BlogPost[] = [
  ]

const categories: string[] = []

function BlogPageContent() {
  const [isDark, setIsDark] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark")
    setIsDark(!isDark)
  }

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <Link
              href="/"
              className="text-2xl font-bold text-slate-900 dark:text-white hover:opacity-80 transition-opacity"
            >
              Mohamed Yassine Hemissi
            </Link>
            <nav className="flex items-center gap-8 flex-wrap justify-center md:justify-end w-full md:w-auto">
              <Link
                href="/"
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/projects"
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Projects
              </Link>
              <Link
                href="/blog"
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-semibold"
              >
                Blog
              </Link>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="w-5 h-5 text-slate-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Search className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-24 z-40 pt-12">
              {/* Title */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Blog</h1>
                <p className="text-slate-600 dark:text-slate-400">Thoughts on AI, engineering, and life.</p>
              </div>

              {/* Search */}
              <div className="mb-8">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.length ? categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                      }`}
                    >
                      {category}
                    </button>
                  )): <i>"No categories for now"</i>}
                </div>
              </div>
            </div>
          </aside>

          {/* Blog Posts */}
          <div className="flex-1 max-w-2xl pt-12">
            <div className="space-y-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="pb-8 border-b border-slate-200 dark:border-slate-800 last:border-b-0">
                  <Link href={`/blog/${post.slug}`} className="group">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{post.excerpt}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                      {post.category}
                    </span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </article>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  No posts found. Try a different search or category.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <p>© 2025 Mohamed Yassine Hemissi. All rights reserved.</p>
          <div className="flex gap-6">

          </div>
        </div>
      </footer>
    </div>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={null}>
      <BlogPageContent />
    </Suspense>
  )
}
