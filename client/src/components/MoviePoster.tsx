import React from "react";
import type { Movie } from "../data/movies";

interface MoviePosterProps {
  movie: Movie;
  className?: string;
}

const MoviePoster: React.FC<MoviePosterProps> = ({ movie, className = "" }) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Poster Container */}
      <div className="relative overflow-hidden rounded-2xl border border-white/20 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] w-full">
          <img
            src={movie.posterUrl}
            alt={`${movie.title} movie poster`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(
                movie.title
              )}`;
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Movie Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white drop-shadow-lg">
                {movie.title}
              </h3>
              <p className="text-xs text-white/80">
                {movie.description.split(" ").slice(0, 10).join(" ") + "..."}
              </p>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <span className="bg-white/20 px-2 py-1 rounded-full">
                  {movie.year}
                </span>
                <span className="bg-white/20 px-2 py-1 rounded-full">
                  {movie.difficulty}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {movie.genre.map((genre, index) => (
                  <span
                    key={index}
                    className="text-xs bg-[#7BFF66]/20 text-[#7BFF66] px-2 py-1 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#7BFF66]/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default MoviePoster;