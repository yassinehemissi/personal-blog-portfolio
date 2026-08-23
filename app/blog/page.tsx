import type { Metadata } from "next";
import { getAllBlogPosts, getBlogCategories } from "@/lib/getPostData";
import BlogClient from "@/components/post-clients/blog-client";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";

const BLOG_DESCRIPTION =
  "Essays and notes by Mohamed Yassine Hemissi on AI, machine learning, software engineering, and the ideas around them.";

export const metadata: Metadata = {
  title: "Blog",
  description: BLOG_DESCRIPTION,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description: BLOG_DESCRIPTION,
    type: "website",
    url: "/blog",
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE, alt: `Blog | ${SITE_NAME}` }],
  },
};

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
