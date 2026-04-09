"use client";

import { ThemeContext } from "@/contexts/theme-context";
import "katex/dist/katex.min.css";
import { useContext, useMemo } from "react";
import { cloneElement, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { BlockMath, InlineMath } from "react-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string;
}

type MarkdownSegment =
  | { type: "markdown"; value: string }
  | { type: "block-math"; value: string }
  | {
      type: "object";
      data: string;
      mimeType: string;
      width: string;
      height: string;
    };

function getHtmlAttribute(tag: string, attribute: string) {
  const match = tag.match(new RegExp(`${attribute}=["']([^"']+)["']`, "i"));
  return match?.[1]?.trim() ?? "";
}

function splitMarkdownAndEmbeds(content: string) {
  const segments: MarkdownSegment[] = [];
  const pattern = /(\$\$[\s\S]+?\$\$|<object\b[\s\S]*?<\/object>)/gi;
  let lastIndex = 0;

  for (const match of content.matchAll(pattern)) {
    const fullMatch = match[0];
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      segments.push({
        type: "markdown",
        value: content.slice(lastIndex, matchIndex),
      });
    }

    if (fullMatch.startsWith("$$")) {
      segments.push({
        type: "block-math",
        value: fullMatch.slice(2, -2).trim(),
      });
    } else {
      const data = getHtmlAttribute(fullMatch, "data");

      if (data && /^(https?:\/\/|\/)/i.test(data)) {
        segments.push({
          type: "object",
          data,
          mimeType: getHtmlAttribute(fullMatch, "type") || "application/pdf",
          width: getHtmlAttribute(fullMatch, "width") || "100%",
          height: getHtmlAttribute(fullMatch, "height") || "720",
        });
      } else {
        segments.push({
          type: "markdown",
          value: fullMatch,
        });
      }
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < content.length) {
    segments.push({
      type: "markdown",
      value: content.slice(lastIndex),
    });
  }

  return segments;
}

function parseInlineMathSegments(text: string) {
  const segments: Array<{ type: "text" | "inline"; value: string }> = [];
  const pattern = /(\$[^$\n]+\$)/g;
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const fullMatch = match[0];
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      segments.push({
        type: "text",
        value: text.slice(lastIndex, matchIndex),
      });
    }

    segments.push({
      type: "inline",
      value: fullMatch.slice(1, -1).trim(),
    });

    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < text.length) {
    segments.push({
      type: "text",
      value: text.slice(lastIndex),
    });
  }

  return segments;
}

function renderInlineMathNode(node: ReactNode, keyPrefix = "math"): ReactNode {
  if (typeof node === "string") {
    const segments = parseInlineMathSegments(node);

    if (segments.length === 1 && segments[0].type === "text") {
      return node;
    }

    return segments.map((segment, index) => {
      const key = `${keyPrefix}-${index}`;

      if (segment.type === "text") {
        return segment.value;
      }

      return <InlineMath key={key} math={segment.value} />;
    });
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => renderInlineMathNode(child, `${keyPrefix}-${index}`));
  }

  if (isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>;

    if (!element.props?.children) {
      return node;
    }

    return cloneElement(element, {
      ...element.props,
      children: renderInlineMathNode(element.props.children, keyPrefix),
    });
  }

  return node;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { isDark } = useContext(ThemeContext);

  const components = useMemo(
    () => ({
      h1: ({ children, ...props }: any) => (
        <h1
          className="text-4xl font-bold text-slate-900 dark:text-white mt-8 mb-4 first:mt-0"
          {...props}
        >
          {renderInlineMathNode(children, "h1")}
        </h1>
      ),
      h2: ({ children, ...props }: any) => (
        <h2
          className="text-3xl font-bold text-slate-900 dark:text-white mt-8 mb-4"
          {...props}
        >
          {renderInlineMathNode(children, "h2")}
        </h2>
      ),
      h3: ({ children, ...props }: any) => (
        <h3
          className="text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-3"
          {...props}
        >
          {renderInlineMathNode(children, "h3")}
        </h3>
      ),
      h4: ({ children, ...props }: any) => (
        <h4
          className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3"
          {...props}
        >
          {renderInlineMathNode(children, "h4")}
        </h4>
      ),
      h5: ({ children, ...props }: any) => (
        <h5
          className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2"
          {...props}
        >
          {renderInlineMathNode(children, "h5")}
        </h5>
      ),
      h6: ({ children, ...props }: any) => (
        <h6
          className="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2"
          {...props}
        >
          {renderInlineMathNode(children, "h6")}
        </h6>
      ),
      p: ({ children, ...props }: any) => (
        <p
          className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed"
          {...props}
        >
          {renderInlineMathNode(children, "p")}
        </p>
      ),
      a: ({ children, href, ...props }: any) => (
        <a
          href={href}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors"
          target={href?.startsWith("http") ? "_blank" : undefined}
          rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
          {...props}
        >
          {renderInlineMathNode(children, "a")}
        </a>
      ),
      strong: ({ children, ...props }: any) => (
        <strong className="font-bold text-slate-900 dark:text-white" {...props}>
          {renderInlineMathNode(children, "strong")}
        </strong>
      ),
      em: ({ children, ...props }: any) => (
        <em className="italic text-slate-700 dark:text-slate-300" {...props}>
          {renderInlineMathNode(children, "em")}
        </em>
      ),
      ul: ({ children, ...props }: any) => (
        <ul
          className="list-disc list-inside mb-4 space-y-2 text-slate-700 dark:text-slate-300 ml-4"
          {...props}
        >
          {renderInlineMathNode(children, "ul")}
        </ul>
      ),
      ol: ({ children, ...props }: any) => (
        <ol
          className="list-decimal list-inside mb-4 space-y-2 text-slate-700 dark:text-slate-300 ml-4"
          {...props}
        >
          {renderInlineMathNode(children, "ol")}
        </ol>
      ),
      li: ({ children, ...props }: any) => (
        <li
          className="mb-1 text-slate-700 dark:text-slate-300 [&_p]:mb-0 [&_p]:inline"
          {...props}
        >
          {renderInlineMathNode(children, "li")}
        </li>
      ),
      blockquote: ({ children, ...props }: any) => (
        <blockquote
          className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 py-2 mb-4 italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-r"
          {...props}
        >
          {renderInlineMathNode(children, "blockquote")}
        </blockquote>
      ),
      code: ({ children, className, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || "");
        const language = match ? match[1] : "";

        if (language) {
          return (
            <SyntaxHighlighter
              style={isDark ? oneDark : oneLight}
              language={language}
              PreTag="div"
              className="mb-4 rounded-lg overflow-hidden"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        }

        return (
          <code
            className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-1.5 py-0.5 rounded text-sm font-mono"
            {...props}
          >
            {children}
          </code>
        );
      },
      pre: ({ children, ...props }: any) => (
        <pre
          className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-4 rounded-lg mb-4 overflow-x-auto text-sm font-mono"
          {...props}
        >
          {renderInlineMathNode(children, "pre")}
        </pre>
      ),
      img: ({ src, alt, ...props }: any) => (
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto rounded-lg mb-4 mx-auto shadow-lg"
          {...props}
        />
      ),
      hr: ({ ...props }: any) => (
        <hr
          className="border-slate-300 dark:border-slate-600 my-8"
          {...props}
        />
      ),
      table: ({ children, ...props }: any) => (
        <div className="overflow-x-auto mb-4">
          <table
            className="min-w-full border-collapse border border-slate-300 dark:border-slate-600"
            {...props}
          >
            {children}
          </table>
        </div>
      ),
      thead: ({ children, ...props }: any) => (
        <thead className="bg-slate-100 dark:bg-slate-800" {...props}>
          {renderInlineMathNode(children, "thead")}
        </thead>
      ),
      tbody: ({ children, ...props }: any) => (
        <tbody {...props}>{renderInlineMathNode(children, "tbody")}</tbody>
      ),
      tr: ({ children, ...props }: any) => (
        <tr
          className="border-b border-slate-300 dark:border-slate-600"
          {...props}
        >
          {renderInlineMathNode(children, "tr")}
        </tr>
      ),
      th: ({ children, ...props }: any) => (
        <th
          className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left font-semibold text-slate-900 dark:text-white"
          {...props}
        >
          {renderInlineMathNode(children, "th")}
        </th>
      ),
      td: ({ children, ...props }: any) => (
        <td
          className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-300"
          {...props}
        >
          {renderInlineMathNode(children, "td")}
        </td>
      ),
    }),
    [isDark]
  );

  return (
    <div className="prose-custom max-w-none">
      {splitMarkdownAndEmbeds(content).map((segment, index) => {
        if (segment.type === "block-math") {
          return (
            <div
              key={`block-math-${index}`}
              className="my-4 overflow-x-auto text-slate-700 dark:text-slate-300"
            >
              <BlockMath math={segment.value} />
            </div>
          );
        }

        if (segment.type === "object") {
          return (
            <div
              key={`object-${index}`}
              className="my-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
            >
              <object
                data={segment.data}
                type={segment.mimeType}
                width={segment.width}
                height={segment.height}
                className="w-full"
              >
                <p className="p-4 text-sm text-slate-600 dark:text-slate-400">
                  PDF preview unavailable.{" "}
                  <a
                    href={segment.data}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    Open the report
                  </a>
                  .
                </p>
              </object>
            </div>
          );
        }

        if (!segment.value.trim()) {
          return null;
        }

        return (
          <ReactMarkdown key={`markdown-${index}`} components={components}>
            {segment.value}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}
