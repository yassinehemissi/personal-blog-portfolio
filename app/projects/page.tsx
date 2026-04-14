import { getAllProjects, getProjectCategories } from "@/lib/getPostData";
import ProjectsClient from "@/components/post-clients/projects-client";

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
