"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Pagination from "../ui/pagination";

interface BlogPost {
  slug: string;
  title: string;
  author: string;
  categories: string[];
  post_date: string;
  update_date: string;
  excerpt: string;
  readTime: string;
  content: string;
}

interface BlogClientProps {
  blogPosts: BlogPost[];
  categories: string[];
}

const POSTS_PER_PAGE = 5;

export default function BlogClient({ blogPosts, categories }: BlogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const allCategories = ["All", ...categories];

  // Filter posts based on category and search
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesCategory = selectedCategory === "All" || post.categories.includes(selectedCategory);
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [blogPosts, selectedCategory, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
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
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Info */}
            {filteredPosts.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Blog Posts */}
        <div className="flex-1 max-w-2xl pt-12">
          <div className="space-y-8">
            {currentPosts.map((post) => (
              <article key={post.slug} className="pb-8 border-b border-slate-200 dark:border-slate-800 last:border-b-0">
                <Link href={`/blog/${post.slug}`} className="group">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{post.excerpt}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <span>{formatDate(post.post_date)}</span>
                  <span>•</span>
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((category) => (
                      <span key={category} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                        {category}
                      </span>
                    ))}
                  </div>
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

          {/* Pagination */}
          {filteredPosts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredPosts.length}
              itemsPerPage={POSTS_PER_PAGE}
            />
          )}
        </div>
      </div>
    </div>
  );
}