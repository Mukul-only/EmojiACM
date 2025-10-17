import { api } from "./api.base";

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  year: number;
  genre: string[];
  description: string;
  difficulty: "easy" | "medium" | "hard";
}

export const moviesApi = {
  getAll: () => api.get<Movie[]>("/movies"),

  getById: (id: string) => api.get<Movie>(`/movies/${id}`),

  getRandom: (difficulty?: string) =>
    api.get<Movie>(
      `/movies/random${difficulty ? `?difficulty=${difficulty}` : ""}`
    ),

  getByDifficulty: (difficulty: string) =>
    api.get<Movie[]>(`/movies/difficulty/${difficulty}`),
};
