export const createTodo = async (
  name: string,

  columnId: string
) => {
  const response = await fetch("/api/todos/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, columnId }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
