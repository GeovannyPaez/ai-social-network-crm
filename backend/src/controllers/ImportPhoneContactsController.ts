import { Request, Response } from "express";
import ImportContactsService from "../services/WbotServices/ImportContactsService";

export const store = async (req: Request, res: Response): Promise<Response> => {
  const userId: number = req.user.parentId;
  await ImportContactsService(userId);

  return res.status(200).json({ message: "contacts imported" });
};
