import type { MetadataRoute } from "next";
import { getAllBlogPosts, getAllProjects } from "@/lib/getPostData";
import { getLastModified, getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [posts, projects] = await Promise.all([getAllBlogPosts(), getAllProjects()]);

  const newest = (items: Array<{ post_date: string; update_date: string }>) =>
    items.length > 0 ? getLastModified(items[0].post_date, items[0].update_date) : new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: newest(projects),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: newest(posts),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: getLastModified(project.post_date, project.update_date),
    changeFrequency: "yearly",
    priority: project.tier === "Flagship" ? 0.8 : 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: getLastModified(post.post_date, post.update_date),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  // Notes are deliberately excluded: they are noindex and unlinked.
  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
