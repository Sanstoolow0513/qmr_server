"use client";

import { useMemo } from "react";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const html = useMemo(() => {
    return parseMarkdown(content);
  }, [content]);

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function parseMarkdown(md: string): string {
  let html = md
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Code blocks
    .replace(
      /```(\w+)?\n([\s\S]*?)```/g,
      (_, lang, code) =>
        `\u003cpre\u003e\u003ccode class="language-${lang || "text"}"\u003e${code.trim()}\u003c/code\u003e\u003c/pre\u003e`
    )
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Headers
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Lists
    .replace(/^\s*- (.*$)/gim, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$\u0026</ul>")
    .replace(/^\s*\d+\. (.*$)/gim, "<li>$1</li>")
    // Links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    // Paragraphs (must be last)
    .replace(/\n\n/g, "</p>\n<p>");

  // Wrap in paragraph if not already wrapped
  if (!html.startsWith("<")) {
    html = "<p>" + html + "</p>";
  }

  return html;
}
