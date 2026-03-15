"use client";

import { useOptimistic, useTransition } from "react";
import { Todo } from "../types";
import { toggleTodo, deleteTodo } from "../actions";
import TodoItem from "./TodoItem";
import { CheckSquare, Sparkles } from "lucide-react";

interface TodoListProps {
  initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(
    initialTodos,
    (state: Todo[], action: { type: "toggle" | "delete"; id: number }) => {
      if (action.type === "toggle") {
        return state.map((todo) =>
          todo.id === action.id ? { ...todo, done: !todo.done } : todo
        );
      }
      if (action.type === "delete") {
        return state.filter((todo) => todo.id !== action.id);
      }
      return state;
    }
  );

  const handleToggle = (id: number) => {
    startTransition(async () => {
      setOptimisticTodos({ type: "toggle", id });
      await toggleTodo(id);
    });
  };

  const handleDelete = (id: number) => {
    startTransition(async () => {
      setOptimisticTodos({ type: "delete", id });
      await deleteTodo(id);
    });
  };

  const pendingTodos = optimisticTodos.filter((t) => !t.done);
  const completedTodos = optimisticTodos.filter((t) => t.done);
  const progress =
    optimisticTodos.length > 0
      ? Math.round((completedTodos.length / optimisticTodos.length) * 100)
      : 0;

  return (
    <>
      {/* Progress Card */}
      <section className="mb-8 rounded-3xl bg-white/80 p-6 shadow-xl shadow-orange-100/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">整体进度</h2>
            <p className="text-sm text-gray-500">
              已完成 {completedTodos.length} / {optimisticTodos.length} 项任务
            </p>
          </div>
          <span className="text-3xl font-bold text-emerald-600">{progress}%</span>
        </div>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      {/* Pending Todos */}
      <section className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
            {pendingTodos.length}
          </span>
          待完成
        </h2>
        <div className="space-y-4">
          {pendingTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => handleToggle(todo.id)}
              onDelete={() => handleDelete(todo.id)}
              isPending={isPending}
            />
          ))}
          {pendingTodos.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white/50 p-8 text-center">
              <Sparkles className="mx-auto mb-3 h-10 w-10 text-amber-400" />
              <p className="text-gray-500">暂无待办事项</p>
            </div>
          )}
        </div>
      </section>

      {/* Completed Todos */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
            {completedTodos.length}
          </span>
          已完成
        </h2>
        <div className="space-y-4">
          {completedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => handleToggle(todo.id)}
              onDelete={() => handleDelete(todo.id)}
              isPending={isPending}
            />
          ))}
          {completedTodos.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white/50 p-8 text-center">
              <CheckSquare className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p className="text-gray-500">还没有完成的任务</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
