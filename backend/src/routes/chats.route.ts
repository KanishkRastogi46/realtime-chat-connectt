import { Router } from "express";
import protectedRoute from "../middlewares/userAuth.middleware";

const router = Router();


router.post("/get-users", protectedRoute,);

router.get("/get-messages/:chatId", protectedRoute,);


export default router;