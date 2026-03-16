import { ArrowLeft, ListTodo } from "lucide-react";
import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import { TodoData } from "./types";
import AddTodoForm from "./components/AddTodoForm";
import TodoList from "./components/TodoList";
import { ThemeToggle } from "@/components/theme";

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
    <div className="min-h-screen theme-gradient">
      {/* Header */}
      <header className="px-6 py-6 md:px-12">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--theme-text-secondary)] transition-colors hover:text-[var(--theme-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
          <ThemeToggle variant="icon" size="md" />
        </div>
      </header>

      <main className="px-6 pb-16 md:px-12">
        <div className="mx-auto max-w-4xl">
          {/* Page Header */}
          <section className="mb-10 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-600 shadow-lg shadow-orange-200 dark:shadow-orange-900/30">
              <ListTodo className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-[var(--theme-text-primary)] md:text-4xl">
              待办清单
            </h1>
            <p className="text-[var(--theme-text-secondary)]">追踪开发任务进度</p>
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
