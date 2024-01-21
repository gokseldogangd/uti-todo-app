import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const columns = await db.column.findMany({
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          todos: {
            select: {
              id: true,
              name: true,
              description: true,
              createdAt: true,
              updatedAt: true,
              columnId: true,
              order: true,
            },
            orderBy: {
              order: "asc",
            },
          },
        },
      });
      res.status(200).json(columns);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
