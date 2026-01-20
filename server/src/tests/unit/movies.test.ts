import { describe, it, expect } from 'vitest';
import { getRandomMovie, MOVIES } from '../../data/movies';

describe('getRandomMovie', () => {
  it('should return a movie from the MOVIES list', () => {
    const movie = getRandomMovie();
    expect(movie).toBeDefined();
    expect(MOVIES).toContain(movie);
  });

  it('should not return a movie that is in the excluded list', () => {
    const allMoviesExceptOne = new Set<string>();
    // Exclude all movies except the first one
    for (let i = 1; i < MOVIES.length; i++) {
      allMoviesExceptOne.add(MOVIES[i].id);
    }

    const movie = getRandomMovie(allMoviesExceptOne);
    expect(movie.id).toBe(MOVIES[0].id);
  });

  it('should return a movie even if all are excluded (fallback mechanism)', () => {
    const allMovieIds = new Set(MOVIES.map(m => m.id));
    const movie = getRandomMovie(allMovieIds);
    
    // It should return *some* movie (fallback behavior)
    expect(movie).toBeDefined();
    expect(MOVIES).toContain(movie);
  });

  it('should filter by difficulty if provided', () => {
    const easyMovie = getRandomMovie(new Set(), 'easy');
    expect(easyMovie.difficulty).toBe('easy');

    const hardMovie = getRandomMovie(new Set(), 'hard');
    expect(hardMovie.difficulty).toBe('hard');
  });
});
