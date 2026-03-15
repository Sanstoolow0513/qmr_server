export interface Todo {
  id: number;
  title: string;
  description: string;
  done: boolean;
  priority: "high" | "medium" | "low";
  createdAt: string;
  category: string;
}

export interface TodoData {
  todos: Todo[];
}

export type Priority = "high" | "medium" | "low";

export interface TodoFormData {
  title: string;
  description: string;
  priority: Priority;
  category: string;
}
