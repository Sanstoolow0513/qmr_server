# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 blog application with an integrated Markdown editor. It uses a file-based JSON storage system for articles instead of a database.

## Common Commands

```bash
# Install dependencies
pnpm install

# Start development server (runs on http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **React**: Version 19.2.3
- **TypeScript**: Version 5 with strict mode enabled
- **Styling**: Tailwind CSS 4 with PostCSS
- **Icons**: lucide-react
- **Package Manager**: pnpm (monorepo workspace configured)

### Data Storage
Articles are stored in `data/articles.json` as a flat JSON file. The `lib/articles.ts` module provides CRUD operations:
- `getAllArticles()` - Returns articles sorted by `updatedAt` (newest first)
- `getArticleById(id)` - Fetches a single article
- `createArticle(title, content, tags)` - Creates with auto-generated UUID
- `updateArticle(id, updates)` - Partial updates with automatic `updatedAt` timestamp
- `deleteArticle(id)` - Removes article from storage

### Markdown Processing
Custom Markdown parser in `lib/markdown.ts` (`parseMarkdown` function):
- Converts Markdown to HTML with Tailwind CSS classes
- Supports: headers, code blocks, inline code, bold/italic, links, images, blockquotes, lists, horizontal rules
- Includes XSS protection via `escapeHtml`
- Helper functions: `formatDate`, `formatDateShort`, `getExcerpt`

### API Routes
- `GET /api/articles` - List all articles
- `POST /api/articles` - Create article (validates: title ≤200 chars, content ≤50000 chars, max 10 tags)
- `GET /api/articles/[id]` - Get single article
- `PUT /api/articles/[id]` - Update article
- `DELETE /api/articles/[id]` - Delete article

### Page Routes
- `/` - Home page with navigation cards and todo list
- `/blog` - Article listing page
- `/blog/[id]` - Individual article view
- `/editor` - Markdown editor with split-pane preview

### Client Components
Pages using client-side interactivity (`'use client'`):
- `app/editor/page.tsx` - Article editor with sidebar article list
- `app/blog/page.tsx` - Article listing with loading states
- `app/blog/[id]/page.tsx` - Article view with dynamic loading

### Key Files
- `lib/articles.ts` - Data access layer for JSON file operations
- `lib/markdown.ts` - Markdown parsing and formatting utilities
- `data/articles.json` - Article storage (auto-created if missing)
