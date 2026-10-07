import type { Metadata } from "next";
import { getClassicPage } from "./read-classic-page";
import { ClassicScriptRunner } from "./classic-script-runner";
import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";
import type { GenerateClassicPageOptions } from "./types";

/**
 * Builds a classic page component from a folder under classic/.
 *
 * The classic page owns its own layout, so the fragment is rendered
 * full-width with no wrapper constraints; the site chrome (header and
 * footer) still wraps it via the root MainLayout.
 *
 * Render order matters:
 * 1. stylesheets (React manages loading, so no flash of unstyled content)
 * 2. head <style> blocks
 * 3. body fragment (no scripts inside - see ClassicScriptRunner)
 * 4. scripts, injected after the fragment exists (defer-like)
 */
export function generateClassicPage(
  folder: string,
  _options: GenerateClassicPageOptions = {}
) {
  async function ClassicPage() {
    const page = await getClassicPage(folder);

    return (
      <>
        {page.head.stylesheets.map((sheet) => (
          <link
            key={sheet.href}
            rel="stylesheet"
            href={sheet.href}
            media={sheet.media}
            precedence="classic"
          />
        ))}

        {page.head.styles.map((css, index) => (
          <style
            key={`classic-style-${index}`}
            dangerouslySetInnerHTML={{ __html: css }}
          />
        ))}

        <div
          className="classic-page"
          data-classic-folder={page.folder}
          dangerouslySetInnerHTML={{ __html: page.html }}
        />

        <ClassicScriptRunner scripts={page.head.scripts} />
      </>
    );
  }

  return ClassicPage;
}

/**
 * Metadata for a classic page, meant for page.tsx:
 *
 *   export const generateMetadata = () =>
 *     generateClassicMetadata("tsp-report", { canonical: "/tsp-report" });
 *
 * Classic pages are noindex + follow by default (like notes); set
 * `"noindex": false` in meta.json to opt a page into search.
 */
export async function generateClassicMetadata(
  folder: string,
  options: GenerateClassicPageOptions = {}
): Promise<Metadata> {
  const page = await getClassicPage(folder);

  const ogImage = page.cover ?? DEFAULT_OG_IMAGE;

  return {
    title: page.title,
    description: page.description,
    ...(options.canonical
      ? { alternates: { canonical: options.canonical } }
      : {}),
    robots: page.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: page.title,
      description: page.description,
      type: "website",
      url: options.canonical,
      siteName: SITE_NAME,
      images: [{ url: ogImage, alt: page.title }],
      ...(page.post_date ? { publishedTime: page.post_date } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [ogImage],
    },
  };
}
