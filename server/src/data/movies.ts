export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  year: number;
  genre: string[];
  difficulty: "easy" | "medium" | "hard";
}

export const MOVIES: Movie[] = [
  // Easy Movies
  {
    id: "matrix",
    title: "The Matrix",
    posterUrl: "/assets/movie-posters/matrix.jpg",
    year: 1999,
    genre: ["Action", "Sci-Fi"],
    difficulty: "easy",
  },
  {
    id: "inception",
    title: "Inception",
    posterUrl: "/assets/movie-posters/inception.jpg",
    year: 2010,
    genre: ["Action", "Sci-Fi", "Thriller"],
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
    id: "lion-king",
    title: "The Lion King",
    posterUrl: "/assets/movie-posters/lion-king.jpg",
    year: 1994,
    genre: ["Animation", "Adventure", "Drama"],
    difficulty: "easy",
  },
  {
    id: "forrest-gump",
    title: "Forrest Gump",
    posterUrl: "/assets/movie-posters/forrest-gump.jpg",
    year: 1994,
    genre: ["Drama", "Romance"],
    difficulty: "easy",
  },
  {
    id: "jaws",
    title: "Jaws",
    posterUrl: "/assets/movie-posters/jaws.jpg",
    year: 1975,
    genre: ["Thriller", "Horror"],
    difficulty: "easy",
  },
  {
    id: "pulp-fiction",
    title: "Pulp Fiction",
    posterUrl: "/assets/movie-posters/pulp-fiction.jpg",
    year: 1994,
    genre: ["Crime", "Drama"],
    difficulty: "easy",
  },
  {
    id: "godfather",
    title: "The Godfather",
    posterUrl: "/assets/movie-posters/godfather.jpg",
    year: 1972,
    genre: ["Crime", "Drama"],
    difficulty: "easy",
  },

  // Medium Movies
  {
    id: "avatar",
    title: "Avatar",
    posterUrl: "/assets/movie-posters/avatar.jpg",
    year: 2009,
    genre: ["Action", "Adventure", "Fantasy"],
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
    id: "dark-knight",
    title: "The Dark Knight",
    posterUrl: "/assets/movie-posters/dark-knight.jpg",
    year: 2008,
    genre: ["Action", "Crime", "Drama"],
    difficulty: "medium",
  },
  {
    id: "avengers",
    title: "The Avengers",
    posterUrl: "/assets/movie-posters/avengers.jpg",
    year: 2012,
    genre: ["Action", "Adventure", "Sci-Fi"],
    difficulty: "medium",
  },
  {
    id: "frozen",
    title: "Frozen",
    posterUrl: "/assets/movie-posters/frozen.jpg",
    year: 2013,
    genre: ["Animation", "Adventure", "Comedy"],
    difficulty: "medium",
  },
  {
    id: "toy-story",
    title: "Toy Story",
    posterUrl: "/assets/movie-posters/toy-story.jpg",
    year: 1995,
    genre: ["Animation", "Adventure", "Comedy"],
    difficulty: "medium",
  },
  {
    id: "star-wars",
    title: "Star Wars",
    posterUrl: "/assets/movie-posters/star-wars.jpg",
    year: 1977,
    genre: ["Action", "Adventure", "Fantasy"],
    difficulty: "medium",
  },
  {
    id: "back-to-future",
    title: "Back to the Future",
    posterUrl: "/assets/movie-posters/back-to-future.jpg",
    year: 1985,
    genre: ["Adventure", "Comedy", "Sci-Fi"],
    difficulty: "medium",
  },

  // Hard Movies
  {
    id: "citizen-kane",
    title: "Citizen Kane",
    posterUrl: "/assets/movie-posters/citizen-kane.jpg",
    year: 1941,
    genre: ["Drama", "Mystery"],
    difficulty: "hard",
  },
  {
    id: "casablanca",
    title: "Casablanca",
    posterUrl: "/assets/movie-posters/casablanca.jpg",
    year: 1942,
    genre: ["Drama", "Romance", "War"],
    difficulty: "hard",
  },
  {
    id: "psycho",
    title: "Psycho",
    posterUrl: "/assets/movie-posters/psycho.jpg",
    year: 1960,
    genre: ["Horror", "Mystery", "Thriller"],
    difficulty: "hard",
  },
  {
    id: "vertigo",
    title: "Vertigo",
    posterUrl: "/assets/movie-posters/vertigo.jpg",
    year: 1958,
    genre: ["Mystery", "Romance", "Thriller"],
    difficulty: "hard",
  },
  {
    id: "sunset-boulevard",
    title: "Sunset Boulevard",
    posterUrl: "/assets/movie-posters/sunset-boulevard.jpg",
    year: 1950,
    genre: ["Drama", "Film-Noir"],
    difficulty: "hard",
  },
  {
    id: "singin-in-rain",
    title: "Singin' in the Rain",
    posterUrl: "/assets/movie-posters/singin-in-rain.jpg",
    year: 1952,
    genre: ["Comedy", "Musical", "Romance"],
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

  const randomIndex = Math.floor(Math.random() * filteredMovies.length);
  return filteredMovies[randomIndex];
};

export const getMovieById = (id: string): Movie | undefined => {
  return MOVIES.find((movie) => movie.id === id);
};

export const getMoviesByDifficulty = (
  difficulty: "easy" | "medium" | "hard"
): Movie[] => {
  return MOVIES.filter((movie) => movie.difficulty === difficulty);
};
