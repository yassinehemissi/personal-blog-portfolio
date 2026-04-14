"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Pagination from "../ui/pagination";

interface Project {
  slug: string;
  title: string;
  author: string;
  categories: string[];
  tier?: "Flagship" | "Strong" | "Early Work";
  post_date: string;
  update_date: string;
  description: string;
  technologies: string[];
  year: string;
  github?: string;
  demo?: string;
  content: string;
}

interface ProjectsClientProps {
  projects: Project[];
  categories: string[];
  initialPage?: number;
}

const PROJECTS_PER_PAGE = 6;
const TIER_ORDER = ["Flagship", "Strong", "Early Work"] as const;

function getTierClasses(tier: Project["tier"]) {
  switch (tier) {
    case "Flagship":
      return "border border-amber-300/70 bg-gradient-to-r from-amber-100 via-orange-100 to-rose-100 text-amber-900 dark:border-amber-500/30 dark:from-amber-500/20 dark:via-orange-500/15 dark:to-rose-500/20 dark:text-amber-100";
    case "Strong":
      return "border border-sky-300/70 bg-gradient-to-r from-sky-100 via-cyan-100 to-teal-100 text-sky-900 dark:border-sky-500/30 dark:from-sky-500/20 dark:via-cyan-500/15 dark:to-teal-500/20 dark:text-sky-100";
    case "Early Work":
      return "border border-violet-300/70 bg-gradient-to-r from-violet-100 via-fuchsia-100 to-pink-100 text-violet-900 dark:border-violet-500/30 dark:from-violet-500/20 dark:via-fuchsia-500/15 dark:to-pink-500/20 dark:text-violet-100";
    default:
      return "";
  }
}

export default function ProjectsClient({ projects, categories, initialPage = 1 }: ProjectsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTier, setSelectedTier] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(initialPage);

  const allCategories = ["All", ...categories];
  const allTiers = ["All", ...TIER_ORDER.filter((tier) => projects.some((project) => project.tier === tier))];

  // Filter projects based on category and search
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = selectedCategory === "All" || project.categories.includes(selectedCategory);
      const matchesTier = selectedTier === "All" || project.tier === selectedTier;
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesTier && matchesSearch;
    });
  }, [projects, selectedCategory, selectedTier, searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, Math.max(1, totalPages)));
  const startIndex = (safeCurrentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  // Reset to page 1 when filters change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleTierChange = (tier: string) => {
    setSelectedTier(tier);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 z-40 pt-12">
            {/* Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Projects</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Selected work in AI, data science, and software engineering.
              </p>
            </div>

            {/* Search */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-600"
              />
            </div>

            {/* Categories */}
            <div className="mb-8">
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
            {filteredProjects.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Projects Grid */}
        <div className="flex-1 pt-12">
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
                Project Tiers
              </h3>
              {selectedTier !== "All" && (
                <button
                  onClick={() => handleTierChange("All")}
                  className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {allTiers.map((tier) => (
                <button
                  key={tier}
                  onClick={() => handleTierChange(tier)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    selectedTier === tier
                      ? tier === "All"
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                        : getTierClasses(tier)
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {currentProjects.map((project) => (
              <div key={project.slug} className="pb-8 border-b border-slate-200 dark:border-slate-800 last:border-b-0">
                <Link href={`/projects/${project.slug}`} className="group">
                  <div className="mb-3 flex flex-wrap items-start gap-3">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                      {project.title}
                    </h2>
                    {project.tier && (
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase ${getTierClasses(project.tier)}`}
                      >
                        {project.tier}
                      </span>
                    )}
                  </div>
                </Link>

                <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full text-sm bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <span>{project.year}</span>
                  <span>•</span>
                  <div className="flex flex-wrap gap-2">
                    {project.categories.map((category) => (
                      <span key={category} className="font-medium">{category}</span>
                    ))}
                  </div>
                </div>

                {/* Project Links */}
                <div className="flex gap-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium"
                    >
                      GitHub →
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium"
                    >
                      Live Demo →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                No projects found. Try a different search or category.
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredProjects.length > 0 && (
            <Pagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              getPageHref={(page) => (page <= 1 ? "/projects" : `/projects?page=${page}`)}
              totalItems={filteredProjects.length}
              itemsPerPage={PROJECTS_PER_PAGE}
            />
          )}
        </div>
      </div>
    </div>
  );
}
