import { Request, Response } from "express";
import { Movie } from "../models/movie.model";

export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find({}, { __v: 0, _id: 0 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching movies" });
  }
};

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findOne(
      { id: req.params.id },
      { __v: 0, _id: 0 }
    );
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Error fetching movie" });
  }
};

export const getRandomMovie = async (req: Request, res: Response) => {
  try {
    const { difficulty } = req.query;
    const query = difficulty ? { difficulty } : {};
    const count = await Movie.countDocuments(query);
    const random = Math.floor(Math.random() * count);
    const movie = await Movie.findOne(query, { __v: 0, _id: 0 }).skip(random);

    if (!movie) {
      return res.status(404).json({ message: "No movies found" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: "Error fetching random movie" });
  }
};

export const getMoviesByDifficulty = async (req: Request, res: Response) => {
  try {
    const { difficulty } = req.params;
    const movies = await Movie.find({ difficulty }, { __v: 0, _id: 0 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching movies" });
  }
};
