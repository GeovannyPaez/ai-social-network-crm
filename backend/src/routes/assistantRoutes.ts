import { Router } from "express";
import { index, store, remove, show, update } from "../controllers/AssistantController";
import isAuth from "../middleware/isAuth";
const assistantRouter = Router();

assistantRouter.get("/assistants", isAuth, index);

assistantRouter.post("/assistants", isAuth, store);

assistantRouter.delete("/assistants/:id", isAuth, remove);

assistantRouter.get("/assistants/:id", isAuth, show);

assistantRouter.put("/assistants/:id", isAuth, update);


export default assistantRouter;