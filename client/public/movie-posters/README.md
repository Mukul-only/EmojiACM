# Movie Posters Directory

This directory contains all the movie posters used in the Emoji Movie Guesser game.

## File Requirements

1. Each movie poster should be named according to its ID in `src/data/movies.ts`
   Example: For movie with `id: "matrix"`, the file should be `matrix.jpg`

2. File format: JPG/JPEG
3. Recommended size: 300x450 pixels
4. File naming pattern: `{movie-id}.jpg`

## Required Files

Easy Movies:
- matrix.jpg
- inception.jpg
- titanic.jpg
- lion-king.jpg
- forrest-gump.jpg
- jaws.jpg
- pulp-fiction.jpg
- godfather.jpg

Medium Movies:
- avatar.jpg
- interstellar.jpg
- dark-knight.jpg
- avengers.jpg
- frozen.jpg
- toy-story.jpg
- star-wars.jpg
- back-to-future.jpg

Hard Movies:
- citizen-kane.jpg
- casablanca.jpg
- psycho.jpg
- vertigo.jpg
- sunset-boulevard.jpg
- singin-in-rain.jpg

## Default Poster

Include a `default.jpg` file in this directory. It will be used as a fallback when a specific movie poster is not found.

## Optimization

1. Compress all images to reduce file size
2. Maintain aspect ratio of 2:3 (width:height)
3. Use JPG format for better compression
4. Keep file size under 100KB per image