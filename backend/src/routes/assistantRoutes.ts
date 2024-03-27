import { Router } from "express";
import { index, store, remove, show, update } from "../controllers/AssistantController";
import isAuth from "../middleware/isAuth";
const assistantRouter = Router();

assistantRouter.get("/assistants", isAuth, index);

assistantRouter.post("/assistants", isAuth, store);

assistantRouter.delete("/assistants/:assistantId", isAuth, remove);

assistantRouter.get("/assistants/:assistantId", isAuth, show);

assistantRouter.put("/assistants/:assistantId", isAuth, update);


export default assistantRouter;