import Image from "next/image";
import Link from "next/link";
import { FileText, Github, Linkedin, Mail } from "lucide-react";
import { HomeCarousels } from "@/components/home/home-carousels";
import { getAllBlogPosts, getAllProjects } from "@/lib/getPostData";
import { getFirstMarkdownImage } from "@/lib/seo";

const experience = [
  {
    role: "Freelance Software Engineer",
    period: "2019 - 2025",
    summary:
      "Built backend and full-stack systems for 15+ clients, balancing scalability with cost. Led a B2B coordination platform later pitched to Attijari Bank Leasing.",
  },
  {
    role: "Software Development Intern - Artify Inc",
    period: "Jan 2024 - Jul 2024, Jun 2025 - Aug 2025",
    summary:
      "Designed backend architecture, ingestion pipelines, and APIs for a producer platform. Delivered features that enabled onboarding for 100+ media producers.",
  },
  {
    role: "Software Development Intern - Sagemcom Tunisia",
    period: "Jun 2023 - Aug 2023",
    summary:
      "Built internal tooling for KPI discovery and production tracing. Reduced dashboard preparation time for factory engineers in a Scrum workflow.",
  },
  {
    role: "Chief Technology Officer - Bubble Fest",
    period: "Apr 2022 - Jul 2022",
    summary:
      "Designed infrastructure that handled 30,000+ requests during ticket-sale peaks. Delivered an open-source stack that cut technology costs by about 95%.",
  },
];

const education = [
  {
    degree: "AI Engineering Degree",
    school: "ESPRIT - Private Higher School of Engineering and Technology",
    period: "2024 - Present (Expected 2027)",
    summary:
      "Focus on applied and theoretical AI, data-driven systems, and software engineering under real-world constraints. Core foundations include probability, calculus, optimization, and graph theory.",
    gpa: "3.7",
  },
  {
    degree: "Licence Degree, Computer Science",
    school: "University of Science of Tunis",
    period: "2021 - 2024",
    summary:
      "Built foundations in data structures, algorithms, graphs, networks, compilers, and automata. Also studied binary systems, algebra, calculus, software engineering, and legal-history aspects of computing.",
    gpa: "3.7",
  },
];

export default async function Home() {
  const blogPosts = await getAllBlogPosts();
  const projects = await getAllProjects();

  const latestProjects = projects.slice(0, 6).map((project) => ({
    slug: project.slug,
    title: project.title,
    summary: project.description,
    poster: project.cover || getFirstMarkdownImage(project.content) || undefined,
  }));

  const featuredBlogs = blogPosts
    .filter((post) => Boolean(post.cover))
    .slice(0, 6)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      cover: post.cover,
    }));

  return (
    <main className="mx-auto max-w-3xl px-6 pt-12 md:pt-10">
      <section className="text-center">
        <div className="relative mx-auto mb-6 h-32 w-32 md:h-36 md:w-36">
          <div className="absolute inset-0 rounded-full bg-slate-200 blur-2xl dark:bg-slate-700/50" />
          <Image
            src="/myphoto.PNG"
            alt="Mohamed Yassine Hemissi"
            fill
            priority
            className="relative rounded-full object-cover ring-4 ring-white dark:ring-slate-950"
          />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
          Mohamed Yassine Hemissi
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          CS Graduate and AI Engineering Student
        </p>
        <div className="mx-auto mt-6 max-w-2xl space-y-3 text-pretty text-slate-700 dark:text-slate-300">
          <p>
            Hi, I'm Yassine.
            <span className="mx-auto my-2 hidden h-px w-12 bg-slate-300 dark:bg-slate-700 md:block" />
            {" "}I love, and probably always will love, computer science because it changes lives.
          </p>
          <p>
            I'm interested in AI, system design, and research that holds up in practice.
            <span className="hidden md:block" />
            {" "}Browse the <Link href="/projects" className="underline underline-offset-4 hover:text-slate-900 dark:hover:text-white">projects</Link> or read the{" "}
            <Link href="/blog" className="underline underline-offset-4 hover:text-slate-900 dark:hover:text-white">blog</Link>.
          </p>
          <p>
            Outside of tech, I care about entrepreneurship, philosophy, and history.
            <span className="hidden md:block" />
            {" "}I play tennis, listen to music, and used to host events.
          </p>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://github.com/yassinehemissi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            href="mailto:hemissiyassine@gmail.com"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/mohamed-yassine-hemissi/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href="/CV_PHOTO.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            <FileText className="h-4 w-4" />
            Master CV
          </a>
        </div>
      </section>

      <HomeCarousels latestProjects={latestProjects} blogs={featuredBlogs} />

      <section className="mt-14 border-t border-slate-200 pt-10 dark:border-slate-800">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          Experience
        </h2>
        <div className="relative mt-5">
          <div className="pointer-events-none absolute bottom-2 left-2 top-2 w-px bg-gradient-to-b from-slate-300 via-slate-200 to-transparent dark:from-slate-600 dark:via-slate-700" />
          {experience.map((item) => (
            <article
              key={`${item.role}-${item.period}`}
              className="group relative border-b border-slate-200 py-5 pl-8 last:border-b-0 dark:border-slate-800"
            >
              <span className="absolute left-2 top-[22px] inline-flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-white ring-1 ring-slate-300 dark:bg-slate-950 dark:ring-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 transition-colors group-hover:bg-slate-600 dark:bg-slate-500 dark:group-hover:bg-slate-300" />
              </span>
              <h3 className="text-[15px] font-medium text-slate-900 dark:text-white">{item.role}</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.period}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{item.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 border-t border-slate-200 pt-10 dark:border-slate-800">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          Education
        </h2>
        <div className="relative mt-5">
          <div className="pointer-events-none absolute bottom-2 left-2 top-2 w-px bg-gradient-to-b from-slate-300 via-slate-200 to-transparent dark:from-slate-600 dark:via-slate-700" />
          {education.map((item) => (
            <article
              key={`${item.degree}-${item.period}`}
              className="group relative border-b border-slate-200 py-5 pl-8 last:border-b-0 dark:border-slate-800"
            >
              <span className="absolute left-2 top-[22px] inline-flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-white ring-1 ring-slate-300 dark:bg-slate-950 dark:ring-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 transition-colors group-hover:bg-slate-600 dark:bg-slate-500 dark:group-hover:bg-slate-300" />
              </span>
              <h3 className="text-[15px] font-medium text-slate-900 dark:text-white">{item.degree}</h3>
              <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                {item.school} (GPA: {item.gpa})
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{item.period}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{item.summary}</p>
            </article>
          ))}
        </div>
      </section>

    </main>
  );
}
