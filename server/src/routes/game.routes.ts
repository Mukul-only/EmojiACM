import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { getGameStats, getGameHistory } from "../controllers/game.controller";

const router = Router();

// All game routes require authentication
router.use(authenticateToken);

// Get user's game statistics
router.get("/stats", getGameStats);

// Get user's game history with pagination
router.get("/history", getGameHistory);

export default router;
