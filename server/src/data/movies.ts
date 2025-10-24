export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  year: number;
  genre: string[];
  difficulty: "easy" | "medium" | "hard";
  description?: string;
}

// Set to keep track of used movies during a game session
const usedMovies = new Set<string>();

export const MOVIES: Movie[] = [
  // ---------- EASY ----------
  {
    id: "frozen",
    title: "Frozen",
    posterUrl: "/assets/movie-posters/frozen.jpg",
    year: 2013,
    genre: ["Animation", "Adventure", "Comedy"],
    difficulty: "easy",
  },
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
    id: "kung-fu-panda",
    title: "Kung Fu Panda",
    posterUrl: "/assets/movie-posters/kung-fu-panda.jpg",
    year: 2008,
    genre: ["Animation", "Action", "Adventure"],
    difficulty: "easy",
  },
  {
    id: "the-lion-king",
    title: "The Lion King",
    posterUrl: "/assets/movie-posters/the-lion-king.jpg",
    year: 1994,
    genre: ["Animation", "Adventure", "Drama"],
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
    id: "annabelle",
    title: "Annabelle",
    posterUrl: "/assets/movie-posters/annabelle.jpg",
    year: 2014,
    genre: ["Horror", "Mystery", "Thriller"],
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
    id: "housefull",
    title: "Housefull",
    posterUrl: "/assets/movie-posters/housefull.jpg",
    year: 2010,
    genre: ["Comedy", "Romance"],
    difficulty: "medium",
  },
  // ---------- HARD ----------
  {
    id: "interstellar",
    title: "Interstellar",
    posterUrl: "/assets/movie-posters/interstellar.jpg",
    year: 2014,
    genre: ["Adventure", "Drama", "Sci-Fi"],
    difficulty: "hard",
  },
  {
    id: "animal",
    title: "Animal",
    posterUrl: "/assets/movie-posters/animal.jpg",
    year: 2023,
    genre: ["Action", "Crime", "Drama"],
    difficulty: "hard",
  },
  {
    id: "border",
    title: "Border",
    posterUrl: "/assets/movie-posters/border.jpg",
    year: 1997,
    genre: ["Action", "Drama", "War"],
    difficulty: "hard",
  },
];
// Helper functions
export const getRandomMovie = (
  difficulty?: "easy" | "medium" | "hard"
): Movie => {
  const filteredMovies = difficulty
    ? MOVIES.filter((movie) => movie.difficulty === difficulty)
    : MOVIES;

  // Filter out used movies
  const availableMovies = filteredMovies.filter(
    (movie) => !usedMovies.has(movie.id)
  );

  // If all movies have been used, reset the usedMovies set
  if (availableMovies.length === 0) {
    usedMovies.clear();
    return getRandomMovie(difficulty); // Retry with reset list
  }

  const randomIndex = Math.floor(Math.random() * availableMovies.length);
  const selectedMovie = availableMovies[randomIndex];

  // Mark the movie as used
  usedMovies.add(selectedMovie.id);

  return selectedMovie;
};

export const getMovieByTitle = (title: string): Movie | undefined => {
  return MOVIES.find(
    (movie) => movie.title.toLowerCase() === title.toLowerCase()
  );
};

export const getMoviesByDifficulty = (
  difficulty: "easy" | "medium" | "hard"
): Movie[] => {
  return MOVIES.filter((movie) => movie.difficulty === difficulty);
};

// Function to reset used movies (can be called when starting a new game)
export const resetUsedMovies = () => {
  usedMovies.clear();
};
