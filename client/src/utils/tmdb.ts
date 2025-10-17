// TMDB API Configuration
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Check if API key is configured
const isTMDBConfigured = () => {
  if (!TMDB_API_KEY || TMDB_API_KEY === 'YOUR_TMDB_API_KEY') {
    console.warn('TMDB API key not configured. Movie posters will use fallback images.');
    return false;
  }
  return true;
};

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
}

/**
 * Get poster URL from TMDB
 * @param posterPath - The poster path from TMDB
 * @param size - Image size (w92, w154, w185, w342, w500, w780, original)
 */
export const getTMDBPosterUrl = (posterPath: string | null, size: 'w500' | 'w780' | 'original' = 'w500'): string => {
  if (!posterPath) {
    return 'https://via.placeholder.com/500x750/1a1a1a/ffffff?text=No+Poster';
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
};

/**
 * Search for a movie by title and year
 */
export const searchMovie = async (title: string, year?: number): Promise<TMDBMovie | null> => {
  // Check if TMDB is configured
  if (!isTMDBConfigured()) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      query: title,
      ...(year && { year: year.toString() }),
    });

    const response = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`);
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('TMDB API error: Invalid API key. Please check your VITE_TMDB_API_KEY in .env file');
      } else {
        console.error('TMDB API error:', response.status, response.statusText);
      }
      return null;
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching movie from TMDB:', error);
    return null;
  }
};

/**
 * Get movie details by TMDB ID
 */
export const getMovieById = async (tmdbId: number): Promise<TMDBMovie | null> => {
  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
    });

    const response = await fetch(`${TMDB_BASE_URL}/movie/${tmdbId}?${params}`);
    
    if (!response.ok) {
      console.error('TMDB API error:', response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details from TMDB:', error);
    return null;
  }
};
