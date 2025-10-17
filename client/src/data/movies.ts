export interface Movie {export interface Movie {

  id: string;  id: string;

  title: string;  title: string;

  posterUrl: string;  posterUrl: string;

  year: number;  year: number;

  genre: string[];  genre: string[];

  difficulty: "easy" | "medium" | "hard";  description: string;

  description?: string;  difficulty: "easy" | "medium" | "hard";

}}



export const MOVIES: Movie[] = [export const MOVIES: Movie[] = [

  {  // Easy Movies

    id: "jurassic-park",  {

    title: "Jurassic Park",    id: "matrix",

    posterUrl: "/assets/movie-posters/jurassic-park.jpg",    title: "The Matrix",

    year: 1993,    posterUrl: "/assets/movie-posters/matrix.jpg",

    genre: ["Action", "Adventure", "Sci-Fi"],    year: 1999,

    difficulty: "easy",    genre: ["Action", "Sci-Fi"],

  },    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",

  {    difficulty: "easy"

    id: "tomb-raider",  },

    title: "Tomb Raider",  {

    posterUrl: "/assets/movie-posters/tomb-raider.jpg",    id: "inception",

    year: 2018,    title: "Inception",

    genre: ["Action", "Adventure", "Fantasy"],    posterUrl: "/assets/movie-posters/inception.jpg",

    difficulty: "easy",    year: 2010,

  },    genre: ["Action", "Sci-Fi", "Thriller"],

  {    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",

    id: "prince-of-persia",    difficulty: "easy"

    title: "Prince of Persia",  },

    posterUrl: "/assets/movie-posters/prince-of-persia.jpg",  {

    year: 2010,    id: "titanic",

    genre: ["Action", "Adventure", "Fantasy"],    title: "Titanic",

    difficulty: "medium",    posterUrl: "/assets/movie-posters/titanic.jpg",

  },    year: 1997,

  {    genre: ["Drama", "Romance"],

    id: "pursuit-of-happyness",    description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",

    title: "The Pursuit of Happyness",    difficulty: "easy"

    posterUrl: "/assets/movie-posters/pursuit-of-happyness.jpg",  },

    year: 2006,  {

    genre: ["Biography", "Drama"],    id: "lion-king",

    difficulty: "medium",    title: "The Lion King",

  },    posterUrl: "/assets/movie-posters/lion-king.jpg",

  {    year: 1994,

    id: "wolf-of-wall-street",    genre: ["Animation", "Adventure", "Drama"],

    title: "The Wolf of Wall Street",    description: "A young lion prince is cast out of his pride by his cruel uncle, who claims he killed his father, but later learns of his identity and his responsibilities.",

    posterUrl: "/assets/movie-posters/wolf-of-wall-street.jpg",    difficulty: "easy"

    year: 2013,  },

    genre: ["Biography", "Crime", "Drama"],  {

    difficulty: "medium",    id: "forrest-gump",

  },    title: "Forrest Gump",

  {    posterUrl: "/assets/movie-posters/forrest-gump.jpg",

    id: "titanic",    year: 1994,

    title: "Titanic",    genre: ["Drama", "Romance"],

    posterUrl: "/assets/movie-posters/titanic.jpg",    description: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.",

    year: 1997,    difficulty: "easy"

    genre: ["Drama", "Romance"],  },

    difficulty: "easy",  {

  },    id: "jaws",

  {    title: "Jaws",

    id: "money-heist",    posterUrl: "/assets/movie-posters/jaws.jpg",

    title: "Money Heist",    year: 1975,

    posterUrl: "/assets/movie-posters/money-heist.jpg",    genre: ["Thriller", "Horror"],

    year: 2017,    description: "A giant man-eating great white shark attacks beachgoers on Amity Island, a fictional New England summer resort town, prompting police chief Martin Brody to hunt it with the help of a marine biologist and a professional shark hunter.",

    genre: ["Action", "Crime", "Drama"],    difficulty: "easy"

    difficulty: "medium",  },

  },  {

  {    id: "pulp-fiction",

    id: "godfather",    title: "Pulp Fiction",

    title: "The Godfather",    posterUrl: "/assets/movie-posters/pulp-fiction.jpg",

    posterUrl: "/assets/movie-posters/godfather.jpg",    year: 1994,

    year: 1972,    genre: ["Crime", "Drama"],

    genre: ["Crime", "Drama"],    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",

    difficulty: "medium",    difficulty: "easy"

  },  },

  {  {

    id: "interstellar",    id: "godfather",

    title: "Interstellar",    title: "The Godfather",

    posterUrl: "/assets/movie-posters/interstellar.jpg",    posterUrl: "/assets/movie-posters/godfather.jpg",

    year: 2014,    year: 1972,

    genre: ["Adventure", "Drama", "Sci-Fi"],    genre: ["Crime", "Drama"],

    difficulty: "hard",    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",

  },    difficulty: "easy"

  {  },

    id: "get-out",

    title: "Get Out",  // Medium Movies

    posterUrl: "/assets/movie-posters/get-out.jpg",  {

    year: 2017,    id: "avatar",

    genre: ["Horror", "Mystery", "Thriller"],    title: "Avatar",

    difficulty: "hard",    posterUrl: "/assets/movie-posters/avatar.jpg",

  },    year: 2009,

  {    genre: ["Action", "Adventure", "Fantasy"],

    id: "joker",    description: "A paraplegic marine dispatched to the moon Pandora on a unique mission becomes torn between following orders and protecting the world he feels is his home.",

    title: "Joker",    difficulty: "medium"

    posterUrl: "/assets/movie-posters/joker.jpg",  },

    year: 2019,  {

    genre: ["Crime", "Drama", "Thriller"],    id: "interstellar",

    difficulty: "medium",    title: "Interstellar",

  },    posterUrl: "/assets/movie-posters/interstellar.jpg",

  {    year: 2014,

    id: "annabelle",    genre: ["Adventure", "Drama", "Sci-Fi"],

    title: "Annabelle",    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",

    posterUrl: "/assets/movie-posters/annabelle.jpg",    difficulty: "medium"

    year: 2014,  },

    genre: ["Horror", "Mystery", "Thriller"],  {

    difficulty: "medium",    id: "dark-knight",

  },    title: "The Dark Knight",

  {    posterUrl: "/assets/movie-posters/dark-knight.jpg",

    id: "ddlj",    year: 2008,

    title: "Dil wale dulhaniya le jayenge",    genre: ["Action", "Crime", "Drama"],

    posterUrl: "/assets/movie-posters/ddlj.jpg",    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",

    year: 1995,    difficulty: "medium"

    genre: ["Drama", "Romance"],  },

    difficulty: "hard",  {

  },    id: "avengers",

  {    title: "The Avengers",

    id: "sooryavansham",    posterUrl: "/assets/movie-posters/avengers.jpg",

    title: "Sooryavansham",    year: 2012,

    posterUrl: "/assets/movie-posters/sooryavansham.jpg",    genre: ["Action", "Adventure", "Sci-Fi"],

    year: 1999,    description: "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",

    genre: ["Drama", "Family"],    difficulty: "medium"

    difficulty: "hard",  },

  },  {

];    id: "frozen",

    title: "Frozen",

export const getMovieByTitle = (title: string): Movie | undefined => {    posterUrl: "/assets/movie-posters/frozen.jpg",

  return MOVIES.find(    year: 2013,

    (movie) => movie.title.toLowerCase() === title.toLowerCase()    genre: ["Animation", "Adventure", "Comedy"],

  );    description: "When the newly crowned Queen Elsa accidentally uses her power to turn things into ice to curse her home in infinite winter, her sister Anna teams up with a mountain man, his playful reindeer, and a snowman to change the weather condition.",

};    difficulty: "medium"
  },
  {
    id: "toy-story",
    title: "Toy Story",
    posterUrl: "/assets/movie-posters/toy-story.jpg",
    year: 1995,
    genre: ["Animation", "Adventure", "Comedy"],
    description: "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
    difficulty: "medium"
  },
  {
    id: "star-wars",
    title: "Star Wars",
    posterUrl: "/assets/movie-posters/star-wars.jpg",
    year: 1977,
    genre: ["Action", "Adventure", "Fantasy"],
    description: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the evil Darth Vader.",
    difficulty: "medium"
  },
  {
    id: "back-to-future",
    title: "Back to the Future",
    posterUrl: "/assets/movie-posters/back-to-future.jpg",
    year: 1985,
    genre: ["Adventure", "Comedy", "Sci-Fi"],
    description: "Marty McFly, a 17-year-old high school student, is accidentally sent thirty years into the past in a time-traveling DeLorean invented by his close friend, the eccentric scientist Doc Brown.",
    difficulty: "medium"
  },

  // Hard Movies
  {
    id: "citizen-kane",
    title: "Citizen Kane",
    posterUrl: "/assets/movie-posters/citizen-kane.jpg",
    year: 1941,
    genre: ["Drama", "Mystery"],
    description: "Following the death of publishing tycoon Charles Foster Kane, reporters scramble to uncover the meaning of his final utterance; 'Rosebud'.",
    difficulty: "hard"
  },
  {
    id: "casablanca",
    title: "Casablanca",
    posterUrl: "/assets/movie-posters/casablanca.jpg",
    year: 1942,
    genre: ["Drama", "Romance", "War"],
    description: "A cynical American expatriate struggles to decide whether or not he should help his former lover and her fugitive husband escape French Morocco.",
    difficulty: "hard"
  },
  {
    id: "psycho",
    title: "Psycho",
    posterUrl: "/assets/movie-posters/psycho.jpg",
    year: 1960,
    genre: ["Horror", "Mystery", "Thriller"],
    description: "A Phoenix secretary embezzles forty thousand dollars from her employer's client, goes on the run, and checks into a remote motel run by a young man under the domination of his mother.",
    difficulty: "hard"
  },
  {
    id: "vertigo",
    title: "Vertigo",
    posterUrl: "/assets/movie-posters/vertigo.jpg",
    year: 1958,
    genre: ["Mystery", "Romance", "Thriller"],
    description: "A former police detective juggles wrestling with his personal demons and becoming obsessed with a hauntingly beautiful woman.",
    difficulty: "hard"
  },
  {
    id: "sunset-boulevard",
    title: "Sunset Boulevard",
    posterUrl: "/assets/movie-posters/sunset-boulevard.jpg",
    year: 1950,
    genre: ["Drama", "Film-Noir"],
    description: "A screenwriter is hired to rework a faded silent film star's script, only to find himself developing a dangerous relationship.",
    difficulty: "hard"
  },
  {
    id: "singin-in-rain",
    title: "Singin' in the Rain",
    posterUrl: "/assets/movie-posters/singin-in-rain.jpg",
    year: 1952,
    genre: ["Comedy", "Musical", "Romance"],
    description: "A silent film production company and cast make a difficult transition to sound.",
    difficulty: "hard"
  }
];

// Helper functions
export const getRandomMovie = (difficulty?: "easy" | "medium" | "hard"): Movie => {
  const filteredMovies = difficulty
    ? MOVIES.filter((movie) => movie.difficulty === difficulty)
    : MOVIES;

  const randomIndex = Math.floor(Math.random() * filteredMovies.length);
  return filteredMovies[randomIndex];
};

export const getMovieByTitle = (title: string): Movie | undefined => {
  return MOVIES.find((movie) => movie.title === title);
};

export const getMoviesByDifficulty = (difficulty: "easy" | "medium" | "hard"): Movie[] => {
  return MOVIES.filter((movie) => movie.difficulty === difficulty);
};