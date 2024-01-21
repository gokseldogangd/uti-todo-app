import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, description, columnId } = req.body;

    try {
      const lastTodo = await db.todo.findFirst({
        where: {
          columnId: columnId,
        },
        orderBy: {
          order: "desc",
        },
      });
      const newOrder = lastTodo ? lastTodo.order + 1 : 1;

      const newTodo = await db.todo.create({
        data: { name, description, order: newOrder, columnId },
      });
      res.status(200).json(newTodo);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
