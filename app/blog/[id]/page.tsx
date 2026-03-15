'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Tag, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Article, parseMarkdown, formatDateShort } from '@/lib/markdown';

function formatDate(dateString: string): string {
  return formatDateShort(dateString);
}

export default function ArticlePage() {
  const params = useParams();
  const id = params?.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadArticle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadArticle = async () => {
    try {
      const response = await fetch(`/api/articles/${id}`);
      const data = await response.json();
      if (data.article) {
        setArticle(data.article);
      } else {
        setError('文章未找到');
      }
    } catch {
      setError('加载文章失败');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-500">加载中... </p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error || '文章不存在'}</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            返回博客列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            返回博客
          </Link>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <article className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <time dateTime={article.createdAt}>
                发布于 {formatDate(article.createdAt)}
              </time>
            </div>

            {article.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-sm bg-blue-50 text-blue-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link
              href={`/editor?edit=${article.id}`}
              className="ml-auto flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              编辑
            </Link>
          </div>

          {/* Content */}
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(article.content) }}
          />
        </article>
      </main>
    </div>
  );
}
