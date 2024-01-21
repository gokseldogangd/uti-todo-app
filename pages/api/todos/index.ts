import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { columnId } = req.query;

    try {
      const todos = await db.todo.findMany({
        where: {
          ...(columnId ? { columnId: String(columnId) } : {}),
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
        orderBy: [{ order: "asc" }],
      });
      res.status(200).json(todos);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
