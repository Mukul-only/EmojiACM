"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUsedMovies = exports.getMoviesByDifficulty = exports.getMovieByTitle = exports.getRandomMovie = exports.MOVIES = void 0;
// Set to keep track of used movies during a game session
const usedMovies = new Set();
exports.MOVIES = [
    // ---------- EASY ----------
    {
        id: "harry-potter",
        title: "Harry Potter",
        posterUrl: "/assets/movie-posters/harry-potter.jpg",
        year: 2001,
        genre: ["Adventure", "Family", "Fantasy"],
        difficulty: "easy",
    },
    {
        id: "jurassic-park",
        title: "Jurassic Park",
        posterUrl: "/assets/movie-posters/jurassic-park.jpg",
        year: 1993,
        genre: ["Action", "Adventure", "Sci-Fi"],
        difficulty: "easy",
    },
    {
        id: "titanic",
        title: "Titanic",
        posterUrl: "/assets/movie-posters/titanic.jpg",
        year: 1997,
        genre: ["Drama", "Romance"],
        difficulty: "easy",
    },
    {
        id: "the-conjuring",
        title: "The Conjuring",
        posterUrl: "/assets/movie-posters/the-conjuring.jpg",
        year: 2013,
        genre: ["Horror", "Mystery", "Thriller"],
        difficulty: "easy",
    },
    {
        id: "3-idiots",
        title: "3 Idiots",
        posterUrl: "/assets/movie-posters/3-idiots.jpg",
        year: 2009,
        genre: ["Comedy", "Drama"],
        difficulty: "easy",
    },
    // ---------- MEDIUM ----------
    {
        id: "the-dark-knight",
        title: "The Dark Knight",
        posterUrl: "/assets/movie-posters/the-dark-knight.jpg",
        year: 2008,
        genre: ["Action", "Crime", "Drama"],
        difficulty: "medium",
    },
    {
        id: "sherlock-holmes",
        title: "Sherlock Holmes",
        posterUrl: "/assets/movie-posters/sherlock-holmes.jpg",
        year: 2009,
        genre: ["Action", "Adventure", "Mystery"],
        difficulty: "medium",
    },
    {
        id: "maze-runner",
        title: "The Maze Runner",
        posterUrl: "/assets/movie-posters/maze-runner.jpg",
        year: 2014,
        genre: ["Action", "Mystery", "Sci-Fi"],
        difficulty: "medium",
    },
    {
        id: "lion-king",
        title: "The Lion King",
        posterUrl: "/assets/movie-posters/lion-king.jpg",
        year: 1994,
        genre: ["Animation", "Adventure", "Drama"],
        difficulty: "medium",
    },
    {
        id: "interstellar",
        title: "Interstellar",
        posterUrl: "/assets/movie-posters/interstellar.jpg",
        year: 2014,
        genre: ["Adventure", "Drama", "Sci-Fi"],
        difficulty: "medium",
    },
    {
        id: "fast-and-furious",
        title: "Fast and Furious",
        posterUrl: "/assets/movie-posters/fast-and-furious.jpg",
        year: 2001,
        genre: ["Action", "Crime", "Thriller"],
        difficulty: "medium",
    },
    {
        id: "chennai-express",
        title: "Chennai Express",
        posterUrl: "/assets/movie-posters/chennai-express.jpg",
        year: 2013,
        genre: ["Action", "Comedy", "Romance"],
        difficulty: "medium",
    },
    // ---------- HARD ----------
    {
        id: "the-prestige",
        title: "The Prestige",
        posterUrl: "/assets/movie-posters/the-prestige.jpg",
        year: 2006,
        genre: ["Drama", "Mystery", "Sci-Fi"],
        difficulty: "hard",
    },
    {
        id: "the-matrix",
        title: "The Matrix",
        posterUrl: "/assets/movie-posters/the-matrix.jpg",
        year: 1999,
        genre: ["Action", "Sci-Fi"],
        difficulty: "hard",
    },
];
// Helper functions
const getRandomMovie = (difficulty) => {
    const filteredMovies = difficulty
        ? exports.MOVIES.filter((movie) => movie.difficulty === difficulty)
        : exports.MOVIES;
    // Filter out used movies
    const availableMovies = filteredMovies.filter((movie) => !usedMovies.has(movie.id));
    // If all movies have been used, reset the usedMovies set
    if (availableMovies.length === 0) {
        usedMovies.clear();
        return (0, exports.getRandomMovie)(difficulty); // Retry with reset list
    }
    const randomIndex = Math.floor(Math.random() * availableMovies.length);
    const selectedMovie = availableMovies[randomIndex];
    // Mark the movie as used
    usedMovies.add(selectedMovie.id);
    return selectedMovie;
};
exports.getRandomMovie = getRandomMovie;
const getMovieByTitle = (title) => {
    return exports.MOVIES.find((movie) => movie.title.toLowerCase() === title.toLowerCase());
};
exports.getMovieByTitle = getMovieByTitle;
const getMoviesByDifficulty = (difficulty) => {
    return exports.MOVIES.filter((movie) => movie.difficulty === difficulty);
};
exports.getMoviesByDifficulty = getMoviesByDifficulty;
// Function to reset used movies (can be called when starting a new game)
const resetUsedMovies = () => {
    usedMovies.clear();
};
exports.resetUsedMovies = resetUsedMovies;
