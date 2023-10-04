import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
      try {
        const { userId, imageData } = req.body;
  
        const savedImage = await prismadb.image.create({
          data: {
            userId,
            imageUrl: imageData,
          },
        });
  
        res.status(201).json(savedImage);
        console.error("Image is saved successfully");

      } catch (error) {
        console.error("Error while saving image:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } finally {
        await prismadb.$disconnect();
      }
    } else {
      res.status(405); // Method not allowed
    }
  }