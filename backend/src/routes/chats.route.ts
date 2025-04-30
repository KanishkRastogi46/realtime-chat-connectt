import { Router } from "express";
import protectedRoute from "../middlewares/userAuth.middleware";
import { loadChatUsers, loadMessages, getCurrentMessage } from "../controllers/chats.controller";

const router = Router();

router.post("/load-users", protectedRoute, loadChatUsers);
router.post("/get-messages", protectedRoute, loadMessages);
router.post("/get-current-message", protectedRoute, getCurrentMessage);

export default router;