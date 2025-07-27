"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "~/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("prose prose-slate max-w-none dark:prose-invert", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // Custom styling for headings
        h1: ({ children, ...props }) => (
          <h1 className="text-3xl font-bold tracking-tight mb-8 mt-2" {...props}>
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 className="text-2xl font-semibold tracking-tight mb-4 mt-10 pb-2 border-b" {...props}>
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 className="text-xl font-semibold tracking-tight mb-4 mt-8" {...props}>
            {children}
          </h3>
        ),
        // Code blocks with syntax highlighting
        pre: ({ children, ...props }) => (
          <pre className="bg-slate-950 text-slate-50 rounded-lg p-4 overflow-x-auto my-6" {...props}>
            {children}
          </pre>
        ),
        code: ({ children, className, ...props }) => {
          const match = /language-(\w+)/.exec(className ?? "");
          const isInline = !match;
          
          if (isInline) {
            return (
              <code className="bg-slate-100 dark:bg-slate-800 text-[#f97316] px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          }
          
          return (
            <code className="text-sm font-mono" {...props}>
              {children}
            </code>
          );
        },
        // Lists
        ul: ({ children, ...props }) => (
          <ul className="my-4 space-y-2 list-disc pl-6" {...props}>
            {children}
          </ul>
        ),
        ol: ({ children, ...props }) => (
          <ol className="my-4 space-y-2 list-decimal pl-6" {...props}>
            {children}
          </ol>
        ),
        li: ({ children, ...props }) => (
          <li className="leading-7" {...props}>
            {children}
          </li>
        ),
        // Links
        a: ({ children, href, ...props }) => (
          <a
            href={href}
            className="text-[#f97316] hover:text-[#ea580c] underline underline-offset-4 transition-colors"
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            {...props}
          >
            {children}
          </a>
        ),
        // Blockquotes
        blockquote: ({ children, ...props }) => (
          <blockquote className="border-l-4 border-[#f97316] pl-4 my-6 italic text-muted-foreground" {...props}>
            {children}
          </blockquote>
        ),
        // Tables
        table: ({ children, ...props }) => (
          <div className="my-6 overflow-x-auto">
            <table className="w-full border-collapse" {...props}>
              {children}
            </table>
          </div>
        ),
        th: ({ children, ...props }) => (
          <th className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-left font-semibold bg-slate-50 dark:bg-slate-900" {...props}>
            {children}
          </th>
        ),
        td: ({ children, ...props }) => (
          <td className="border border-slate-300 dark:border-slate-700 px-4 py-2" {...props}>
            {children}
          </td>
        ),
        // Horizontal rules
        hr: ({ ...props }) => (
          <hr className="my-8 border-slate-200 dark:border-slate-800" {...props} />
        ),
        // Paragraphs
        p: ({ children, ...props }) => (
          <p className="leading-7 my-4" {...props}>
            {children}
          </p>
        ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}