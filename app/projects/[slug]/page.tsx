import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { getAllProjects, getProject } from "@/lib/getPostData";
import { getFirstMarkdownImage } from "@/lib/seo";

function getTierClasses(tier?: string) {
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

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {};
  }

  const cover = project.cover || getFirstMarkdownImage(project.content);
  const images = cover ? [{ url: cover, alt: project.title }] : undefined;

  return {
    title: `${project.title} | Projects`,
    description: project.description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url: `/projects/${project.slug}`,
      publishedTime: project.post_date,
      modifiedTime: project.update_date,
      authors: [project.author],
      tags: project.categories,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: project.title,
      description: project.description,
      images: cover ? [cover] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-foreground">
      <article className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <header className="mb-12">
          <Link
            href="/projects"
            className="text-primary hover:underline font-medium text-sm mb-4 inline-block"
          >
            ← Back to projects
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            {project.title}
          </h1>
          {project.tier && (
            <div className="mb-4">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase ${getTierClasses(project.tier)}`}
              >
                {project.tier}
              </span>
            </div>
          )}
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            {project.description}
          </p>
          
          {/* Project Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-6">
            <span>{project.year}</span>
            <span>·</span>
            <span>By {project.author}</span>
            <span>·</span>
            <span>Updated {formatDate(project.update_date)}</span>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.categories.map((category) => (
              <span key={category} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm">
                {category}
              </span>
            ))}
          </div>

          {/* Technologies */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-3">
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Project Links */}
          {(project.github || project.demo) && (
            <div className="flex gap-4 mb-8">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm font-medium"
                >
                  View on GitHub →
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors text-sm font-medium"
                >
                  Live Demo →
                </a>
              )}
            </div>
          )}
        </header>

        {/* Content */}
        <MarkdownRenderer content={project.content} />
      </article>
    </main>
  );
}
