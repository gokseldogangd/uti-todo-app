import React, { useState } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import useSWR, { mutate } from "swr";
import Card from "../Card";
import { TodoItem } from "@/types/TodoItem";
import { ColumnItem } from "@/types/ColumnItem";
import { updateTodoOrder } from "@/actions/updateTodoOrder";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Board: React.FC = () => {
  const { data: columns, error } = useSWR<ColumnItem[]>("/api/column", fetcher);
  const [draggingTodo, setDraggingTodo] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [columnsState, setColumnsState] = useState<ColumnItem[]>(columns || []);

  const addNewTodoToColumn = (newTodo: TodoItem, columnId: string) => {
    setColumnsState((prevColumns) =>
      prevColumns.map((column) => {
        if (column.id === columnId) {
          const updatedTodos = [...column.todos, newTodo];
          return { ...column, todos: updatedTodos };
        }
        return column;
      })
    );

    mutate("/api/column", false);
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || !columns) {
      setDraggingTodo(null);
      return;
    }

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    const sourceColumnId = result.source.droppableId;
    const destColumnId = result.destination.droppableId;

    const sourceColumn = columns.find((col) => col.id === sourceColumnId);
    const destColumn = columns.find((col) => col.id === destColumnId);

    if (!sourceColumn || !destColumn) {
      setDraggingTodo(null);
      return;
    }

    const newSourceTodos = [...sourceColumn.todos];
    const newDestTodos =
      destColumnId === sourceColumnId ? newSourceTodos : [...destColumn.todos];

    const [movedTodo] = newSourceTodos.splice(sourceIndex, 1);
    if (!movedTodo) {
      setDraggingTodo(null);
      return;
    }
    if (sourceColumnId === destColumnId) {
      newSourceTodos.splice(destIndex, 0, movedTodo);
    } else {
      newDestTodos.splice(destIndex, 0, movedTodo);
      movedTodo.columnId = destColumnId;
    }

    const updatedColumns = columns.map((col) => {
      if (col.id === sourceColumnId) {
        return { ...col, todos: newSourceTodos };
      } else if (col.id === destColumnId) {
        return { ...col, todos: newDestTodos };
      }
      return col;
    });

    const updatedTodos =
      sourceColumnId === destColumnId
        ? newSourceTodos
        : [...newSourceTodos, ...newDestTodos];

    updateTodoOrder(updatedTodos)
      .then(() => {
        setAlertMessage("Column order updated successfully!");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
        mutate("/api/column", false);
      })
      .catch((error) => {
        console.error("Failed to update column order:", error);
        setAlertMessage("Failed to update column order.");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      });
    setDraggingTodo(null);
  };

  if (error) return <div>Failed to load columns.</div>;
  if (!columns) return <BoardSkeleton />;

  return (
    <>
      {showAlert && (
        <div className="fixed bottom-4 right-4">
          <Alert>
            <AlertTitle>Action Completed</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        </div>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <Card column={column} onAddTodo={addNewTodoToColumn} />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </>
  );
};
const BoardSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
};

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <Skeleton className="h-4 w-full bg-gray-300 rounded-md" />
      <Skeleton className="h-4 w-full bg-gray-300 rounded-md mt-1" />
      <Skeleton className="h-4 w-full bg-gray-300 rounded-md mt-1" />
      <Skeleton className="h-4 w-full bg-gray-300 rounded-md mt-1" />
    </div>
  );
};

export default Board;
