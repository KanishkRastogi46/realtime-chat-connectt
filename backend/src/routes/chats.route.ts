import { Router } from "express";
import protectedRoute from "../middlewares/userAuth.middleware";
import { loadChatUsers } from "../controllers/chats.controller";

const router = Router();

router.post("/load-users", protectedRoute, loadChatUsers);
router.get("/get-messages/:chatId", protectedRoute, );

export default router;