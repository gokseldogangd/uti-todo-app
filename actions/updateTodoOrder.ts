import { TodoItem } from "@/types/TodoItem";

export const updateTodoOrder = async (todos: TodoItem[]) => {
  try {
    const validTodos = todos.filter((todo) => todo != null);

    const updatedOrder = validTodos.map((todo, index) => {
      if (!todo.id) {
        throw new Error("Invalid todo");
      }
      return {
        id: todo.id,
        order: index,
        columnId: todo.columnId,
      };
    });

    const response = await fetch("/api/todos/updateOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedOrder),
    });

    if (!response.ok) {
      throw new Error("Failed to update todo order");
    }

    return true;
  } catch (error) {
    return false;
  }
};
