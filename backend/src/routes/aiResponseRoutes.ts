import { Router } from "express"
import { getAiResponseController } from "../controllers/AiResponseController";
import isAuth from "../middleware/isAuth";

const aiReponseRoutes = Router();

aiReponseRoutes.post("/aiResponse", isAuth, getAiResponseController)

export default aiReponseRoutes;