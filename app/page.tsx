import { FileText, ListTodo, PenTool, Sparkles, BookOpen, Edit3, CheckSquare } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const todoItems = [
    { id: 1, text: "配置Markdown编辑器（语法高亮、预览模式）", done: false },
    { id: 2, text: "设计文章元数据（标题、标签、创建时间）", done: true },
    { id: 3, text: "实现文章列表页（分页、搜索、筛选）", done: false },
    { id: 4, text: "添加代码块复制功能", done: false },
    { id: 5, text: "集成评论系统", done: false },
    { id: 6, text: "SEO优化与RSS订阅", done: false },
  ];

  const workflowSteps = [
    {
      title: "1. 构思与大纲",
      desc: "使用思维导图或简单列表梳理文章结构，确定核心观点",
    },
    {
      title: "2. 草稿撰写",
      desc: "在编辑器中快速输出初稿，不纠结格式，专注内容",
    },
    {
      title: "3. 格式优化",
      desc: "添加标题层级、代码块、引用、图片等Markdown元素",
    },
    {
      title: "4. 预览与修订",
      desc: "实时预览渲染效果，调整排版细节，优化阅读体验",
    },
    {
      title: "5. 发布归档",
      desc: "添加标签分类，设置封面图，提交到版本控制",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <header className="px-6 py-8 md:px-12">
        <div className="mx-auto max-w-6xl flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 shadow-lg shadow-orange-200">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            MyBlog
          </span>
        </div>
      </header>

      <main className="px-6 pb-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          {/* Hero Section */}
          <section className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              写作空间
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              记录想法、分享知识、构建个人知识库
            </p>
          </section>

          {/* 入口链接卡片 */}
          <section className="mb-12">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Blog 入口 */}
              <Link href="/blog" className="group">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-300">
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform duration-300 group-hover:scale-150" />
                  <div className="relative">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                      <BookOpen className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold">博客</h3>
                    <p className="text-sm text-blue-100">阅读文章、分享观点</p>
                  </div>
                </div>
              </Link>

              {/* Markdown 编辑器入口 */}
              <Link href="/editor" className="group">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white shadow-lg shadow-emerald-200 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-300">
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform duration-300 group-hover:scale-150" />
                  <div className="relative">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                      <Edit3 className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold">Markdown 编辑器</h3>
                    <p className="text-sm text-emerald-100">高效写作、实时预览</p>
                  </div>
                </div>
              </Link>

              {/* Todo List 入口 */}
              <Link href="/todo" className="group">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-rose-600 p-8 text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-300">
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform duration-300 group-hover:scale-150" />
                  <div className="relative">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                      <CheckSquare className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold">待办清单</h3>
                    <p className="text-sm text-orange-100">任务管理、进度追踪</p>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left: Markdown 编辑思路 */}
            <section className="rounded-3xl bg-white/80 p-8 shadow-xl shadow-orange-100/50 backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-200">
                  <PenTool className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Markdown 编辑思路
                  </h2>
                  <p className="text-sm text-gray-500">高效写作工作流</p>
                </div>
              </div>

              <div className="space-y-4">
                {workflowSteps.map((step, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-400 to-rose-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <h3 className="mb-1 font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tips */}
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-5">
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-500" />
                  <div>
                    <h4 className="mb-1 font-semibold text-gray-900">
                      写作小贴士
                    </h4>
                    <ul className="space-y-1.5 text-sm text-gray-600">
                      <li>• 使用 ## 和 ### 保持标题层级清晰</li>
                      <li>• 代码块标注语言类型获得语法高亮</li>
                      <li>• 适当使用引用块和分隔线增强可读性</li>
                      <li>• 图片添加 alt 文本提升可访问性</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Right: Todo List */}
            <section className="rounded-3xl bg-white/80 p-8 shadow-xl shadow-orange-100/50 backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-200">
                  <ListTodo className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    开发待办清单
                  </h2>
                  <p className="text-sm text-gray-500">Blog 功能开发进度</p>
                </div>
              </div>

              <div className="space-y-3">
                {todoItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-all duration-200 hover:border-emerald-200 hover:shadow-md"
                  >
                    <div
                      className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                        item.done
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-gray-300 hover:border-emerald-400"
                      }`}
                    >
                      {item.done && (
                        <svg
                          className="h-3.5 w-3.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-sm leading-relaxed transition-all duration-200 ${
                        item.done
                          ? "text-gray-400 line-through"
                          : "text-gray-700"
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="mt-8">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">整体进度</span>
                  <span className="font-semibold text-emerald-600">
                    {Math.round(
                      (todoItems.filter((i) => i.done).length /
                        todoItems.length) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                    style={{
                      width: `${
                        (todoItems.filter((i) => i.done).length /
                          todoItems.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  已完成 {todoItems.filter((i) => i.done).length} /{" "}
                  {todoItems.length} 项任务
                </p>
              </div>
            </section>
          </div>

          {/* Footer CTA */}
          <div className="mt-12 text-center">
            <button className="group inline-flex items-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-gray-200 transition-all duration-300 hover:bg-gray-800 hover:shadow-xl hover:shadow-gray-300">
              开始写作
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
