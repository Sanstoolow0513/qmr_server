'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Clock, Tag, ChevronRight, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { Article, formatDateShort, getExcerpt } from '@/lib/markdown';

function formatDate(dateString: string): string {
  return formatDateShort(dateString);
}

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      const data = await response.json();
      if (data.articles) {
        setArticles(data.articles);
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-gray-900">我的博客</h1>
              <p className="text-xs text-gray-500">记录思考与分享</p>
            </div>
          </div>

          <Link
            href="/editor"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            写文章
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="mt-4 text-gray-500">加载中... </p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">暂无文章</h2>
            <p className="text-gray-500 mb-6">开始撰写你的第一篇文章吧</p>
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              去写作
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.id}`}
                className="block group"
              >
                <article className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-0.5"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors"
                  >
                    {article.title}
                  </h2>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {getExcerpt(article.content)}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <time dateTime={article.createdAt}>
                          {formatDate(article.createdAt)}
                        </time>
                      </div>

                      {article.tags.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-gray-400" />
                          <div className="flex gap-1">
                            {article.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      阅读全文
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
