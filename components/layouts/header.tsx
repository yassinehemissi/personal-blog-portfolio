"use client";

import { ThemeContext } from "@/contexts/theme-context";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-4 md:gap-4 md:flex-row">
        <Link href="/" className="min-w-0 w-full md:w-auto">
          <div className="leading-tight text-center md:text-left">
            <p className="text-base font-semibold tracking-[-0.02em] text-slate-900 dark:text-white md:text-lg">
              Mohamed Yassine Hemissi
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">
              Student • Dreamer • Human
            </p>
          </div>
        </Link>

        <div className="flex w-full items-center gap-2 md:w-auto">
          <nav className="flex flex-1 items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 md:flex-none">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 rounded-full px-3 py-1.5 text-center text-sm transition-colors md:flex-none ${
                  isActive(item.href)
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={toggleTheme}
            className="rounded-full border border-slate-200 p-2.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
