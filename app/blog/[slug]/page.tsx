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
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-foreground">
      <article className="max-w-2xl mx-auto px-4 py-16 sm:py-24 bg-white dark:bg-slate-950" >
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
          <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
            <time dateTime={post.post_date}>{formatDate(post.post_date)}</time>
            <span>·</span>
            <span>{post.readTime}</span>
            <span>·</span>
            <span>By {post.author}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {post.categories.map((category) => (
              <span key={category} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm">
                {category}
              </span>
            ))}
          </div>
        </header>

        {/* Content */}
        <MarkdownRenderer content={post.content} />
      </article>
    </main>
  );
}