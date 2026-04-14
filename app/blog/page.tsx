import { getAllBlogPosts, getBlogCategories } from "@/lib/getPostData";
import BlogClient from "@/components/post-clients/blog-client";

interface BlogPageProps {
  searchParams?: { page?: string | string[] } | Promise<{ page?: string | string[] }>;
}

function parsePageParam(pageParam: string | string[] | undefined): number {
  const value = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Get data from JSON files on the server
  const blogPosts = await getAllBlogPosts();
  const categories = await getBlogCategories();
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : undefined;
  const initialPage = parsePageParam(resolvedSearchParams?.page);

  return <BlogClient blogPosts={blogPosts} categories={categories} initialPage={initialPage} />;
}
