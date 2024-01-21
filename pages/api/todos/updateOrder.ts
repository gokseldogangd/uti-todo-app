import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const updatedOrder = req.body;

    try {
      for (const item of updatedOrder) {
        await db.todo.update({
          where: { id: item.id },
          data: { order: item.order, columnId: item.columnId }, // columnId alanını da güncelle
        });
      }
      res.status(200).json({ message: "Order updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update order" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
