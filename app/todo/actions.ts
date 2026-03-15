"use server";

import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { Todo, TodoData, TodoFormData } from "./types";

const TODOS_PATH = path.join(process.cwd(), "data", "todos.json");

async function readTodoData(): Promise<TodoData> {
  const fileContents = await fs.readFile(TODOS_PATH, "utf8");
  return JSON.parse(fileContents) as TodoData;
}

async function writeTodoData(data: TodoData): Promise<void> {
  const tempPath = `${TODOS_PATH}.tmp`;
  const payload = `${JSON.stringify(data, null, 2)}\n`;

  await fs.writeFile(tempPath, payload, "utf8");
  await fs.rename(tempPath, TODOS_PATH);
}

export async function addTodo(formData: TodoFormData): Promise<Todo> {
  "use server";

  try {
    const data = await readTodoData();

    const newTodo: Todo = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      done: false,
      priority: formData.priority,
      createdAt: new Date().toISOString().split("T")[0],
      category: formData.category,
    };

    data.todos.push(newTodo);
    await writeTodoData(data);
    revalidatePath("/todo");

    return newTodo;
  } catch {
    throw new Error("添加待办事项失败，请稍后重试。");
  }
}

export async function toggleTodo(id: number): Promise<Todo> {
  "use server";

  try {
    const data = await readTodoData();
    const todoIndex = data.todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      throw new Error("NOT_FOUND");
    }

    const updatedTodo: Todo = {
      ...data.todos[todoIndex],
      done: !data.todos[todoIndex].done,
    };

    data.todos[todoIndex] = updatedTodo;
    await writeTodoData(data);
    revalidatePath("/todo");

    return updatedTodo;
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      throw new Error("未找到对应的待办事项。");
    }

    throw new Error("更新待办状态失败，请稍后重试。");
  }
}

export async function deleteTodo(id: number): Promise<void> {
  "use server";

  try {
    const data = await readTodoData();
    const nextTodos = data.todos.filter((todo) => todo.id !== id);

    if (nextTodos.length === data.todos.length) {
      throw new Error("NOT_FOUND");
    }

    await writeTodoData({ todos: nextTodos });
    revalidatePath("/todo");
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      throw new Error("未找到要删除的待办事项。");
    }

    throw new Error("删除待办事项失败，请稍后重试。");
  }
}

export async function updateTodo(
  id: number,
  updates: Partial<TodoFormData>
): Promise<Todo> {
  "use server";

  try {
    const data = await readTodoData();
    const todoIndex = data.todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      throw new Error("NOT_FOUND");
    }

    const currentTodo = data.todos[todoIndex];
    const updatedTodo: Todo = {
      ...currentTodo,
      title: updates.title ?? currentTodo.title,
      description: updates.description ?? currentTodo.description,
      priority: updates.priority ?? currentTodo.priority,
      category: updates.category ?? currentTodo.category,
    };

    data.todos[todoIndex] = updatedTodo;
    await writeTodoData(data);
    revalidatePath("/todo");

    return updatedTodo;
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      throw new Error("未找到要更新的待办事项。");
    }

    throw new Error("更新待办事项失败，请稍后重试。");
  }
}
