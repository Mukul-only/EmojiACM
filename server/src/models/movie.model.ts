import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  genre: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
});

export const Movie = mongoose.model("Movie", movieSchema);
