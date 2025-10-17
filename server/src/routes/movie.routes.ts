import { Router } from "express";
import {
  getAllMovies,
  getMovieById,
  getRandomMovie,
  getMoviesByDifficulty,
} from "../controllers/movie.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

// Apply authentication middleware to all movie routes
router.use(authenticateToken);

router.get("/", getAllMovies);
router.get("/random", getRandomMovie);
router.get("/difficulty/:difficulty", getMoviesByDifficulty);
router.get("/:id", getMovieById);

export default router;
