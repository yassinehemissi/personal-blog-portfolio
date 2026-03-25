export function getSiteUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "https://www.yassinehemissi.me";

  return rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
}

export function getFirstMarkdownImage(content: string) {
  const match = content.match(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/i);
  return match?.[1];
}
