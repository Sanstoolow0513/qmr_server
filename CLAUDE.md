# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 project with React 19, TypeScript, and Tailwind CSS v4. It's a Chinese-language blog/writing space application with plans for Markdown editing, article management, and todo list features.

## Package Manager

This project uses **pnpm**. Do not use npm or yarn.

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint
```

## Development Server

The development server runs on [http://localhost:3000](http://localhost:3000).

```bash
pnpm dev
```

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 with PostCSS
- **Icons**: lucide-react
- **Font**: Geist (via next/font/google)

## Tailwind CSS v4 Configuration

This project uses Tailwind CSS v4 which has a new configuration syntax:

- Main styles are in `app/globals.css`
- Uses `@import "tailwindcss"` instead of directives
- Theme customization uses `@theme inline` block
- CSS variables defined in `:root` for theming

Example from `globals.css`:
```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

## Project Structure

```
app/
├── layout.tsx      # Root layout with Geist font configuration
├── page.tsx        # Home page with blog/editor/todo links
├── globals.css     # Tailwind CSS v4 styles
└── favicon.ico     # Site favicon

public/             # Static assets
next.config.ts      # Next.js configuration (TypeScript)
eslint.config.mjs   # ESLint configuration using flat config format
postcss.config.mjs  # PostCSS configuration for Tailwind v4
tsconfig.json       # TypeScript configuration with path aliases
```

## Path Aliases

The project uses `@/*` as a path alias pointing to the root directory:

```typescript
import { something } from "@/lib/utils";  // Resolves to ./lib/utils
```

## ESLint Configuration

The project uses the new ESLint flat config format (`eslint.config.mjs`) with:
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`

Run linting with `pnpm lint`.

## Planned Features

Based on the current page content and todo list, planned features include:
- Markdown editor with syntax highlighting and preview
- Article metadata (title, tags, creation time)
- Article list page with pagination, search, and filtering
- Code block copy functionality
- Comment system integration
- SEO optimization and RSS feed
- Todo list for task management

## Important Notes

- The UI is primarily in Chinese (Simplified)
- Uses Tailwind CSS v4's new `@theme inline` syntax for custom theme properties
- The project uses React 19 which may have different behavior from React 18 for certain APIs
