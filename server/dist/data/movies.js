"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUsedMovies = exports.getMoviesByDifficulty = exports.getMovieByTitle = exports.getRandomMovie = exports.MOVIES = void 0;
// Set to keep track of used movies during a game session
const usedMovies = new Set();
exports.MOVIES = [
    {
        id: "jurassic-park",
        title: "Jurassic Park",
        posterUrl: "/assets/movie-posters/jurassic-park.jpg",
        year: 1993,
        genre: ["Action", "Adventure", "Sci-Fi"],
        difficulty: "easy",
    },
    {
        id: "tomb-raider",
        title: "Tomb Raider",
        posterUrl: "/assets/movie-posters/tomb-raider.jpg",
        year: 2018,
        genre: ["Action", "Adventure", "Fantasy"],
        difficulty: "easy",
    },
    {
        id: "prince-of-persia",
        title: "Prince of Persia",
        posterUrl: "/assets/movie-posters/prince-of-persia.jpg",
        year: 2010,
        genre: ["Action", "Adventure", "Fantasy"],
        difficulty: "medium",
    },
    {
        id: "pursuit-of-happyness",
        title: "The Pursuit of Happyness",
        posterUrl: "/assets/movie-posters/pursuit-of-happyness.jpg",
        year: 2006,
        genre: ["Biography", "Drama"],
        difficulty: "medium",
    },
    {
        id: "wolf-of-wall-street",
        title: "The Wolf of Wall Street",
        posterUrl: "/assets/movie-posters/wolf-of-wall-street.jpg",
        year: 2013,
        genre: ["Biography", "Crime", "Drama"],
        difficulty: "medium",
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
        id: "money-heist",
        title: "Money Heist",
        posterUrl: "/assets/movie-posters/money-heist.jpg",
        year: 2017,
        genre: ["Action", "Crime", "Drama"],
        difficulty: "medium",
    },
    {
        id: "godfather",
        title: "The Godfather",
        posterUrl: "/assets/movie-posters/godfather.jpg",
        year: 1972,
        genre: ["Crime", "Drama"],
        difficulty: "medium",
    },
    {
        id: "interstellar",
        title: "Interstellar",
        posterUrl: "/assets/movie-posters/interstellar.jpg",
        year: 2014,
        genre: ["Adventure", "Drama", "Sci-Fi"],
        difficulty: "hard",
    },
    {
        id: "get-out",
        title: "Get Out",
        posterUrl: "/assets/movie-posters/get-out.jpg",
        year: 2017,
        genre: ["Horror", "Mystery", "Thriller"],
        difficulty: "hard",
    },
    {
        id: "joker",
        title: "Joker",
        posterUrl: "/assets/movie-posters/joker.jpg",
        year: 2019,
        genre: ["Crime", "Drama", "Thriller"],
        difficulty: "medium",
    },
    {
        id: "annabelle",
        title: "Annabelle",
        posterUrl: "/assets/movie-posters/annabelle.jpg",
        year: 2014,
        genre: ["Horror", "Mystery", "Thriller"],
        difficulty: "medium",
    },
    {
        id: "ddlj",
        title: "Dil wale dulhaniya le jayenge",
        posterUrl: "/assets/movie-posters/ddlj.jpg",
        year: 1995,
        genre: ["Drama", "Romance"],
        difficulty: "hard",
    },
    {
        id: "sooryavansham",
        title: "Sooryavansham",
        posterUrl: "/assets/movie-posters/sooryavansham.jpg",
        year: 1999,
        genre: ["Drama", "Family"],
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
