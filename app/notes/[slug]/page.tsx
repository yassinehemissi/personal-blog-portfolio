import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { getAllNotes, getNote } from "@/lib/getPostData";

interface NotePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const notes = await getAllNotes();
  return notes.map((note) => ({
    slug: note.slug,
  }));
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNote(slug);

  if (!note) {
    return {};
  }

  const images = note.cover ? [{ url: note.cover, alt: note.title }] : undefined;

  return {
    title: `${note.title} | Notes`,
    description: note.excerpt,
    alternates: {
      canonical: `/notes/${note.slug}`,
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: note.title,
      description: note.excerpt,
      type: "article",
      url: `/notes/${note.slug}`,
      publishedTime: note.post_date,
      modifiedTime: note.update_date,
      authors: [note.author],
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: note.title,
      description: note.excerpt,
      images: note.cover ? [note.cover] : undefined,
    },
  };
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = await getNote(slug);

  if (!note) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-white text-foreground dark:bg-slate-950">
      <article className="mx-auto max-w-2xl bg-white px-4 py-16 dark:bg-slate-950 sm:py-24">
        {note.cover && (
          <img
            src={note.cover}
            alt={note.title}
            className="mb-10 h-auto max-h-[420px] w-full rounded-3xl object-cover shadow-lg"
          />
        )}
        <header className="mb-12">
          <Link
            href="/"
            className="mb-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            Back to home
          </Link>
          <h1 className="mb-4 text-4xl font-bold text-balance sm:text-5xl">
            {note.title}
          </h1>
          <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={note.post_date}>{formatDate(note.post_date)}</time>
            <span>·</span>
            <span>{note.readTime}</span>
            <span>·</span>
            <span>By {note.author}</span>
          </div>
        </header>

        <MarkdownRenderer content={note.content} />
      </article>
    </main>
  );
}
