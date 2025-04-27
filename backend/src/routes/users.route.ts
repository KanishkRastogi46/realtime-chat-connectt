import { Router , Request , Response } from "express";
import { login, logout, profile, register } from "../controllers/users.controller";
import protectedRoute from "../middlewares/userAuth.middleware";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/profile", protectedRoute, profile);

router.get("/logout", protectedRoute, logout);

export default router;