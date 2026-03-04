"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoviesByDifficulty = exports.getRandomMovie = exports.getMovieById = exports.getAllMovies = void 0;
const movie_model_1 = require("../models/movie.model");
const getAllMovies = async (req, res) => {
    try {
        const movies = await movie_model_1.Movie.find({}, { __v: 0, _id: 0 });
        res.json(movies);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching movies" });
    }
};
exports.getAllMovies = getAllMovies;
const getMovieById = async (req, res) => {
    try {
        const movie = await movie_model_1.Movie.findOne({ id: req.params.id }, { __v: 0, _id: 0 });
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.json(movie);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching movie" });
    }
};
exports.getMovieById = getMovieById;
const getRandomMovie = async (req, res) => {
    try {
        const { difficulty } = req.query;
        const query = difficulty ? { difficulty } : {};
        const count = await movie_model_1.Movie.countDocuments(query);
        const random = Math.floor(Math.random() * count);
        const movie = await movie_model_1.Movie.findOne(query, { __v: 0, _id: 0 }).skip(random);
        if (!movie) {
            return res.status(404).json({ message: "No movies found" });
        }
        res.json(movie);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching random movie" });
    }
};
exports.getRandomMovie = getRandomMovie;
const getMoviesByDifficulty = async (req, res) => {
    try {
        const { difficulty } = req.params;
        const movies = await movie_model_1.Movie.find({ difficulty }, { __v: 0, _id: 0 });
        res.json(movies);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching movies" });
    }
};
exports.getMoviesByDifficulty = getMoviesByDifficulty;
