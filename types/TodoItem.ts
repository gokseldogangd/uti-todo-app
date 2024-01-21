export type TodoItem = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  order: number;
  columnId: string | null;
};
