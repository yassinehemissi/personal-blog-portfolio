import { notFound } from "next/navigation";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { getBlogPost } from "@/lib/getPostData";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <article className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
        {/* Header */}
        <header className="mb-12">
          <Link
            href="/blog"
            className="text-primary hover:underline font-medium text-sm mb-4 inline-block"
          >
            ← Back to blog
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <time dateTime={post.date}>{post.date}</time>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <MarkdownRenderer content={post.content} />
        </div>
      </article>
    </main>
  );
}