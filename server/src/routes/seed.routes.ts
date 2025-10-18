import { Router } from "express";
import { seedUsers, seedTeams } from "../controllers/seed.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { admin } from "../middleware/admin.middleware";

const router = Router();

router.post("/users", seedUsers);
router.post("/teams", seedTeams);

export default router;
