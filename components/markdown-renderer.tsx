"use client"

import { useMemo } from "react"
import { marked } from "marked"
import DOMPurify from "dompurify"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const html = useMemo(() => {
    const rawHtml = marked.parse(content)
    // Sanitize HTML to prevent XSS attacks
    return DOMPurify.sanitize(rawHtml as string, {
      ALLOWED_TAGS: [
        "p",
        "br",
        "strong",
        "em",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "ul",
        "ol",
        "li",
        "blockquote",
        "code",
        "pre",
        "a",
        "img",
      ],
    })
  }, [content])

  return <div className="space-y-4 leading-relaxed unset_all_styles" dangerouslySetInnerHTML={{ __html: html }} />
}
