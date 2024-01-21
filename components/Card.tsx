import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import useSWR, { mutate } from "swr";
import { createTodo } from "@/actions/createTodo";
import {
  Card as ShadcnCard,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { ColumnItem } from "@/types/ColumnItem";
import { TodoItem } from "@/types/TodoItem";
import { Input } from "./ui/input";
import { Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

interface CardProps {
  column: ColumnItem;
  onAddTodo: (newTodo: TodoItem, columnId: string) => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Card: React.FC<CardProps> = ({ column, onAddTodo }) => {
  const { data: todos, error } = useSWR<TodoItem[]>(
    `/api/todos?columnId=${column.id}`,
    fetcher
  );

  const [todoTitle, setTodoTitle] = useState("");
  const [showInput, setShowInput] = useState(false);

  const handleAddTodo = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const newTodo = await createTodo(todoTitle, column.id);
      if (newTodo) {
        onAddTodo(newTodo as TodoItem, column.id);

        setTodoTitle("");
        setShowInput(false);
      }
    } catch (error) {
      console.error("Error adding new Todo:", error);
    }
  };

  if (error) return <div>Failed to load todos</div>;
  if (!todos) return <CardSkeleton />;

  return (
    <ShadcnCard className="shadow-md rounded-lg">
      <CardHeader>
        <h3 className="text-lg font-semibold">{column.title}</h3>
      </CardHeader>
      <CardContent>
        {todos &&
          todos.map((todo, index) => (
            <Draggable key={todo.id} draggableId={todo.id} index={index}>
              {(provided) => (
                <Link href={`/todos/${todo.id}`}>
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-gray-300 p-2 my-1 rounded-md hover:border hover:border-blue-500"
                  >
                    {todo.name}
                  </div>
                </Link>
              )}
            </Draggable>
          ))}
      </CardContent>
      <CardFooter className="flex items-center justify-between text-xs text-gray-500">
        {showInput ? (
          <form onSubmit={handleAddTodo} className="flex items-center w-full">
            <Input
              type="text"
              placeholder="Todo Title"
              value={todoTitle}
              onChange={(e) => setTodoTitle(e.target.value)}
              required
              className="w-full"
            />
            <Button type="submit" size="sm" className="ml-2">
              Add
            </Button>
            <X
              size={20}
              className="ml-2 cursor-pointer"
              onClick={() => setShowInput(false)}
            />
          </form>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="flex items-center"
          >
            <Plus size={20} />
            <span className="ml-2">Add a to-do</span>
          </button>
        )}
      </CardFooter>
    </ShadcnCard>
  );
};

const CardSkeleton: React.FC = () => {
  return (
    <ShadcnCard className="shadow-md rounded-lg">
      <CardHeader>
        <div className="animate-pulse h-6 w-24 bg-gray-300 rounded-md"></div>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse h-4 w-full bg-gray-300 rounded-md"></div>
        <div className="animate-pulse h-4 w-full bg-gray-300 rounded-md mt-1"></div>
        <div className="animate-pulse h-4 w-full bg-gray-300 rounded-md mt-1"></div>
      </CardContent>
      <CardFooter>
        <div className="animate-pulse h-6 w-24 bg-gray-300 rounded-md"></div>
      </CardFooter>
    </ShadcnCard>
  );
};

export default Card;
