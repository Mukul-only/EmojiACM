"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const game_controller_1 = require("../controllers/game.controller");
const router = (0, express_1.Router)();
// All game routes require authentication
router.use(auth_middleware_1.authenticateToken);
// Get user's game statistics
router.get("/stats", game_controller_1.getGameStats);
// Get user's game history with pagination
router.get("/history", game_controller_1.getGameHistory);
exports.default = router;
