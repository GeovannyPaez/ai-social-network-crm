import { Router } from "express";
import * as AiModelController from "../controllers/AiModelController";
import isAuth from "../middleware/isAuth";

const aiModelRouter = Router()

aiModelRouter.get("/models", isAuth, AiModelController.index)

export default aiModelRouter;