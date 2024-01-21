import { TodoItem } from "./TodoItem";

export interface ColumnItem {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  todos: TodoItem[];
}
