import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { MarkdownContent } from "./markdown-content";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="px-6 py-6 md:px-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            返回文章列表
          </Link>
        </div>
      </header>

      <main className="px-6 pb-16 md:px-12">
        <div className="mx-auto max-w-3xl">
          {/* Article */}
          <article className="overflow-hidden rounded-3xl bg-white/80 shadow-xl shadow-blue-100/50 backdrop-blur-sm">
            {/* Article Header */}
            <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-6 md:p-10">
              {/* Tags */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-100/50 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
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
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-200 transition-all duration-300 hover:bg-gray-800 hover:shadow-xl"
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
