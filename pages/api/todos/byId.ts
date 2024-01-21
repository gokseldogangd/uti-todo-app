// pages/api/todos/byId.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      const todos = await db.todo.findUnique({
        where: {
          id: String(id),
        },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          order: true,
          columnId: true,
        },
      });

      if (todos) {
        res.status(200).json(todos);
      } else {
        res.status(404).json({ message: "Todo not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
