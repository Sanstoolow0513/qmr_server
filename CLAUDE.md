# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 blog application with a custom Markdown rendering system. It uses React 19, TypeScript, and Tailwind CSS v4. Blog posts are stored as JSON data in `data/posts.json` rather than as separate Markdown files.

## Development Commands

This project uses **pnpm** as the package manager.

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint
```

## Architecture

### App Router Structure

The application uses Next.js App Router with the following route structure:

- `/` - Home page with navigation cards to blog, editor, and todo list
- `/blog` - Blog post listing page (`app/blog/page.tsx`)
- `/blog/[slug]` - Individual blog post pages (`app/blog/[slug]/page.tsx`)

### Data Layer

Blog posts are stored in `data/posts.json` as a JSON array. The `lib/posts.ts` module provides the data access layer with two functions:

- `getAllPosts(): Post[]` - Returns all posts sorted by `createdAt` (newest first)
- `getPostBySlug(slug: string): Post | undefined` - Returns a single post by slug

The Post interface is defined in `lib/posts.ts`:
```typescript
interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;  // Markdown content
  tags: string[];
  createdAt: string;  // Format: YYYY-MM-DD
  readingTime: string;  // e.g., "5 分钟"
}
```

### Markdown Rendering

The application uses a **custom Markdown parser** implemented in `app/blog/[slug]/markdown-content.tsx`. This is a client component (marked with `"use client"`) that converts Markdown strings to HTML using a custom `parseMarkdown()` function.

Key characteristics:
- Supports headers (# ## ###), lists, links, inline code, code blocks, bold/italic
- Code blocks use a simple regex-based parser (no syntax highlighting library)
- Styles are defined in `globals.css` under the `.markdown-content` class

### Styling

- **Tailwind CSS v4** is used for styling with the new `@import "tailwindcss"` syntax
- Uses Geist font family via `next/font/google`
- Custom CSS variables for theming in `globals.css`
- Path aliases: `@/*` maps to `./*`

### Static Site Generation

Blog post pages use `generateStaticParams()` to create static routes at build time. The app is configured for static generation (no dynamic data fetching beyond the JSON file).
