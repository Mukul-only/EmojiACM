export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  year: number;
  genre: string[];
  difficulty: "easy" | "medium" | "hard";
  description?: string;
}

export const MOVIES: Movie[] = [
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
  {
    id: "frozen",
    title: "Frozen",
    posterUrl: "/assets/movie-posters/frozen.jpg",
    year: 2013,
    genre: ["Animation", "Adventure", "Comedy"],
    difficulty: "easy",
  },
  {
    id: "aladdin",
    title: "Aladdin",
    posterUrl: "/assets/movie-posters/aladdin.jpg",
    year: 1992,
    genre: ["Animation", "Adventure", "Comedy"],
    difficulty: "easy",
  },

  {
    id: "kung-fu-panda",
    title: "Kung Fu Panda",
    posterUrl: "/assets/movie-posters/kung-fu-panda.jpg",
    year: 2008,
    genre: ["Animation", "Action", "Adventure"],
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

  {
    id: "robin-hood",
    title: "Robin Hood",
    posterUrl: "/assets/movie-posters/robin-hood.jpg",
    year: 2010,
    genre: ["Action", "Adventure", "Drama"],
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
  {
    id: "the-lord-of-the-rings",
    title: "The Lord of the Rings",
    posterUrl: "/assets/movie-posters/the-lord-of-the-rings.jpg",
    year: 2001,
    genre: ["Action", "Adventure", "Drama"],
    difficulty: "hard",
  },
  {
    id: "apollo-13",
    title: "Apollo 13",
    posterUrl: "/assets/movie-posters/apollo-13.jpg",
    year: 1995,
    genre: ["Adventure", "Drama", "History"],
    difficulty: "hard",
  },
  {
    id: "the-martian",
    title: "The Martian",
    posterUrl: "/assets/movie-posters/the-martian.jpg",
    year: 2015,
    genre: ["Adventure", "Drama", "Sci-Fi"],
    difficulty: "hard",
  },
  {
    id: "childs-play",
    title: "Child's Play",
    posterUrl: "/assets/movie-posters/childs-play.jpg",
    year: 1988,
    genre: ["Horror", "Thriller"],
    difficulty: "hard",
  },
  {
    id: "snakes-on-a-plane",
    title: "Snakes on a Plane",
    posterUrl: "/assets/movie-posters/snakes-on-a-plane.jpg",
    year: 2006,
    genre: ["Action", "Adventure", "Thriller"],
    difficulty: "hard",
  },
];

// Helper functions
export const getRandomMovie = (
  excludedIds: Set<string> = new Set(),
  difficulty?: "easy" | "medium" | "hard",
): Movie => {
  const filteredMovies = difficulty
    ? MOVIES.filter((movie) => movie.difficulty === difficulty)
    : MOVIES;

  // Filter out used movies from the provided set
  const availableMovies = filteredMovies.filter(
    (movie) => !excludedIds.has(movie.id),
  );

  // If all movies have been used, we can either return null, error, or reset.
  // For this logic, if we run out, we'll just pick from the full list again (implicitly resetting for this call)
  // OR we can throw an error. Let's fallback to full list but generally we want to avoid repeats.
  if (availableMovies.length === 0) {
    // Fallback: pick from any movie that matches difficulty, ignoring exclusion to prevent crashing
    const fallbackList = filteredMovies;
    const randomIndex = Math.floor(Math.random() * fallbackList.length);
    return fallbackList[randomIndex];
  }

  const randomIndex = Math.floor(Math.random() * availableMovies.length);
  return availableMovies[randomIndex];
};

export const getMovieByTitle = (title: string): Movie | undefined => {
  return MOVIES.find(
    (movie) => movie.title.toLowerCase() === title.toLowerCase(),
  );
};

export const getMoviesByDifficulty = (
  difficulty: "easy" | "medium" | "hard",
): Movie[] => {
  return MOVIES.filter((movie) => movie.difficulty === difficulty);
};
