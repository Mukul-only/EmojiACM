"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const movies_1 = require("../../data/movies");
(0, vitest_1.describe)('getRandomMovie', () => {
    (0, vitest_1.it)('should return a movie from the MOVIES list', () => {
        const movie = (0, movies_1.getRandomMovie)();
        (0, vitest_1.expect)(movie).toBeDefined();
        (0, vitest_1.expect)(movies_1.MOVIES).toContain(movie);
    });
    (0, vitest_1.it)('should not return a movie that is in the excluded list', () => {
        const allMoviesExceptOne = new Set();
        // Exclude all movies except the first one
        for (let i = 1; i < movies_1.MOVIES.length; i++) {
            allMoviesExceptOne.add(movies_1.MOVIES[i].id);
        }
        const movie = (0, movies_1.getRandomMovie)(allMoviesExceptOne);
        (0, vitest_1.expect)(movie.id).toBe(movies_1.MOVIES[0].id);
    });
    (0, vitest_1.it)('should return a movie even if all are excluded (fallback mechanism)', () => {
        const allMovieIds = new Set(movies_1.MOVIES.map(m => m.id));
        const movie = (0, movies_1.getRandomMovie)(allMovieIds);
        // It should return *some* movie (fallback behavior)
        (0, vitest_1.expect)(movie).toBeDefined();
        (0, vitest_1.expect)(movies_1.MOVIES).toContain(movie);
    });
    (0, vitest_1.it)('should filter by difficulty if provided', () => {
        const easyMovie = (0, movies_1.getRandomMovie)(new Set(), 'easy');
        (0, vitest_1.expect)(easyMovie.difficulty).toBe('easy');
        const hardMovie = (0, movies_1.getRandomMovie)(new Set(), 'hard');
        (0, vitest_1.expect)(hardMovie.difficulty).toBe('hard');
    });
});
