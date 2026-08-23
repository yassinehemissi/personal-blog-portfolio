import type { Metadata } from "next";
import { getAllProjects, getProjectCategories } from "@/lib/getPostData";
import ProjectsClient from "@/components/post-clients/projects-client";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";

const PROJECTS_DESCRIPTION =
  "Selected engineering and AI projects by Mohamed Yassine Hemissi, from production platforms and hackathon builds to research experiments and early work.";

export const metadata: Metadata = {
  title: "Projects",
  description: PROJECTS_DESCRIPTION,
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: `Projects | ${SITE_NAME}`,
    description: PROJECTS_DESCRIPTION,
    type: "website",
    url: "/projects",
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, alt: `Projects | ${SITE_NAME}` }],
  },
};

interface ProjectsPageProps {
  searchParams?: { page?: string | string[] } | Promise<{ page?: string | string[] }>;
}

function parsePageParam(pageParam: string | string[] | undefined): number {
  const value = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  // Get data from JSON files on the server
  const projects = await getAllProjects();
  const categories = await getProjectCategories();
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : undefined;
  const initialPage = parsePageParam(resolvedSearchParams?.page);

  return <ProjectsClient projects={projects} categories={categories} initialPage={initialPage} />;
}
