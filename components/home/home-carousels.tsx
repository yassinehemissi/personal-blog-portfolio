import Link from "next/link";

interface BlogCard {
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
}

interface ProjectCard {
  slug: string;
  title: string;
  summary: string;
  poster?: string;
}

export function HomeCarousels({
  latestProjects,
  blogs,
}: {
  latestProjects: ProjectCard[];
  blogs: BlogCard[];
}) {
  const projectItems = [...latestProjects, ...latestProjects];
  const blogItems = [...blogs, ...blogs];

  return (
    <>
      <section className="mt-12 border-t border-slate-200 pt-10 dark:border-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            Latest Projects
          </h2>
          <Link
            href="/projects"
            className="text-xs font-medium uppercase tracking-wide text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            View all
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-xl py-2">
          <div className="home-project-slider-track flex w-max items-stretch gap-3 px-3">
            {projectItems.map((project, index) => (
              <Link
                key={`${project.slug}-${index}`}
                href={`/projects/${project.slug}`}
                className="group w-72 overflow-hidden rounded-xl border border-slate-200 bg-white/95 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                {project.poster ? (
                  <img
                    src={project.poster}
                    alt={project.title}
                    className="h-36 w-full object-cover"
                  />
                ) : (
                  <div className="h-36 w-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950" />
                )}
                <div className="p-3">
                  <p className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-slate-700 dark:text-white dark:group-hover:text-slate-200">
                    {project.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
                    {project.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      <section className="mt-12 border-t border-slate-200 pt-10 dark:border-slate-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            My Words
          </h2>
          <Link
            href="/blog"
            className="text-xs font-medium uppercase tracking-wide text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            View blog
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-xl py-2">
          <div className="home-blog-slider-track flex w-max items-stretch gap-3 px-3">
            {blogItems.map((post, index) => (
              <Link
                key={`${post.slug}-${index}`}
                href={`/blog/${post.slug}`}
                className="group w-72 overflow-hidden rounded-xl border border-slate-200 bg-white/95 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                {post.cover ? (
                  <img
                    src={post.cover}
                    alt={post.title}
                    className="h-36 w-full object-cover"
                  />
                ) : (
                  <div className="h-36 w-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950" />
                )}
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-slate-700 dark:text-white dark:group-hover:text-slate-200">
                    {post.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
