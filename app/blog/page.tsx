import Link from "next/link";
import { ArrowLeft, BookOpen, Calendar, Clock, Tag } from "lucide-react";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "博客文章",
  description: "浏览 MyBlog 的技术文章、学习笔记与开发经验分享。",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="px-6 py-6 md:px-12">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
        </div>
      </header>

      <main className="px-6 pb-16 md:px-12">
        <div className="mx-auto max-w-4xl">
          {/* Page Title */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              博客文章
            </h1>
            <p className="text-gray-600">
              分享技术心得、学习笔记与开发经验
            </p>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group relative overflow-hidden rounded-3xl bg-white/80 p-6 shadow-lg shadow-blue-100/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/50 md:p-8"
              >
                {/* Left accent border */}
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  {/* Tags */}
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h2 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600 md:text-2xl">
                    <Link href={`/blog/${post.slug}`} className="block">
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  <p className="mb-4 text-sm leading-relaxed text-gray-600 md:text-base">
                    {post.excerpt}
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 md:text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.createdAt}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readingTime}
                    </span>
                  </div>
                </div>

                {/* Hover arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 transition-all duration-300 group-hover:opacity-100 md:bottom-8 md:right-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Footer info */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              共 {posts.length} 篇文章
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
