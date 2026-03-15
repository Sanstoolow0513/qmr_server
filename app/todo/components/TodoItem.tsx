"use client";

import { useState } from "react";
import { Todo, TodoFormData, Priority } from "../types";
import { updateTodo } from "../actions";
import { Calendar, Tag, Pencil, Trash2, Check, X } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  isPending?: boolean;
}

function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case "high":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "medium":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "low":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function getPriorityLabel(priority: Priority): string {
  switch (priority) {
    case "high":
      return "高优先级";
    case "medium":
      return "中优先级";
    case "low":
      return "低优先级";
    default:
      return priority;
  }
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  isPending = false,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<TodoFormData>({
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    category: todo.category,
  });

  const handleSave = async () => {
    await updateTodo(todo.id, editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      category: todo.category,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="rounded-2xl border-2 border-emerald-300 bg-white p-5 shadow-lg">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              标题
            </label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-gray-900 transition-colors focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="输入标题"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              描述
            </label>
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2 text-gray-900 transition-colors focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="输入描述"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                优先级
              </label>
              <select
                value={editForm.priority}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    priority: e.target.value as Priority,
                  })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-gray-900 transition-colors focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                <option value="high">高优先级</option>
                <option value="medium">中优先级</option>
                <option value="low">低优先级</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                分类
              </label>
              <input
                type="text"
                value={editForm.category}
                onChange={(e) =>
                  setEditForm({ ...editForm, category: e.target.value })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-2 text-gray-900 transition-colors focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                placeholder="输入分类"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
              取消
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
            >
              <Check className="h-4 w-4" />
              保存
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-lg ${
        todo.done ? "bg-gray-50/80" : ""
      } ${isPending ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={onToggle}
          disabled={isPending}
          className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            todo.done
              ? "border-emerald-500 bg-emerald-500"
              : "border-gray-300 group-hover:border-emerald-400"
          }`}
        >
          {todo.done && (
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
        </button>
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3
              className={`font-semibold ${todo.done ? "text-gray-400 line-through" : "text-gray-900"}`}
            >
              {todo.title}
            </h3>
            <span
              className={`rounded-full border px-2 py-0.5 text-xs ${getPriorityColor(todo.priority)}`}
            >
              {getPriorityLabel(todo.priority)}
            </span>
          </div>
          <p
            className={`mb-3 text-sm ${todo.done ? "text-gray-400 line-through" : "text-gray-600"}`}
          >
            {todo.description}
          </p>
          <div
            className={`flex flex-wrap items-center gap-4 text-xs ${todo.done ? "text-gray-400" : "text-gray-500"}`}
          >
            <span className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              {todo.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {todo.createdAt}
            </span>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setIsEditing(true)}
            disabled={isPending}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            title="编辑"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            disabled={isPending}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
            title="删除"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
