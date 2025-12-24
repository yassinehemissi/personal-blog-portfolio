import { getAllBlogPosts, getBlogCategories } from "@/lib/getPostData";
import BlogClient from "@/components/post-clients/blog-client";

export default async function BlogPage() {
  // Get data from JSON files on the server
  const blogPosts = await getAllBlogPosts();
  const categories = await getBlogCategories();

  return <BlogClient blogPosts={blogPosts} categories={categories} />;
}
