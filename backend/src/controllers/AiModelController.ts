import { RequestHandler } from "express";
import ListAiModelsService from "../services/AiModelServices/ListAiModelsService";

export const index: RequestHandler = async (req, res) => {
    return res.json(await ListAiModelsService())
}

