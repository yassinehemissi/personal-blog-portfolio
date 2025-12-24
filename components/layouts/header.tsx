"use client";

import { ThemeContext } from "@/contexts/theme-context";
import { Moon, Sun, Search } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";

export default function Header() {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Mohamed Yassine Hemissi
          </h1>
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
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-slate-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Search className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
