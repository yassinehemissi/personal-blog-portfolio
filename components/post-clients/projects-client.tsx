"use client";

import { useState } from "react";
import Link from "next/link";

interface Project {
  slug: string;
  title: string;
  author: string;
  categories: string[];
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
}

export default function ProjectsClient({ projects, categories }: ProjectsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const allCategories = ["All", ...categories];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === "All" || project.categories.includes(selectedCategory);
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                {allCategories.map((category) => (
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
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Projects Grid */}
        <div className="flex-1 pt-12">
          <div className="space-y-8">
            {filteredProjects.map((project) => (
              <div key={project.slug} className="pb-8 border-b border-slate-200 dark:border-slate-800 last:border-b-0">
                <Link href={`/projects/${project.slug}`} className="group">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                    {project.title}
                  </h2>
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
        </div>
      </div>
    </div>
  );
}