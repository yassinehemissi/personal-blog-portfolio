"use client";

import { ThemeContext } from "@/contexts/theme-context";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const pathname = usePathname();
  const [isMobileCompact, setIsMobileCompact] = useState(false);

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

  useEffect(() => {
    const compactThreshold = 44;
    const expandThreshold = 12;

    const onScroll = () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const currentY = window.scrollY;

      if (!isMobile) {
        setIsMobileCompact(false);
        return;
      }

      if (!isMobileCompact && currentY > compactThreshold) {
        setIsMobileCompact(true);
      }

      if (isMobileCompact && currentY < expandThreshold) {
        setIsMobileCompact(false);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobileCompact]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/85 md:sticky">
      <div
        className={`mx-auto flex max-w-7xl flex-col items-center justify-between px-6 transition-[gap,padding] duration-200 md:flex-row md:gap-4 ${
          isMobileCompact ? "gap-2 py-3" : "gap-3 py-4"
        }`}
      >
        <Link
          href="/"
          className={`min-w-0 w-full overflow-hidden transition-[max-height,opacity,transform,margin] duration-300 md:w-auto md:max-h-none md:opacity-100 md:translate-y-0 ${
            isMobileCompact
              ? "max-h-0 -translate-y-2 opacity-0 pointer-events-none"
              : "max-h-20 translate-y-0 opacity-100"
          }`}
        >
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
                className={`flex-1 rounded-full px-3 text-center text-sm transition-colors md:flex-none md:px-4 ${
                  isMobileCompact ? "py-1" : "py-1.5"
                } ${
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
            className={`rounded-full border border-slate-200 text-slate-600 transition-[padding,color,background-color] hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white ${
              isMobileCompact ? "p-2" : "p-2.5"
            }`}
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
