import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { Pencil, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar/navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TodoDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: todo, error } = useSWR(
    id ? `/api/todos/byId?id=${id}` : null,
    async (url) => {
      const response = await fetch(url);
      if (response.ok) {
        return response.json();
      } else {
        const notFoundError = new Error("Todo not found");
        (notFoundError as any).statusCode = 404;
        throw notFoundError;
      }
    }
  );
  useEffect(() => {
    if (error && error.statusCode === 404) {
      router.push("/404");
    }
  }, [error, router]);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (todo) {
      setName(todo.name);
      setDescription(todo.description || "");
    }
  }, [todo]);

  const updateTodo = async () => {
    if (!name.trim()) {
      setAlertMessage("To-Do name cannot be empty.");
      setShowAlert(true);
      return;
    }

    const updatedTodo = { id, name, description };
    const response = await fetch(`/api/todos/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    });

    if (response.ok) {
      mutate(`/api/todos/byId?id=${id}`);
      setIsEditing(false);
      setAlertMessage("Todo successfully updated!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } else {
      setAlertMessage("Failed to update todo.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const deleteTodo = async () => {
    const response = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setName(todo?.name);
    // Boş description yerine "" (boş dize) ayarla
    setDescription(todo?.description || "");
  };

  const characterLimit = 180;
  const remainingCharacters = characterLimit - description.length;
  const isOverLimit = remainingCharacters < 0;

  if (error) {
    return <div>An error occurred while loading the todo.</div>;
  }

  // Eğer veri yüklenmediyse veya todo henüz yüklenmediyse bekleme mesajını göster
  if (!todo) {
    return <div>Loading todo...</div>;
  }

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
      <Navbar />
      <div className="container mx-auto p-4 mt-12">
        <div className="bg-white shadow-md rounded-lg p-5">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-3 w-full mr-3">
              {isEditing ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={characterLimit}
                  placeholder="To-Do Name"
                  required
                />
              ) : (
                todo.name
              )}
            </h1>
            <div className="flex ">
              <Pencil
                onClick={() => setIsEditing(true)}
                className="cursor-pointer mr-4"
              />
              <Trash2
                onClick={() => setDeleteDialogOpen(true)}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="mb-4 bg-gray-100 rounded-lg p-2">
            {isEditing ? (
              <>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={characterLimit}
                  placeholder="Add a more description"
                  className="w-full bg-transparent border-none focus:outline-none"
                />
                <div className="text-right text-xs text-gray-400 mt-3">
                  {isOverLimit
                    ? `${remainingCharacters} characters over limit`
                    : `${remainingCharacters} characters remaining`}
                </div>
              </>
            ) : (
              <div className="w-full text-gray-500">
                {description || "Add a more description"}
              </div>
            )}
          </div>
          {isEditing && (
            <div className="flex justify-between items-center mb-4">
              <Button
                onClick={updateTodo}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Save Changes
              </Button>
              <Button
                onClick={cancelEdit}
                className="bg-red-500 text-white p-2 rounded ml-4 "
              >
                <X size={16} />
              </Button>
            </div>
          )}
          <div className="bg-gray-100 rounded-lg p-5">
            <p>Creation date: {new Date(todo.createdAt).toLocaleString()}</p>
            <p>Update date: {new Date(todo.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogTrigger asChild>
          <div />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete the todo.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={deleteTodo}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TodoDetailPage;
