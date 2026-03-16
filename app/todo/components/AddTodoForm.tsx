"use client";

import { useState, useTransition } from "react";
import { TodoFormData, Priority } from "../types";
import { addTodo } from "../actions";
import { Plus, Check, X, Loader2 } from "lucide-react";

const initialFormData: TodoFormData = {
  title: "",
  description: "",
  priority: "medium",
  category: "功能开发",
};

export default function AddTodoForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState<TodoFormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("标题不能为空");
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        await addTodo(formData);
        setFormData(initialFormData);
        setIsOpen(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } catch {
        setError("添加失败，请稍后重试");
      }
    });
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setError(null);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full rounded-2xl border-2 border-dashed border-[var(--theme-border)] p-6 text-[var(--theme-text-secondary)] transition-colors hover:border-emerald-400 hover:text-emerald-600"
      >
        <span className="flex items-center justify-center gap-2">
          <Plus className="h-5 w-5" />
          添加新任务
        </span>
      </button>
    );
  }

  return (
    <div className="rounded-2xl bg-[var(--theme-surface)] p-6 shadow-lg border border-[var(--theme-border)]">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--theme-text-primary)]">
            标题 <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-2 text-[var(--theme-text-primary)] transition-colors focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30"
            placeholder="输入任务标题"
            disabled={isPending}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--theme-text-primary)]">
            描述
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="w-full resize-none rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-2 text-[var(--theme-text-primary)] transition-colors focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30"
            placeholder="输入任务描述"
            disabled={isPending}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-[var(--theme-text-primary)]">
              优先级
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value as Priority })
              }
              className="w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-2 text-[var(--theme-text-primary)] transition-colors focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30"
              disabled={isPending}
            >
              <option value="high">高优先级</option>
              <option value="medium">中优先级</option>
              <option value="low">低优先级</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-[var(--theme-text-primary)]">
              分类
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-2 text-[var(--theme-text-primary)] transition-colors focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30"
              placeholder="输入分类"
              disabled={isPending}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 dark:bg-rose-900/20 px-4 py-2 text-sm text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isPending}
            className="flex items-center gap-1 rounded-xl bg-[var(--theme-surface-hover)] px-4 py-2 text-sm font-medium text-[var(--theme-text-secondary)] transition-colors hover:bg-[var(--theme-border)] disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            取消
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                添加中...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                添加
              </>
            )}
          </button>
        </div>
      </form>

      {success && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-emerald-500 px-6 py-4 text-white shadow-lg">
          <span className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            添加成功！
          </span>
        </div>
      )}
    </div>
  );
}
