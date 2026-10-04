import type { Movie } from "../../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (id: number) => void;
}

export default function MovieGrid({ movies, onToggleBookmark }: MovieGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onToggleBookmark={onToggleBookmark} />
      ))}
    </ul>
  );
}
