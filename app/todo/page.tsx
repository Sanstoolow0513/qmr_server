import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import { TodoData } from "./types";
import AddTodoForm from "./components/AddTodoForm";
import TodoList from "./components/TodoList";

async function getTodos(): Promise<TodoData> {
  try {
    const filePath = path.join(process.cwd(), "data", "todos.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Failed to load todos:", error);
    return { todos: [] };
  }
}

export default async function TodoPage() {
  const { todos } = await getTodos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Header */}
      <header className="px-6 py-6 md:px-12">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
        </div>
      </header>

      <main className="px-6 pb-16 md:px-12">
        <div className="mx-auto max-w-4xl">
          {/* Page Header */}
          <section className="mb-10 text-center">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              待办清单
            </h1>
            <p className="text-gray-600">追踪开发任务进度</p>
          </section>

          {/* Add Todo Form */}
          <section className="mb-8">
            <AddTodoForm />
          </section>

          {/* Todo List with Progress */}
          <TodoList initialTodos={todos} />
        </div>
      </main>
    </div>
  );
}
