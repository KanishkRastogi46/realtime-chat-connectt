import { Router } from "express";
import protectedRoute from "../middlewares/userAuth.middleware";

const router = Router();


router.get("", protectedRoute, (req, res) => {
    res.json({ message: "Get all chats" });
});


export default router;