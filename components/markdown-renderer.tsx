"use client";

import { ThemeContext } from "@/contexts/theme-context";
import { useContext, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { isDark, toggleTheme } = useContext(ThemeContext);

  const components = useMemo(
    () => ({
      h1: ({ children, ...props }: any) => (
        <h1
          className="text-4xl font-bold text-slate-900 dark:text-white mt-8 mb-4 first:mt-0"
          {...props}
        >
          {children}
        </h1>
      ),
      h2: ({ children, ...props }: any) => (
        <h2
          className="text-3xl font-bold text-slate-900 dark:text-white mt-8 mb-4"
          {...props}
        >
          {children}
        </h2>
      ),
      h3: ({ children, ...props }: any) => (
        <h3
          className="text-2xl font-bold text-slate-900 dark:text-white mt-6 mb-3"
          {...props}
        >
          {children}
        </h3>
      ),
      h4: ({ children, ...props }: any) => (
        <h4
          className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3"
          {...props}
        >
          {children}
        </h4>
      ),
      h5: ({ children, ...props }: any) => (
        <h5
          className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2"
          {...props}
        >
          {children}
        </h5>
      ),
      h6: ({ children, ...props }: any) => (
        <h6
          className="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2"
          {...props}
        >
          {children}
        </h6>
      ),
      p: ({ children, ...props }: any) => (
        <p
          className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed"
          {...props}
        >
          {children}
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
          {children}
        </a>
      ),
      strong: ({ children, ...props }: any) => (
        <strong className="font-bold text-slate-900 dark:text-white" {...props}>
          {children}
        </strong>
      ),
      em: ({ children, ...props }: any) => (
        <em className="italic text-slate-700 dark:text-slate-300" {...props}>
          {children}
        </em>
      ),
      ul: ({ children, ...props }: any) => (
        <ul
          className="list-disc list-inside mb-4 space-y-2 text-slate-700 dark:text-slate-300 ml-4"
          {...props}
        >
          {children}
        </ul>
      ),
      ol: ({ children, ...props }: any) => (
        <ol
          className="list-decimal list-inside mb-4 space-y-2 text-slate-700 dark:text-slate-300 ml-4"
          {...props}
        >
          {children}
        </ol>
      ),
      li: ({ children, ...props }: any) => (
        <li className="text-slate-700 dark:text-slate-300 mb-1" {...props}>
          {children}
        </li>
      ),
      blockquote: ({ children, ...props }: any) => (
        <blockquote
          className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 py-2 mb-4 italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-r"
          {...props}
        >
          {children}
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
          {children}
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
          {children}
        </thead>
      ),
      tbody: ({ children, ...props }: any) => (
        <tbody {...props}>{children}</tbody>
      ),
      tr: ({ children, ...props }: any) => (
        <tr
          className="border-b border-slate-300 dark:border-slate-600"
          {...props}
        >
          {children}
        </tr>
      ),
      th: ({ children, ...props }: any) => (
        <th
          className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left font-semibold text-slate-900 dark:text-white"
          {...props}
        >
          {children}
        </th>
      ),
      td: ({ children, ...props }: any) => (
        <td
          className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-300"
          {...props}
        >
          {children}
        </td>
      ),
    }),
    [isDark]
  );

  return (
    <div className="prose-custom max-w-none">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
