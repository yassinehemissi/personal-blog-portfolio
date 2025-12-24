"use client"

import { Moon, Sun, Search, ArrowLeft } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"

function BlogPostContent({ params }: { params: { slug: string } }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark")
    setIsDark(!isDark)
  }

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
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
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
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-24 z-40">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors font-medium mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </div>
          </aside>

          {/* Blog Post */}
          <article className="flex-1 max-w-2xl">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 text-balance">
              Building Scalable AI Systems with Modern Architectures
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400 mb-12 pb-8 border-b border-slate-200 dark:border-slate-800">
              <span>Dec 15, 2024</span>
              <span>•</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                AI & ML
              </span>
              <span>•</span>
              <span>12 min read</span>
            </div>

            <div className="prose prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
              <p>
                In the rapidly evolving landscape of artificial intelligence, building systems that scale effectively is
                becoming increasingly critical. This article explores modern architectural approaches that combine
                transformer models, distributed systems, and cloud infrastructure.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8">
                Understanding Modern Architectures
              </h2>

              <p>
                Transformer architectures have revolutionized deep learning, providing a foundation for state-of-the-art
                models in NLP, vision, and multimodal applications. However, scaling these models to production requires
                careful consideration of computational efficiency, memory management, and distributed computing
                patterns.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8">Practical Implementation</h2>

              <p>When implementing scalable AI systems, consider these key principles:</p>

              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                <li>Model quantization and pruning to reduce memory footprint</li>
                <li>Distributed training across multiple GPUs and TPUs</li>
                <li>Efficient inference serving with batching and caching</li>
                <li>Monitoring and observability for production systems</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-8">Conclusion</h2>

              <p>
                Building AI systems that scale requires a holistic approach combining model optimization, infrastructure
                design, and operational practices. By implementing these strategies, organizations can build AI
                solutions that are both effective and maintainable in production environments.
              </p>
            </div>
          </article>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <p>© 2025 Mohamed Yassine Hemissi. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Accessibility
            </a>
            <a href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Privacy
            </a>
            <a href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              RSS
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={null}>
      <BlogPostContent params={params} />
    </Suspense>
  )
}
