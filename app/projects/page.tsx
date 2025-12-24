import { getAllProjects, getProjectCategories } from "@/lib/getPostData";
import ProjectsClient from "@/components/post-clients/projects-client";

export default async function ProjectsPage() {
  // Get data from JSON files on the server
  const projects = await getAllProjects();
  const categories = await getProjectCategories();

  return <ProjectsClient projects={projects} categories={categories} />;
}
