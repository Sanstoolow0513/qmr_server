import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MarkdownContent } from "./markdown-content";
import { ThemeToggle } from "@/components/theme";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "文章未找到",
    };
  }

  return {
    title: `${post.title} | MyBlog`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen theme-gradient">
      {/* Header */}
      <header className="px-6 py-6 md:px-12">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--theme-text-secondary)] transition-colors hover:text-[var(--theme-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            返回文章列表
          </Link>
          <ThemeToggle variant="icon" size="md" />
        </div>
      </header>

      <main className="px-6 pb-16 md:px-12">
        <div className="mx-auto max-w-3xl">
          {/* Article */}
          <article className="overflow-hidden rounded-3xl bg-[var(--theme-surface)]/80 shadow-xl shadow-stone-100/50 dark:shadow-stone-900/30 backdrop-blur-sm border border-[var(--theme-border)]">
            {/* Article Header */}
            <div className="border-b border-[var(--theme-border)] bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 p-6 md:p-10">
              {/* Tags */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-100/50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-[var(--theme-text-primary)] md:text-3xl lg:text-4xl">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--theme-text-tertiary)]">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {post.createdAt}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.readingTime} 阅读
                </span>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-6 md:p-10">
              <MarkdownContent content={post.content} />
            </div>
          </article>

          {/* Navigation */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-text-primary)] px-6 py-3 text-sm font-semibold text-[var(--theme-surface)] shadow-lg shadow-stone-200 dark:shadow-stone-900/50 transition-all duration-300 hover:opacity-90 hover:shadow-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              返回文章列表
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
