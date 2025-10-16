import { Router } from "express";
import { signup, login, getMe, logout } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticateToken, getMe);
router.post("/logout", logout);

export default router;
