import Board from "@/components/board/board";
import { Navbar } from "@/components/navbar/navbar";
import type { NextPage } from "next";

const Todos: NextPage = () => {
  return (
    <div className="h-full">
      <Navbar />
      <div className="mt-14 p-4">
        <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
        <div className="grid  gap-4">
          <Board />
        </div>
      </div>
    </div>
  );
};

export default Todos;
