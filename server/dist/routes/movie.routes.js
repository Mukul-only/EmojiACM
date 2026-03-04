"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movie_controller_1 = require("../controllers/movie.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Apply authentication middleware to all movie routes
router.use(auth_middleware_1.authenticateToken);
router.get("/", movie_controller_1.getAllMovies);
router.get("/random", movie_controller_1.getRandomMovie);
router.get("/difficulty/:difficulty", movie_controller_1.getMoviesByDifficulty);
router.get("/:id", movie_controller_1.getMovieById);
exports.default = router;
