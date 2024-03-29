import { Router } from "express"
import { getAiResponse } from "../controllers/AiResponseController";

const aiReponseRoutes = Router();

aiReponseRoutes.post("/aiResponse", getAiResponse)

export default aiReponseRoutes;