import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { id, name, description, columnId } = req.body;

    try {
      const updatedTodo = await db.todo.update({
        where: { id },
        data: { name, description, columnId }, // columnId alanını da güncelle
      });
      res.status(200).json(updatedTodo);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
