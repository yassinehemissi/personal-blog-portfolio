import fs from "fs";
import path from "path";
import { cache } from "react";

interface BlogPost {
  slug: string;
  title: string;
  author: string;
  categories: string[];
  post_date: string;
  update_date: string;
  excerpt: string;
  readTime: string;
  content: string;
}

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

// Helper function to read JSON files from a directory
async function readDataFromDirectory<T>(dirPath: string): Promise<T[]> {
  try {
    const fullPath = path.join(process.cwd(), dirPath);

    if (!fs.existsSync(fullPath)) {
      return [];
    }

    const files = fs.readdirSync(fullPath);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const data = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(fullPath, file);
        const fileContent = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileContent);
      })
    );

    return data;
  } catch (error) {
    console.error(`Error reading data from ${dirPath}:`, error);
    return [];
  }
}

// Get all blog posts (cached for performance)
export const getAllBlogPosts = cache(async (): Promise<BlogPost[]> => {
  return (await readDataFromDirectory<BlogPost>("data/blogs")).sort(
    (a, b) => new Date(b.post_date).getTime() - new Date(a.post_date).getTime()
  );
});

// Get a specific blog post by slug
export const getBlogPost = cache(
  async (slug: string): Promise<BlogPost | null> => {
    const posts = await getAllBlogPosts();
    return posts.find((post) => post.slug === slug) || null;
  }
);

// Get all projects (cached for performance)
export const getAllProjects = cache(async (): Promise<Project[]> => {
  return (await readDataFromDirectory<Project>("data/projects")).sort(
    (a, b) => new Date(b.post_date).getTime() - new Date(a.post_date).getTime()
  );
});

// Get a specific project by slug
export const getProject = cache(
  async (slug: string): Promise<Project | null> => {
    const projects = await getAllProjects();
    return projects.find((project) => project.slug === slug) || null;
  }
);

// Get unique categories from blog posts
export const getBlogCategories = cache(async (): Promise<string[]> => {
  const posts = await getAllBlogPosts();
  const categories = posts.flatMap((post) => post.categories);
  return [...new Set(categories)];
});

// Get unique categories from projects
export const getProjectCategories = cache(async (): Promise<string[]> => {
  const projects = await getAllProjects();
  const categories = projects.flatMap((project) => project.categories);
  return [...new Set(categories)];
});
